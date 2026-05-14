"""
TREQE Matching Algorithm v1.3 — FINAL CORREGIDO
Revisado por DeepSeek V4 Pro (14 Mayo 2026)

Correcciones sobre v1.2:
  🔴 #1: Ciclo como lista ordenada (no set) → compensación determinista
  🟡 #2: cycle.user_ids implementado + get_user_response() definida
  🟡 #3: on_cycle_rejected() solo bloquea pares del rechazador
  🟡 #5: rejected_pairs con TTL de 7 días
  🟢 #6: Validación de price en compensación
  🟢 #7: default_reputation leído de CONFIG
"""

from datetime import datetime, timedelta
from dataclasses import dataclass, field
from typing import Dict, Set, List, Tuple, FrozenSet, Optional
import time as time_module
import redis  # Para lock anti-concurrencia (Redis ya está en el stack)

# =============================================================================
# CONFIGURACIÓN
# =============================================================================

CONFIG = {
    "time_limits": {2: 0.1, 3: 0.5, 4: 2.0, 5: 5.0},
    "max_total_time": 10.0,           # Máx 10s por batch
    "batch_interval": 900,            # 15 min entre lotes
    "max_degree": 50,                 # Límite vecinos en k≥4
    "match_timeout_hours": 24,        # Igual para todos
    "default_reputation": 3.0,        # Reputación inicial nuevos usuarios
    "reputation_max": 5.0,
    "reputation_min": 0.0,
    "rejection_ttl_days": 7,         # TTL para pares rechazados
    "min_time_slice": 0.05,           # 50ms mínimo para intentar búsqueda
    "redis_lock_ttl": 30,             # 30s TTL para lock de algoritmo (evita deadlock)
}

# =============================================================================
# ESTRUCTURAS DE DATOS
# =============================================================================

@dataclass
class Cycle:
    """
    Ciclo de intercambio circular.
    
    article_ids: [a1, a2, ..., ak] donde a_i → a_{i+1} → ... → ak → a1
    El ORDEN es crítico para el cálculo de compensación.
    """
    article_ids: List[str]            # ← LISTA ORDENADA (corrección #1)
    score: float
    
    @property
    def article_set(self) -> FrozenSet[str]:
        """Para verificaciones de solapamiento O(1)."""
        return frozenset(self.article_ids)
    
    @property
    def user_ids(self) -> Set[str]:   # ← IMPLEMENTADO (corrección #2)
        """Usuarios únicos en este ciclo."""
        return {articles[aid]["user_id"] for aid in self.article_ids}
    
    @property
    def compensation(self) -> Dict[str, float]:
        """Calculado una vez, cacheado."""
        if not hasattr(self, '_compensation'):
            self._compensation = calculate_compensation(self.article_ids)
        return self._compensation

# Almacenes globales (en producción: bases de datos)
users: Dict[str, dict] = {}
articles: Dict[str, dict] = {}

# Pares rechazados con TTL (corrección #5)
rejected_pairs: Dict[FrozenSet[str], float] = {}
# {frozenset({art_A, art_B}): timestamp_unix}

# Índices del grafo
index_outgoing: Dict[str, Set[str]] = {}   # art → {arts que quiere}
index_incoming: Dict[str, Set[str]] = {}   # art → {arts que lo quieren}

# =============================================================================
# FUNCIONES DE UTILIDAD
# =============================================================================

def now() -> float:
    """Timestamp Unix actual."""
    return time_module.time()

def get_user_reputation(user_id: str) -> float:
    """Reputación del usuario, con default de CONFIG (corrección #7)."""
    return users.get(user_id, {}).get("reputation", CONFIG["default_reputation"])

def get_user_response(user_id: str, cycle_id: str) -> Optional[str]:
    """
    Consulta la respuesta de un usuario a un ciclo específico. (corrección #2)
    En producción: consulta a la tabla de respuestas en BD.
    
    Returns: "accepted" | "rejected" | "ignored" | None (sin responder aún)
    """
    # TODO: Implementar con consulta a base de datos
    # SELECT response FROM cycle_responses WHERE user_id = ? AND cycle_id = ?
    pass

def is_pair_rejected(art_a: str, art_b: str) -> bool:
    """
    Verifica si un par de artículos fue rechazado y no ha expirado. (corrección #5)
    """
    pair = frozenset({art_a, art_b})
    if pair in rejected_pairs:
        ttl = CONFIG["rejection_ttl_days"] * 86400
        if now() - rejected_pairs[pair] < ttl:
            return True
        else:
            del rejected_pairs[pair]  # Expiró
    return False

# =============================================================================
# 1. ALGORITMO PRINCIPAL
# =============================================================================

def find_cycles_adaptive() -> List[Cycle]:
    """
    Encuentra círculos de intercambio por tamaño creciente,
    respetando límites de tiempo y sin solapamiento de artículos.
    """
    available = {aid for aid, art in articles.items() 
                 if art["status"] == "disponible"}
    
    build_indices()
    
    found_cycles: List[Cycle] = []
    used_articles: Set[str] = set()
    total_time = 0.0
    
    k = 2
    while total_time < CONFIG["max_total_time"]:
        remaining = CONFIG["max_total_time"] - total_time
        time_limit = min(CONFIG["time_limits"].get(k, 2.0), remaining)
        
        if time_limit < CONFIG["min_time_slice"]:
            break
        
        start = now()
        
        cycles_k = find_cycles_of_size_k(
            k=k,
            available=available - used_articles,
            time_limit=time_limit
        )
        
        selected = select_optimal_cycles(cycles_k, used_articles)
        found_cycles.extend(selected)
        for cycle in selected:
            used_articles.update(cycle.article_set)
        
        elapsed = now() - start
        total_time += elapsed
        k += 1
    
    # Calcular compensación para cada ciclo
    for cycle in found_cycles:
        _ = cycle.compensation  # Trigger lazy calculation
    
    persist_cycles(found_cycles)
    notify_users(found_cycles)
    return found_cycles


def build_indices():
    """Construye índices de grafo a partir de solicitudes de trueque."""
    global index_outgoing, index_incoming
    index_outgoing.clear()
    index_incoming.clear()
    
    for article_id in articles:
        index_outgoing.setdefault(article_id, set())
        index_incoming.setdefault(article_id, set())
    
    # En producción: cargar desde tabla de solicitudes (wants)
    # SELECT from_article_id, to_article_id FROM wants
    # Para cada fila: index_outgoing[from_id].add(to_id)
    #                index_incoming[to_id].add(from_id)


# =============================================================================
# 2. BÚSQUEDA POR TAMAÑO k
# =============================================================================

def find_cycles_of_size_k(k: int, available: Set[str], 
                          time_limit: float) -> List[Cycle]:
    """Dispatch según tamaño de ciclo."""
    if k == 2:
        return find_cycles_k2(available, time_limit)
    elif k == 3:
        return find_cycles_k3(available, time_limit)
    else:
        return find_cycles_kN(k, available, time_limit)


# ---------------------------------------------------------------------------
# k=2: Intercambio directo — O(E)
# ---------------------------------------------------------------------------

def find_cycles_k2(available: Set[str], time_limit: float) -> List[Cycle]:
    """
    Busca pares A↔B donde ambos se quieren mutuamente.
    O(E) con verificación de índice inverso.
    """
    cycles = []
    start = now()
    seen = set()
    
    for a in available:
        if now() - start > time_limit:
            break
        
        for b in index_outgoing.get(a, set()) & available:
            if b in seen:
                continue
            
            # ¿Es recíproco? ¿A quiere B y B quiere A?
            if a in index_outgoing.get(b, set()):
                # Verificar que el par no fue rechazado
                if not is_pair_rejected(a, b):
                    cycles.append(Cycle(
                        article_ids=[a, b],   # ← LISTA ordenada
                        score=calculate_score([a, b])
                    ))
        
        seen.add(a)
    
    return cycles


# ---------------------------------------------------------------------------
# k=3: Intersección de conjuntos — O(E·d_avg)
# ---------------------------------------------------------------------------

def find_cycles_k3(available: Set[str], time_limit: float) -> List[Cycle]:
    """
    Para cada arista A→B:
      candidates = outgoing[B] ∩ incoming[A]
    Cada C en candidates completa el ciclo A→B→C→A.
    
    O(E·d_avg) — mucho más rápido que DFS para k=3.
    """
    cycles = []
    start = now()
    seen_pairs = set()
    
    for a in available:
        if now() - start > time_limit:
            break
        
        a_outgoing = index_outgoing.get(a, set()) & available
        
        for b in a_outgoing:
            if now() - start > time_limit:
                break
            
            # Evitar duplicados: ya procesamos este par
            pair_key = (a, b)
            if pair_key in seen_pairs:
                continue
            seen_pairs.add(pair_key)
            
            # Verificar rechazo previo del par A-B
            if is_pair_rejected(a, b):
                continue
            
            # Candidatos C: artículos que B quiere Y que quieren A
            b_outgoing = index_outgoing.get(b, set()) & available
            a_incoming = index_incoming.get(a, set()) & available
            candidates = b_outgoing & a_incoming
            
            for c in candidates:
                if c == a or c == b:
                    continue
                
                # Verificar rechazo previo de los otros pares
                if is_pair_rejected(a, c) or is_pair_rejected(b, c):
                    continue
                
                # ¡Ciclo encontrado! A→B→C→A
                # El orden [a, b, c] es EL orden correcto del ciclo
                cycles.append(Cycle(
                    article_ids=[a, b, c],   # ← LISTA ordenada (corrección #1)
                    score=calculate_score([a, b, c])
                ))
    
    return cycles


# ---------------------------------------------------------------------------
# k≥4: DFS con podas — O(E·d^{k-2}) limitado por tiempo
# ---------------------------------------------------------------------------

def find_cycles_kN(k: int, available: Set[str], 
                   time_limit: float) -> List[Cycle]:
    """
    DFS con backtracking y podas agresivas para ciclos de tamaño k≥4.
    """
    cycles = []
    start = now()
    global_start = start
    
    for start_article in sorted(available, 
                                key=lambda a: -get_user_reputation(articles[a]["user_id"])):
        if now() - start > time_limit:
            break
        
        path = [start_article]           # ← LISTA ordenada desde el principio
        visited = {start_article}
        
        dfs_extend(
            current=start_article,
            path=path,
            visited=visited,
            depth=1,
            target_length=k,
            start_article=start_article,
            available=available,
            cycles=cycles,
            time_limit=time_limit,
            global_start=global_start
        )
    
    return cycles


def dfs_extend(current: str, path: List[str], visited: Set[str],
               depth: int, target_length: int, start_article: str,
               available: Set[str], cycles: List[Cycle],
               time_limit: float, global_start: float):
    """Extensión recursiva del camino actual."""
    
    # Poda 1: Sin tiempo
    if now() - global_start > time_limit:
        return
    
    # Caso base: camino completo, cerrar el ciclo
    if depth == target_length:
        if start_article in index_outgoing.get(current, set()):
            # Verificar que ningún par del ciclo fue rechazado
            cycle_pairs = [
                (path[i], path[(i + 1) % target_length])
                for i in range(target_length)
            ]
            # Pares dentro del ciclo (no consecutivos también)
            all_pairs_ok = True
            for i in range(target_length):
                for j in range(i + 1, target_length):
                    if is_pair_rejected(path[i], path[j]):
                        all_pairs_ok = False
                        break
                if not all_pairs_ok:
                    break
            
            if all_pairs_ok:
                cycles.append(Cycle(
                    article_ids=list(path),  # ← LISTA ordenada
                    score=calculate_score(path)
                ))
        return
    
    # Poda 2: No hay suficientes candidatos restantes
    remaining = target_length - depth
    candidates = (index_outgoing.get(current, set()) & available) - visited
    if len(candidates) < 1:  # Necesitamos al menos 1 para continuar
        return
    
    # Poda 3: Explorar ordenados por reputación (mejores primero)
    sorted_candidates = sorted(
        candidates,
        key=lambda a: -get_user_reputation(articles[a]["user_id"])
    )[:CONFIG["max_degree"]]
    
    for next_article in sorted_candidates:
        # Verificar rechazo previo
        if is_pair_rejected(current, next_article):
            continue
        
        path.append(next_article)
        visited.add(next_article)
        
        dfs_extend(
            current=next_article,
            path=path,
            visited=visited,
            depth=depth + 1,
            target_length=target_length,
            start_article=start_article,
            available=available,
            cycles=cycles,
            time_limit=time_limit,
            global_start=global_start
        )
        
        # Backtrack
        path.pop()
        visited.remove(next_article)


# =============================================================================
# 3. SCORING Y SELECCIÓN
# =============================================================================

def calculate_score(article_ids: List[str]) -> float:
    """
    Score = reputación de usuarios únicos + age_bonus + size_bonus.
    
    Reputación domina (~80% del peso), age_bonus limitado a 1.0 por artículo.
    """
    unique_users = {articles[aid]["user_id"] for aid in article_ids}
    
    # Reputación (componente principal)
    total_score = sum(get_user_reputation(uid) for uid in unique_users)
    
    # Bonus por antigüedad (máx 1.0 por artículo, corregido de 3.0)
    age_bonus = sum(
        min(articles[aid].get("age_days", 0) / 30.0, 1.0) 
        for aid in article_ids
    )
    
    # Bonus por tamaño de ciclo (incentivo pequeño)
    size_bonus = len(article_ids) * 0.1
    
    return total_score + age_bonus + size_bonus


def select_optimal_cycles(candidates: List[Cycle], 
                          already_used: Set[str]) -> List[Cycle]:
    """
    Greedy: ordenar por score descendente, seleccionar sin solapamiento.
    No es óptimo global, pero tiene complejidad O(C·log C).
    """
    selected = []
    used = set(already_used)
    
    sorted_cycles = sorted(candidates, key=lambda c: -c.score)
    
    for cycle in sorted_cycles:
        if cycle.article_set & used:
            continue  # Solapamiento → descartar
        
        selected.append(cycle)
        used.update(cycle.article_set)
    
    return selected


# =============================================================================
# 4. COMPENSACIÓN ECONÓMICA
# =============================================================================

def calculate_compensation(article_ids: List[str]) -> Dict[str, float]:
    """
    Calcula cuánto paga/cobra cada usuario en un ciclo cerrado.
    
    Para un ciclo [a1, a2, ..., ak] donde a_i → a_{i+1} → ... → a_k → a_1:
    - El usuario de a_i da su artículo a a_{i+1} y recibe el de a_{i-1}
    - balance = valor_recibido - valor_dado
    
    Returns: {user_id: balance}
      balance > 0 → el usuario DEBE PAGAR
      balance < 0 → el usuario DEBE COBRAR
    """
    n = len(article_ids)
    balances: Dict[str, float] = {}
    
    for i in range(n):
        giver_id = article_ids[i]
        receiver_id = article_ids[(i + 1) % n]
        
        giver_user = articles[giver_id]["user_id"]
        
        # Validación de precio (corrección #6)
        if "price" not in articles[giver_id]:
            raise ValueError(f"Artículo {giver_id} sin precio definido")
        if "price" not in articles[receiver_id]:
            raise ValueError(f"Artículo {receiver_id} sin precio definido")
        
        valor_que_da = articles[giver_id]["price"]
        valor_que_recibe = articles[receiver_id]["price"]
        
        diff = valor_que_recibe - valor_que_da
        balances[giver_user] = balances.get(giver_user, 0.0) + diff
    
    # Verificar conservación: la suma SIEMPRE es 0 en un ciclo cerrado
    total = sum(balances.values())
    assert abs(total) < 0.01, \
        f"Error de conservación: suma de compensaciones = {total}, esperado 0"
    
    return balances


# =============================================================================
# 5. MANEJO DE RECHAZOS Y TIMEOUTS
# =============================================================================

def on_cycle_rejected(cycle: Cycle, rejector_user_id: str):
    """
    Cuando un usuario rechaza explícitamente un match. (corrección #3)
    
    SOLO bloquea pares que involucran al rechazador.
    Los otros pares pueden reutilizarse en futuros ciclos.
    """
    # Liberar TODOS los artículos del ciclo
    for article_id in cycle.article_ids:
        articles[article_id]["status"] = "disponible"
    
    # Bloquear SOLO pares que involucran al rechazador (corrección #3)
    rejector_articles = {
        aid for aid in cycle.article_ids 
        if articles[aid]["user_id"] == rejector_user_id
    }
    
    timestamp = now()
    for blocked_art in rejector_articles:
        for other_art in cycle.article_ids:
            if blocked_art != other_art:
                rejected_pairs[frozenset({blocked_art, other_art})] = timestamp
    
    # Actualizar reputación
    update_reputation_after_cycle(cycle, rejector_user_id, "rejected")


def on_cycle_timeout(cycle: Cycle, timed_out_user_ids: Set[str]):
    """
    Cuando uno o más usuarios no responden en 24h.
    Bloquea SOLO pares que involucran a los que hicieron timeout.
    """
    # Liberar artículos
    for article_id in cycle.article_ids:
        articles[article_id]["status"] = "disponible"
    
    # Bloquear pares con los usuarios que hicieron timeout
    timeout_articles = {
        aid for aid in cycle.article_ids
        if articles[aid]["user_id"] in timed_out_user_ids
    }
    
    timestamp = now()
    for blocked_art in timeout_articles:
        for other_art in cycle.article_ids:
            if blocked_art != other_art:
                rejected_pairs[frozenset({blocked_art, other_art})] = timestamp
    
    # Penalizar a los que ignoraron
    for uid in timed_out_user_ids:
        users[uid]["reputation"] = max(
            CONFIG["reputation_min"],
            users[uid].get("reputation", CONFIG["default_reputation"]) - 0.1
        )


def update_reputation_after_cycle(cycle: Cycle, event_user_id: str, 
                                   event_type: str):
    """
    Actualiza reputación según las reglas del sistema de scoring.
    
    +0.2 → aceptó en <4h
    +0.1 → aceptó en 4-24h
     0.0 → rechazó explícitamente
    -0.1 → ignoró / timeout
    """
    for uid in cycle.user_ids:
        if uid == event_user_id and event_type == "rejected":
            continue  # Rechazo explícito: sin penalización
        
        response = get_user_response(uid, cycle_id=id(cycle))
        
        if response == "accepted":
            # Bonus según tiempo de respuesta
            # En producción: calcular tiempo desde creación del ciclo
            users[uid]["reputation"] = min(
                CONFIG["reputation_max"],
                users[uid].get("reputation", CONFIG["default_reputation"]) + 0.1
            )
        elif response is None:  # Timeout / ignorado
            users[uid]["reputation"] = max(
                CONFIG["reputation_min"],
                users[uid].get("reputation", CONFIG["default_reputation"]) - 0.1
            )


# =============================================================================
# 6. PERSISTENCIA Y NOTIFICACIONES (stubs)
# =============================================================================

def persist_cycles(cycles: List[Cycle]):
    """Persiste los ciclos encontrados en base de datos."""
    # TODO: INSERT INTO cycles (cycle_id, article_ids, score, created_at)
    pass

def notify_users(cycles: List[Cycle]):
    """Envía notificaciones push/email a los usuarios de los ciclos."""
    # TODO: Para cada ciclo, para cada usuario, enviar notificación
    pass

def get_available_articles() -> Set[str]:
    """Obtiene artículos con status='disponible'."""
    return {aid for aid, art in articles.items() if art["status"] == "disponible"}


# =============================================================================
# 7. SISTEMA DE REPUTACIÓN
# =============================================================================

SCORING_RULES = {
    "accept_fast":     +0.2,   # < 4 horas
    "accept_normal":   +0.1,   # 4-24 horas
    "reject_explicit":  0.0,   # Rechazo explícito (sin penalización)
    "ignore_timeout":  -0.1,   # Timeout / ignorar
}

# =============================================================================
# 8. LOCK ANTI-CONCURRENCIA (REDIS)
# =============================================================================

# Conexión Redis (ya está en el stack del mapa)
_redis: Optional[redis.Redis] = None

def get_redis() -> redis.Redis:
    """Conexión lazy a Redis."""
    global _redis
    if _redis is None:
        _redis = redis.Redis(
            host="localhost", port=6379, db=0,
            decode_responses=True
        )
    return _redis


def run_algorithm_safe() -> dict:
    """
    Wrapper seguro con lock distribuido.
    
    Evita ejecuciones concurrentes cuando el cron de 15 min
    coincide con un trigger on-demand.
    
    Returns:
        {"status": "ok", "cycles_found": N, "cycles_created": M}
        {"status": "skipped", "reason": "already_running"}
        {"status": "error", "reason": "..."}
    """
    r = get_redis()
    lock_key = "algorithm:lock"
    
    # Intentar adquirir lock con TTL (evita deadlock si el proceso muere)
    acquired = r.set(lock_key, "1", nx=True, ex=CONFIG["redis_lock_ttl"])
    
    if not acquired:
        return {"status": "skipped", "reason": "already_running"}
    
    try:
        cycles = find_cycles_adaptive()
        return {
            "status": "ok",
            "cycles_found": len(cycles),
            "cycles_created": len([c for c in cycles if c.article_ids]),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        return {"status": "error", "reason": str(e)}
    finally:
        # Liberar lock
        r.delete(lock_key)


# =============================================================================
# 9. API ENDPOINT HANDLER
# =============================================================================

# ------ FastAPI ------ #
"""
from fastapi import APIRouter, BackgroundTasks

router = APIRouter(prefix="/api/algorithm", tags=["algorithm"])

@router.post("/run")
async def run_algorithm(background: BackgroundTasks):
    '''
    POST /api/algorithm/run
    
    Ejecuta el algoritmo de matching circular.
    Llamado por: cron job (cada 15 min) + trigger on-demand (nueva oferta).
    Protegido contra ejecuciones concurrentes con Redis lock.
    '''
    result = run_algorithm_safe()
    
    if result["status"] == "ok":
        return {
            "cycles_found": result["cycles_found"],
            "cycles_created": result["cycles_created"]
        }
    elif result["status"] == "skipped":
        # 200 OK pero sin acción — el frontend lo interpreta
        return {"cycles_found": 0, "cycles_created": 0, "skipped": True}
    else:
        raise HTTPException(status_code=500, detail=result["reason"])
"""

# ------ Express/Node.js ------ #
"""
const redis = require('redis');
const client = redis.createClient();

app.post('/api/algorithm/run', async (req, res) => {
    const acquired = await client.set('algorithm:lock', '1', {
        NX: true,
        EX: 30
    });
    
    if (!acquired) {
        return res.json({ cycles_found: 0, cycles_created: 0, skipped: true });
    }
    
    try {
        const result = await findCyclesAdaptive();
        await client.del('algorithm:lock');
        return res.json({
            cycles_found: result.length,
            cycles_created: result.filter(c => c.articleIds.length).length
        });
    } catch (err) {
        await client.del('algorithm:lock');
        return res.status(500).json({ error: err.message });
    }
});
"""


# =============================================================================
# HISTORIAL DE VERSIONES
# =============================================================================
"""
v1.0 (25 Abr 2026)  — Algoritmo inicial con k=2, k=3, k≥4
v1.1 (25 Abr 2026)  — Revisión DeepSeek V4 Pro: 6 correcciones
v1.2 (14 May 2026)  — Corrección de issues críticos: ciclos ordenados,
                       compensación, memoria de rechazos
v1.3 (14 May 2026)  — Lock anti-concurrencia Redis, endpoint API handler
"""

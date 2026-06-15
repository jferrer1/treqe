"""Algorithm worker — ejecuta find_cycles_adaptive en background."""
import json, sys, os, asyncio
from datetime import datetime

try:
    from redis import Redis
    redis_client = Redis.from_url("redis://localhost:6379", decode_responses=True)
except (ImportError, Exception):
    redis_client = None

from .celery_app import celery_app


@celery_app.task(name="src.workers.algorithm_worker.run_algorithm")
def run_algorithm(trigger: str = "scheduled"):
    """
    Ejecuta el algoritmo de matching circular.
    
    Disparado por:
    - Celery Beat (cada 15 min) -> trigger="scheduled"
    - Nueva oferta (POST /api/offers) -> trigger="new_offer"
    """
    print(f"[algorithm_worker] Running (trigger={trigger})")

    try:
        cycles_found = _run_matching_sync()
        
        # Notificar participantes via Redis Pub/Sub
        for cycle in cycles_found:
            for user_id in cycle.get("user_ids", []):
                notification = {
                    "type": "new_match",
                    "title": "Nuevo intercambio encontrado!",
                    "body": f"Se encontro un circulo de {cycle.get('size', 0)} articulos",
                    "action_url": "/treqes",
                    "reference_id": cycle.get("id", ""),
                    "timestamp": datetime.utcnow().isoformat(),
                }
                if redis_client:
                    redis_client.publish(f"user:{user_id}", json.dumps(notification))
        
        print(f"[algorithm_worker] Found {len(cycles_found)} cycles")
        return {"cycles_found": len(cycles_found), "trigger": trigger}
    except Exception as e:
        print(f"[algorithm_worker] Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return {"error": str(e)}


def _run_matching_sync():
    """
    Ejecuta el algoritmo de matching usando una conexion sincrona a PostgreSQL.
    Carga ofertas activas, construye el grafo, busca ciclos, y persiste matches.
    """
    import sqlalchemy
    from sqlalchemy import text
    
    # Build sync database URL from env
    db_url = os.environ.get("DATABASE_URL", "sqlite:///treqe_dev.db")
    if db_url and "postgresql://" in db_url and "+" not in db_url.split("://")[1].split("://")[0] if "://" in db_url else True:
        # Railway gives postgresql:// without driver prefix
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    
    try:
        engine = sqlalchemy.create_engine(db_url)
        with engine.connect() as conn:
            # Load active products
            products = {}
            rows = conn.execute(text("SELECT id, user_id, title, price, status FROM products WHERE status = 'active'"))
            for row in rows:
                products[row[0]] = {
                    "id": row[0], "user_id": row[1], "title": row[2],
                    "price": float(row[3] or 0), "status": row[4]
                }
            
            # Load active offers (pending/accepted)
            rows = conn.execute(text(
                "SELECT id, user_id, product_id_wants, product_id_offers, status FROM offers WHERE status IN ('active', 'pending')"
            ))
            
            # Build graph: who wants what
            wants = {}  # product_id -> [product_ids that want it]
            offers_map = {}  # (from_user, wants_product) -> offer_id
            user_offers = {}  # user_id -> [offer_ids]
            
            for row in rows:
                oid, from_uid, wants_pid, offers_pid, status = row
                if wants_pid not in wants:
                    wants[wants_pid] = set()
                wants[wants_pid].add(offers_pid)
                offers_map[(from_uid, wants_pid)] = oid
                if from_uid not in user_offers:
                    user_offers[from_uid] = []
                user_offers[from_uid].append(oid)
            
            print(f"[algorithm_worker] Loaded {len(products)} products, {len(wants)} wants")
            
            # Find cycles (simple DFS)
            cycles = find_cycles(products, wants)
            print(f"[algorithm_worker] Found {len(cycles)} cycles: {cycles}")
            
            # Create match records and notifications
            for cycle in cycles:
                article_ids = cycle["article_ids"]
                user_ids = cycle["user_ids"]
                score = cycle["score"]
                
                # Create match
                match_id = str(__import__('uuid').uuid4())
                conn.execute(text(
                    "INSERT INTO matches (id, article_ids, user_ids, status, score, created_at) "
                    "VALUES (:id, :aids, :uids, 'pending', :score, :now)"
                ), {"id": match_id, "aids": json.dumps(article_ids), "uids": json.dumps(user_ids),
                    "score": score, "now": datetime.utcnow()})
                
                # Create notifications for each user in the cycle
                for uid in user_ids:
                    notif_id = str(__import__('uuid').uuid4())
                    conn.execute(text(
                        "INSERT INTO notifications (id, user_id, type, title, message, reference_id, created_at, is_read) "
                        "VALUES (:id, :uid, 'new_match', :title, :msg, :ref, :now, false)"
                    ), {
                        "id": notif_id, "uid": uid,
                        "title": "Nuevo intercambio encontrado!",
                        "msg": f"Se encontro un circulo de {len(article_ids)} articulos. Revisa tus Treqes!",
                        "ref": match_id, "now": datetime.utcnow()
                    })
                
                # Update offer statuses to matched (mark related offers)
                for aid in article_ids:
                    conn.execute(text(
                        "UPDATE offers SET status = 'matched' WHERE (product_id_wants = :pid OR product_id_offers = :pid) AND status = 'active'"
                    ), {"pid": aid})
            
            conn.commit()
            
        engine.dispose()
        return cycles
        
    except Exception as e:
        print(f"[algorithm_worker] DB error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        return []


def find_cycles(products, wants):
    """
    Busca ciclos en el grafo de intercambios.
    
    products: {id: {user_id, title, price, status}}
    wants: {product_id_wants: {product_id_offers that want it}}
    
    Returns list of {article_ids, user_ids, score}
    """
    from collections import defaultdict
    
    cycles = []
    used = set()
    
    # Build adjacency: product -> products that want it
    # For each product A, find products B where B's owner wants A
    # i.e., B is offered in exchange for A
    
    # Build reverse: product_offered -> [products_wanted]
    # This is the "gives" direction: user offers X to get Y
    # In our wants dict: wants[Y] contains [X1, X2, ...] (X offered for Y)
    # So the edge is X -> Y (offering X to get Y)
    
    # For k=2: find mutual wants A->B and B->A
    product_ids = list(products.keys())
    
    # Build outgoing edges: A -> B means someone offers A to get B
    outgoing = defaultdict(set)
    incoming = defaultdict(set)
    
    for wanted_pid, offered_pids in wants.items():
        for offered_pid in offered_pids:
            if offered_pid in products and wanted_pid in products:
                outgoing[offered_pid].add(wanted_pid)
                incoming[wanted_pid].add(offered_pid)
    
    # k=2: direct swaps (A wants B, B wants A)
    for a in product_ids:
        if a in used:
            continue
        for b in outgoing.get(a, set()):
            if b in used:
                continue
            if a in outgoing.get(b, set()):
                # Mutual want!
                ua = products[a]["user_id"]
                ub = products[b]["user_id"]
                if ua != ub:
                    score = 10.0  # Base score
                    cycles.append({
                        "id": str(__import__('uuid').uuid4()),
                        "article_ids": [a, b],
                        "user_ids": [ua, ub],
                        "size": 2,
                        "score": score
                    })
                    used.add(a)
                    used.add(b)
                    break
    
    # k=3: triangular cycles (A->B->C->A)
    for a in product_ids:
        if a in used:
            continue
        for b in outgoing.get(a, set()):
            if b in used or b == a:
                continue
            b_out = outgoing.get(b, set())
            a_in = incoming.get(a, set())
            candidates = b_out & a_in
            for c in candidates:
                if c in used or c == a or c == b:
                    continue
                ua = products[a]["user_id"]
                ub = products[b]["user_id"]
                uc = products[c]["user_id"]
                if len({ua, ub, uc}) == 3:  # All different users
                    score = 15.0
                    cycles.append({
                        "id": str(__import__('uuid').uuid4()),
                        "article_ids": [a, b, c],
                        "user_ids": [ua, ub, uc],
                        "size": 3,
                        "score": score
                    })
                    used.update([a, b, c])
    
    return cycles

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

interface Match {id:string;match_id:string;status:string;my_item?:any;other_item?:any;other_user?:any;timer_end?:string;type?:string;price?:number;participants?:any[];circular_id?:string;cash_diff?:number}

const EM=["🎸","📱","🎮","📷","⌚","🎧","🚲","💻","📚","🎯","🖥️","🎹","🏍️","🎾","🛋️","☕","👟","👜","🎻","📦"];
function hs(s:string):number{let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return Math.abs(h)}
function bg(id:string):string{const c=["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#2A1A1A"];return c[hs(id)%c.length]}
function em(id:string):string{return EM[hs(id)%EM.length]}

function timeLeft(dateStr: string|null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr).getTime() - Date.now();
  if (d <= 0) return "Expirado";
  const h = Math.floor(d/3600000);
  const m = Math.floor((d%3600000)/60000);
  return h>0 ? `Quedan ${h}h ${m}min` : `Quedan ${m}min`;
}

const BASE = import.meta.env.BASE_URL;
const KEYS = ["active","pending","in_progress","completed"] as const;
const LABELS = ["Activos","Pendientes","En curso","Completados"];
const BADGE:Record<string,{html:string;cls:string}> = {
  active: {html:'<i class="fas fa-star"></i> Match encontrado', cls:"badge-active"},
  pending: {html:'<i class="fas fa-clock"></i> Pendiente', cls:"badge-pending"},
  in_progress: {html:'<i class="fas fa-truck"></i> En camino', cls:"badge-progress"},
  completed: {html:'<i class="fas fa-check-circle"></i> Completado', cls:"badge-done"},
};

function renderMatchCard(m: Match, participants: any[]|undefined, currentUserId: string): string {
  const badge = BADGE[m.status] || BADGE.pending;
  const id = (m.match_id || m.id || "").slice(-6);
  const parts = participants || [];
  
  // Timer: 24h from created_at
  const created = m.timer_end || (m as any).created_at;
  const expiresAt = created ? new Date(new Date(created).getTime() + 24*3600*1000).toISOString() : null;
  const t = timeLeft(expiresAt);

  // Purchase card (simple)
  if (m.type === "purchase") {
    const myTitle = m.my_item?.title || "Artículo";
    const myPrice = m.my_item?.price ? `€${m.my_item.price}` : "";
    return `<div class="match-card" style="border-left:3px solid var(--text,#1C1915)">
      <div class="match-card__header">
        <span class="match-card__id">#ORD-${id}</span>
        <span class="match-card__badge ${badge.cls}">${badge.html}</span>
      </div>
      <div class="match-card__item">
        <div class="match-card__img" style="background:${bg(m.my_item?.id||"0")}"><span>${em(m.my_item?.id||"0")}</span></div>
        <div class="match-card__info">
          <div class="match-card__title">${myTitle}</div>
          <div class="match-card__meta">de ${m.other_user?.name||"Vendedor"}${m.other_user?.location?" · "+m.other_user.location:""} · ${myPrice}</div>
        </div>
      </div>
      <div class="match-card__progress"><span><i class="fas fa-clock"></i> Esperando respuesta del vendedor</span></div>
      <div class="match-card__actions">
        <button class="action-btn action-btn--secondary" data-action="cancel" data-match-id="${m.id}">Cancelar</button>
      </div>
    </div>`;
  }

  // === MIB-STYLE TRADE CARD — uses participants from API ===
  // Find my participant record
  const myPart = parts.find((p: any) => p.user_id === currentUserId);
  const myIdx = myPart ? parts.indexOf(myPart) : -1;
  
  // Figure out what I receive (from previous participant) and what I give (my product)
  let receiveProduct = parts.length > 1 && myIdx >= 0 
    ? parts[(myIdx - 1 + parts.length) % parts.length].product 
    : null;
  let receiveUser = parts.length > 1 && myIdx >= 0
    ? parts[(myIdx - 1 + parts.length) % parts.length].user
    : null;
  let giveProduct = myPart?.product || null;
  let cashDiff = myPart?.cash_diff || 0;

  const receiveTitle = receiveProduct?.title || "Artículo";
  const receivePrice = receiveProduct?.price ? `€${receiveProduct.price}` : "";
  const giveTitle = giveProduct?.title || "Artículo";
  const givePrice = giveProduct?.price ? `€${giveProduct.price}` : "";
  const diffStr = cashDiff > 0 ? ` + €${cashDiff.toFixed(0)}` : cashDiff < 0 ? ` - €${Math.abs(cashDiff).toFixed(0)}` : "";
  const myEmoji = giveProduct?.photos?.[0] ? `<img src="${giveProduct.photos[0]}" style="width:100%;height:100%;object-fit:cover"/>` : `<span>${em(giveProduct?.id||"0")}</span>`;
  const otherEmoji = receiveProduct?.photos?.[0] ? `<img src="${receiveProduct.photos[0]}" style="width:100%;height:100%;object-fit:cover"/>` : `<span>${em(receiveProduct?.id||"1")}</span>`;

  // Circle rows (matching MIB v12)
  const circleRows = parts.map((p: any) => {
    const isMe = p.user_id === currentUserId;
    const icon = isMe ? `<div class="circle-avatar circle-avatar--me">TÚ</div>` : `<div class="circle-avatar">${(p.user?.name||"?")[0].toUpperCase()}</div>`;
    const name = isMe ? "Tú" : (p.user?.name || "Usuario");
    const pTitle = (p.product?.title || "Artículo");
    const truncated = pTitle.length > 22 ? pTitle.substring(0,20)+"…" : pTitle;
    const nextIdx = (parts.indexOf(p) + 1) % parts.length;
    const nextIsMe = parts[nextIdx]?.user_id === currentUserId;
    const nextName = nextIsMe ? "Tú" : (parts[nextIdx]?.user?.name || "?");
    const statusClass = p.status === "accepted" ? "circle-status--ok" : "circle-status--wait";
    const statusHtml = p.status === "accepted" 
      ? '<i class="fas fa-check"></i> Aceptado'
      : '<i class="fas fa-clock"></i> Decidir';
    return `<div class="circle-row">
      ${icon}
      <div class="circle-row__info">
        <span class="circle-row__name">${name}</span>
        <span class="circle-row__action"><i class="fas fa-gift" style="font-size:.4rem;margin-right:3px"></i>${truncated} → ${nextName}</span>
      </div>
      <span class="circle-row__status ${statusClass}">${statusHtml}</span>
    </div>`;
  }).join("");

  const matchId = m.id || m.match_id || "";
  
  return `<div class="match-card">
    <div class="match-card__header">
      <span class="match-card__id">#TRX-${id}</span>
      <span class="match-card__badge"><i class="fas fa-star" style="color:#E8B830;font-size:.55rem"></i> Match encontrado</span>
      ${t ? `<span class="match-card__timer-pill"><i class="far fa-clock"></i> ${t}</span>` : '<span class="match-card__timer-pill"><i class="far fa-clock"></i> 23:59:59</span>'}
    </div>
    
    <div class="match-hero">
      <div class="match-hero__side">
        <div class="match-hero__img" style="background:#FFF;border:1px solid var(--border,#E5E0D8)">${otherEmoji}</div>
        <div class="match-hero__title">${receiveTitle}</div>
        <div class="match-hero__meta">de ${receiveUser?.name||"Usuario"}</div>
        <div class="match-hero__price">${receivePrice}${diffStr}</div>
      </div>
      <div class="match-hero__arrow">
        <div class="match-hero__arrow-icon"><i class="fas fa-arrow-left"></i></div>
        <div class="match-hero__arrow-label">recibes</div>
      </div>
      <div class="match-hero__side">
        <div class="match-hero__img" style="background:#FFF;border:1px solid var(--border,#E5E0D8)">${myEmoji}</div>
        <div class="match-hero__title">${giveTitle}</div>
        <div class="match-hero__meta">das tú</div>
        <div class="match-hero__price">${givePrice}${diffStr}</div>
      </div>
    </div>

    <div class="circle-section">
      <div class="circle-section__label">CÍRCULO</div>
      ${circleRows}
    </div>

    ${m.status==="pending"||m.status==="active" ? `<div class="match-card__footer">
      <button class="mib-btn mib-btn--accept" data-action="accept" data-match-id="${matchId}"><i class="fas fa-check"></i> ACEPTAR</button>
      <button class="mib-btn mib-btn--reject" data-action="reject" data-match-id="${matchId}"><i class="fas fa-times"></i> RECHAZAR</button>
    </div>` : m.status==="in_progress"||m.status==="accepted" ? `<div class="match-card__progress"><span><i class="fas fa-truck"></i> Intercambio en curso</span></div>` : ''}
  </div>`;
}

export function MatchesPage(){
  const nav = useNavigate();
  const user = useAuthStore(s => s.user);
  const [styles, setStyles] = useState("");
  const [bottomNav, setBottomNav] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [tab, setTab] = useState("active");
  const hasToken = !!localStorage.getItem("treqe-token");
  // Decode user ID from JWT (doesn't depend on async auth check)
  const getUserId = () => {
    try {
      const token = localStorage.getItem("treqe-token");
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || "";
    } catch { return ""; }
  };
  const currentUserId = user?.id || getUserId();

  // MIB styles
  useEffect(()=>{fetch(`${BASE}mib/v12-mis-matches.html`).then(r=>r.text()).then(raw=>{
    const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
    const extraCSS = `
      .tabs { display: flex; gap: 8px; padding: 12px 16px; background: var(--bg,#F9F7F2); overflow-x: auto; scrollbar-width: none; }
      .tab { flex-shrink: 0; padding: 8px 16px; font-family: 'IBM Plex Mono', monospace; font-size: .52rem; font-weight: 500; text-transform: uppercase; letter-spacing: .1em; border: 1px solid var(--border,#E5E0D8); cursor: pointer; transition: all .2s; background: #FFF; color: #55504B; }
      .tab.active { background: #1C1915; color: #F9F7F2; border-color: #1C1915; }
      .tab .count { font-size: .45rem; opacity: .7; margin-left: 4px; }
      
      /* Match card - MIB v12 design */
      .match-card { background: var(--surface,#FFF); margin: 12px 16px; border: 1px solid var(--border,#E5E0D8); }
      .match-card__header { display: flex; align-items: center; gap: 10px; padding: 16px 18px 0; }
      .match-card__id { font-family: 'IBM Plex Mono', monospace; font-size: .6rem; font-weight: 600; color: var(--text,#1C1915); letter-spacing: .04em; }
      .match-card__badge { font-size: .6rem; color: var(--text,#1C1915); display: flex; align-items: center; gap: 5px; }
      .match-card__timer-pill { font-family: 'IBM Plex Mono', monospace; font-size: .52rem; color: #FFF; background: #1C1915; padding: 4px 10px; margin-left: auto; display: flex; align-items: center; gap: 5px; }
      
      /* Hero: RECIBES / DAS TÚ */
      .match-hero { display: flex; align-items: center; gap: 8px; padding: 18px; margin: 14px; background: var(--bg,#F9F7F2); }
      .match-hero__side { flex: 1; text-align: center; }
      .match-hero__img { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin: 0 auto 6px; overflow: hidden; }
      .match-hero__title { font-size: .8rem; font-weight: 600; color: var(--text,#1C1915); margin-bottom: 2px; }
      .match-hero__meta { font-size: .55rem; color: var(--text-dim,#8A8580); }
      .match-hero__price { font-family: 'IBM Plex Mono', monospace; font-size: .7rem; font-weight: 600; color: var(--text,#1C1915); margin-top: 3px; }
      .match-hero__arrow { display: flex; flex-direction: column; align-items: center; gap: 4px; flex-shrink: 0; }
      .match-hero__arrow-icon { color: var(--text,#1C1915); font-size: .7rem; }
      .match-hero__arrow-label { font-family: 'IBM Plex Mono', monospace; font-size: .4rem; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim,#8A8580); }
      
      /* Circle section */
      .circle-section { border-top: 1px solid var(--border,#E5E0D8); margin: 0 14px; padding: 14px 0; }
      .circle-section__label { font-family: 'IBM Plex Mono', monospace; font-size: .45rem; font-weight: 600; text-transform: uppercase; letter-spacing: .15em; color: var(--text-dim,#8A8580); margin-bottom: 12px; padding: 0 4px; }
      .circle-row { display: flex; align-items: center; gap: 12px; padding: 10px 4px; border-bottom: 1px solid var(--border,#F0EDE6); }
      .circle-row:last-child { border-bottom: none; }
      .circle-avatar { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: .6rem; font-weight: 600; background: #FFF; border: 1px solid var(--border,#E5E0D8); color: var(--text-dim,#8A8580); flex-shrink: 0; }
      .circle-avatar--me { background: #1C1915; color: #FFF; border-color: #1C1915; }
      .circle-row__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
      .circle-row__name { font-size: .7rem; font-weight: 600; color: var(--text,#1C1915); }
      .circle-row__action { font-size: .52rem; color: var(--text-dim,#8A8580); display: flex; align-items: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .circle-row__status { font-size: .5rem; font-weight: 500; padding: 4px 10px; border: 1px solid var(--border,#E5E0D8); white-space: nowrap; display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
      .circle-status--ok { border-color: #22c55e; color: #22c55e; }
      .circle-status--wait { color: var(--text,#1C1915); }
      
      /* Footer buttons */
      .match-card__footer { display: flex; gap: 0; border-top: 1px solid var(--border,#E5E0D8); }
      .mib-btn { flex: 1; padding: 18px 20px; font-family: 'IBM Plex Mono', monospace; font-size: .55rem; font-weight: 600; text-transform: uppercase; letter-spacing: .12em; cursor: pointer; border: none; display: flex; align-items: center; justify-content: center; gap: 6px; }
      .mib-btn--accept { background: #1C1915; color: #FFF; }
      .mib-btn--accept i { color: #22c55e; font-size: .6rem; }
      .mib-btn--reject { background: #FFF; color: #DC2626; border-right: none; }
      .mib-btn--reject i { color: #DC2626; font-size: .6rem; }
      
      /* Other status */
      .match-card__item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; }
      .match-card__img { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; border: 1px solid var(--border,#E5E0D8); flex-shrink: 0; overflow: hidden; }
      .match-card__info { flex: 1; min-width: 0; }
      .match-card__title { font-size: .85rem; font-weight: 500; color: var(--text,#1C1915); }
      .match-card__meta { font-family: 'IBM Plex Mono', monospace; font-size: .5rem; color: var(--text-dim,#8A8580); margin-top: 3px; }
      .match-card__progress { padding: 10px 16px; background: var(--bg,#F9F7F2); font-size: .6rem; color: var(--text-sub,#55504B); display: flex; align-items: center; gap: 6px; justify-content: space-between; }
      .match-card__actions { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--border,#E5E0D8); }
      .action-btn { flex: 1; padding: 10px 16px; font-family: 'IBM Plex Mono', monospace; font-size: .55rem; font-weight: 500; text-transform: uppercase; letter-spacing: .1em; cursor: pointer; border: none; }
      .action-btn--primary { background: #1C1915; color: #F9F7F2; }
      .action-btn--secondary { background: #FFF; color: #55504B; border: 1px solid var(--border,#E5E0D8); }
      .match-card__circle { display: flex; align-items: center; padding: 12px 16px; overflow-x: auto; gap: 0; scrollbar-width: none; }
      .circle-step { text-align: center; flex-shrink: 0; width: 90px; }
      .circle-step__img { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; font-size: 1rem; margin: 0 auto 4px; border: 1px solid var(--border,#E5E0D8); overflow: hidden; }
      .circle-step--me .circle-step__img { border: 2px solid #1C1915; }
      .circle-step__label { font-size: .6rem; font-weight: 500; color: var(--text,#1C1915); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .circle-step__user { font-size: .5rem; color: var(--text-dim,#8A8580); }
      .circle-step__status { font-size: .45rem; margin-top: 2px; }
      .circle-arrow { color: var(--text-dim,#8A8580); font-size: .5rem; padding: 0 4px; }
      .trade-compare { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
      .trade-compare__side { flex: 1; text-align: center; }
      .trade-compare__img { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 6px; border: 1px solid var(--border,#E5E0D8); overflow: hidden; }
      .trade-compare__label { font-family: 'IBM Plex Mono', monospace; font-size: .45rem; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: var(--text-dim,#8A8580); margin-bottom: 2px; }
      .trade-compare__title { font-size: .75rem; font-weight: 500; color: var(--text,#1C1915); }
      .trade-compare__user { font-size: .55rem; color: var(--text-dim,#8A8580); }
      .trade-compare__price { font-family: 'IBM Plex Mono', monospace; font-size: .65rem; font-weight: 600; color: var(--text,#1C1915); margin-top: 2px; }
      .trade-compare__icon { color: var(--text-dim,#8A8580); font-size: .8rem; }
      .trade-diff { display: flex; justify-content: space-between; padding: 10px 16px; background: var(--bg,#F9F7F2); border-top: 1px dashed var(--border,#E5E0D8); border-bottom: 1px dashed var(--border,#E5E0D8); font-family: 'IBM Plex Mono', monospace; font-size: .5rem; text-transform: uppercase; letter-spacing: .06em; }
      .notif-empty { text-align: center; padding: 80px 20px; }
      .notif-empty i { font-size: 2.4rem; display: block; margin-bottom: 16px; opacity: .2; color: var(--text-dim,#8A8580); }
    `;
    setStyles(sm ? `<style>${sm[1]}${extraCSS}</style>` : `<style>${extraCSS}</style>`);
    
    const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
    let body = bm ? bm[1] : "";
    const bn = body.indexOf('<nav class="bottom-nav">');
    if (bn > 0) {
      let nav = body.substring(bn);
      const navEnd = nav.indexOf('</nav>');
      if (navEnd > 0) nav = nav.substring(0, navEnd + 6);
      nav = nav.replace(/src="..\/..\/assets\/treqe-logo-mib\.png"/g, `src="${BASE}treqe-logo.png"`);
      const map: Record<string,string> = {"../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo","../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v8-ajustes/":"/ajustes","../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes","../v13-blog/":"/blog","../v13-favoritos/":"/favoritos"};
      for (const [k,v] of Object.entries(map)) nav = nav.split(k).join(v);
      nav = nav.replace(/\s+on\w+="[^"]*"/g, '');
      nav = nav.replace(/<script[\s\S]*?<\/script>/g, '');
      setBottomNav(nav);
    }
  })}, []);

  useEffect(()=>{
    if (!hasToken) return;
    (async()=>{
      try {
        const [mr, pr] = await Promise.all([
          api.get("/api/matches/"),
          api.get("/api/purchases/")
        ]);
        const trades = ((mr as any).items || mr || []).map((m: any) => ({...m, type: "trade"}));
        const seen = new Set<string>();
        const purchases = ((pr as any).items || pr || []).filter((p: any) => !seen.has(p.id) && seen.add(p.id)).map((p: any) => ({
          ...p, type: "purchase", id: p.id, match_id: p.id,
          my_item: p.product || {title: p.product?.title || "Artículo", price: p.price},
          other_item: {title: "Compra directa", price: p.price},
          other_user: p.seller || {name: "Vendedor"},
          status: p.status === "requested" ? "pending" : p.status === "accepted" ? "in_progress" : p.status
        }));
        setMatches([...trades, ...purchases]);
      } catch {}
    })();
  }, [hasToken]);

  // Action handler
  useEffect(()=>{
    const h = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("[data-action]") as HTMLElement|null;
      if (!btn) return;
      e.preventDefault(); e.stopPropagation();
      if (!user) { nav("/login"); return; }
      const id = btn.dataset.matchId || "";
      if (btn.dataset.action === "cancel") {
        api.post(`/api/purchases/${id}/cancel`).then(() => setMatches(prev => prev.map(m => m.id === id ? {...m, status:"cancelled"} : m))).catch(()=>{});
      } else {
        api.post(`/api/matches/${id}/${btn.dataset.action}`).then(() => setMatches(prev => prev.map(m => (m.id===id||m.match_id===id) ? {...m, status: btn.dataset.action==="accept"?"in_progress":"cancelled"} : m))).catch(()=>{});
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [styles, user, nav]);

  // Tab wire
  useEffect(()=>{
    const h = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest('#treqes-tab-0,#treqes-tab-1,#treqes-tab-2,#treqes-tab-3');
      if (btn) { const i = parseInt((btn as HTMLElement).id.replace('treqes-tab-','')); setTab(KEYS[i]); }
    };
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const counts = [
    matches.filter(m => (m.status==="active"||m.status==="pending"||m.status==="requested") && m.type!=="purchase").length,
    matches.filter(m => m.status==="requested" && m.type==="purchase").length,
    matches.filter(m => m.status==="in_progress"||m.status==="accepted").length,
    matches.filter(m => m.status==="completed").length,
  ];

  const filtered = matches.filter(m => {
    if (tab==="active") return (m.status==="active"||m.status==="pending"||m.status==="requested") && m.type!=="purchase";
    if (tab==="pending") return m.status==="requested" && m.type==="purchase";
    if (tab==="in_progress") return m.status==="in_progress"||m.status==="accepted";
    return m.status==="completed";
  });

  const tabsHtml = KEYS.map((k, i) =>
    `<button class="tab${tab===k?" active":""}" id="treqes-tab-${i}">${LABELS[i]} <span class="count">${counts[i]}</span></button>`
  ).join("");

  const cards = filtered.length === 0
    ? `<div class="notif-empty"><i class="fas fa-exchange-alt"></i><p style="font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">No hay treqes todavía</p><br><a href="/catalogo" style="font-family:'IBM Plex Mono',monospace;font-size:.55rem;padding:8px 20px;background:var(--text);color:var(--bg);cursor:pointer;letter-spacing:.08em;text-transform:uppercase;text-decoration:none">Explorar catálogo</a></div>`
    : filtered.map(m => renderMatchCard(m, m.participants, currentUserId)).join("");

  const header = `<div class="treqe-header"><button class="treqe-header__back" onclick="window.history.back()"><i class="fas fa-arrow-left"></i></button><span class="treqe-header__title">Mis Treqes</span><span class="treqe-header__right"></span></div>`;
  const cta = `<div class="notif-empty"><i class="fas fa-exchange-alt"></i><h2 style="font-family:'IBM Plex Sans',sans-serif;font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus treqes te esperan</h2><p style="font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesión para ver tus intercambios</p><a href="/login" style="font-family:'IBM Plex Mono',monospace;font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);cursor:pointer;letter-spacing:.1em;text-transform:uppercase;text-decoration:none">Iniciar sesión</a></div>`;

  if (!styles) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html:`${styles}${header}${hasToken ? `<div class="tabs">${tabsHtml}</div><div id="treqes-cards">${cards}</div>` : cta}${bottomNav}`}} />;
}

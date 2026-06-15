import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Notif {id:string;type:string;title:string;body:string|null;action_url:string|null;read:boolean;created_at:string}

const BASE = import.meta.env.BASE_URL;

// MIB-style notification templates per type
const NOTIF_TYPES: Record<string, {icon:string; color:string; label:string}> = {
  new_match:        {icon:"fa-handshake", color:"#1C1915", label:"¡Match encontrado!"},
  match_accepted:   {icon:"fa-check-circle", color:"#1C1915", label:"Match aceptado"},
  match_rejected:   {icon:"fa-times-circle", color:"#DC2626", label:"Match cancelado"},
  match_timeout:    {icon:"fa-clock", color:"#8A8580", label:"Match expirado"},
  new_offer:        {icon:"fa-exchange-alt", color:"#1C1915", label:"Quiere tu artículo"},
  offer_accepted:   {icon:"fa-check", color:"#1C1915", label:"Oferta aceptada"},
  purchase_buyer:   {icon:"fa-shopping-cart", color:"#1C1915", label:"Has comprado"},
  purchase_seller:  {icon:"fa-tag", color:"#1C1915", label:"Te han comprado"},
  shipping:         {icon:"fa-truck", color:"#1C1915", label:"Recordatorio envío"},
  review:           {icon:"fa-star", color:"#1C1915", label:"Valora tu experiencia"},
  system:           {icon:"fa-bell", color:"#8A8580", label:"treqe"},
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora";
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return `Hace ${Math.floor(hours / 24)} d`;
}

function renderNotif(n: Notif): string {
  const t = NOTIF_TYPES[n.type] || NOTIF_TYPES.system;
  const badge = !n.read ? '<div class="notif-badge"></div>' : '';
  return `<div class="notif-item${n.read?'':' notif-item--unread'}"${n.action_url?` onclick="window.location.hash='#${n.action_url}'"`:''}>
    <div class="notif-item__icon" style="background:${t.color}"><i class="fas ${t.icon}"></i></div>
    <div class="notif-item__body">
      <div class="notif-item__title">${n.title}</div>
      ${n.body ? `<div class="notif-item__text">${n.body}</div>` : ''}
      <div class="notif-item__time">${timeAgo(n.created_at)}</div>
    </div>
    ${badge}
  </div>`;
}

export function NotificationsPage(){
  const [styles, setStyles] = useState("");
  const [bottomNav, setBottomNav] = useState("");
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(()=>{fetch(`${BASE}mib/v11-notificaciones.html`).then(r=>r.text()).then(raw=>{
    const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
    const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
    // MIB custom styles for notifications
    const extraCSS = `
      .notif-list { max-width: 600px; margin: 0 auto; }
      .notif-item { display: flex; align-items: flex-start; gap: 14px; padding: 18px 20px; border-bottom: 1px solid var(--border,#E5E0D8); cursor: pointer; transition: background .15s; position: relative; }
      .notif-item:hover { background: rgba(0,0,0,.02); }
      .notif-item--unread { border-left: 3px solid #1C1915; background: rgba(28,25,21,.02); }
      .notif-item__icon { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #FFF; font-size: .85rem; }
      .notif-item__body { flex: 1; min-width: 0; }
      .notif-item__title { font-family: 'IBM Plex Sans', sans-serif; font-size: .82rem; font-weight: 600; color: var(--text,#1C1915); margin-bottom: 3px; }
      .notif-item__text { font-size: .75rem; color: var(--text-sub,#55504B); line-height: 1.4; }
      .notif-item__time { font-family: 'IBM Plex Mono', monospace; font-size: .5rem; color: var(--text-dim,#8A8580); margin-top: 6px; text-transform: uppercase; letter-spacing: .06em; }
      .notif-badge { width: 8px; height: 8px; background: #1C1915; border-radius: 50%; position: absolute; top: 22px; right: 20px; }
      .notif-empty { text-align: center; padding: 80px 20px; }
      .notif-empty i { font-size: 2.4rem; display: block; margin-bottom: 16px; opacity: .2; color: var(--text-dim,#8A8580); }
    `;
    setStyles((sm?`<style>${sm[1]}${extraCSS}</style>`:`<style>${extraCSS}</style>`));
    
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
        const r: any = await api.get("/api/notifications/");
        const seen = new Set<string>();
        setNotifs((r.items || r || []).filter((n: any) => !seen.has(n.id) && seen.add(n.id)));
        await api.post("/api/notifications/read-all");
      } catch {}
    })();
  }, [hasToken]);

  const header = `<div class="treqe-header"><button class="treqe-header__back" onclick="window.history.back()"><i class="fas fa-arrow-left"></i></button><span class="treqe-header__title">Avisos${notifs.length ? ` · ${notifs.length}` : ''}</span><span class="treqe-header__right"></span></div>`;
  
  const listHtml = notifs.length === 0
    ? `<div class="notif-empty"><i class="far fa-bell"></i><p style="font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">No tienes avisos todavía</p></div>`
    : `<div class="notif-list">${notifs.map(renderNotif).join("")}</div>`;

  const cta = `<div class="notif-empty"><i class="far fa-bell"></i><h2 style="font-family:'IBM Plex Sans',sans-serif;font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus avisos te esperan</h2><p style="font-family:'IBM Plex Mono',monospace;font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesión para ver tus notificaciones</p><a href="/login" style="font-family:'IBM Plex Mono',monospace;font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;text-decoration:none">Iniciar sesión</a></div>`;

  if (!styles) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html:`${styles}${header}${hasToken ? listHtml : cta}${bottomNav}`}} />;
}

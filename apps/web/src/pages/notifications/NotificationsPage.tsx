import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Notif {id:string;type:string;title:string;body:string|null;action_url:string|null;read:boolean;created_at:string}
const ICONS:Record<string,string>={purchase_buyer:"fa-shopping-cart",purchase_seller:"fa-tag",match_found:"fa-handshake",match_accepted:"fa-check-circle",match_rejected:"fa-times-circle",offer_received:"fa-exchange-alt",payment:"fa-credit-card",shipping:"fa-truck",review:"fa-star",system:"fa-bell"};
const COLORS:Record<string,string>={purchase_buyer:"#1C1915",purchase_seller:"#1C1915",match_found:"#1C1915",match_accepted:"#1C1915",match_rejected:"#DC2626",offer_received:"#1C1915",payment:"#1C1915",shipping:"#1C1915",review:"#1C1915",system:"#8A8580"};

const BASE = import.meta.env.BASE_URL;

export function NotificationsPage(){
  const[styles,setStyles]=useState("");const[bottomNav,setBottomNav]=useState("");
  const[notifs,setNotifs]=useState<Notif[]>([]);const hasToken=!!localStorage.getItem("treqe-token");

  useEffect(()=>{fetch(`${BASE}mib/v11-notificaciones.html`).then(r=>r.text()).then(raw=>{
    const sm=raw.match(/<style>([\s\S]*?)<\/style>/);
    const bm=raw.match(/<body>([\s\S]*?)<\/body>/);
    setStyles(sm?`<style>${sm[1]}</style>`:"");
    let body=bm?bm[1]:"";
    const bn=body.indexOf('<nav class="bottom-nav">');
    if(bn>0){
      let nav=body.substring(bn);
      const navEnd=nav.indexOf('</nav>');
      if(navEnd>0) nav=nav.substring(0,navEnd+6);
      nav=nav.replace(/src="..\/..\/assets\/treqe-logo-mib\.png"/g,`src="${BASE}treqe-logo.png"`);
      const map:Record<string,string>={"../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo","../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v8-ajustes/":"/ajustes","../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes","../v13-blog/":"/blog","../v13-favoritos/":"/favoritos"};
      for(const[k,v]of Object.entries(map))nav=nav.split(k).join(v);
      nav=nav.replace(/\s+on\w+="[^"]*"/g,'');
      nav=nav.replace(/<script[\s\S]*?<\/script>/g,'');
      setBottomNav(nav);
    }
  })},[]);

  useEffect(()=>{if(!hasToken)return;(async()=>{try{const r:any=await api.get("/api/notifications/");const seen=new Set<string>();setNotifs((r.items||r||[]).filter((n:any)=>!seen.has(n.id)&&seen.add(n.id)));await api.post("/api/notifications/read-all")}catch{}})()},[hasToken]);

  const header=`<div class="treqe-header"><button class="treqe-header__back" onclick="window.location.href='/catalogo'"><i class="fas fa-arrow-left"></i></button><span class="treqe-header__title">Avisos${notifs.length>0?` (${notifs.length})`:""}</span><span class="treqe-header__right"></span></div>`;
  const listHtml=notifs.length===0
    ?`<div style="text-align:center;padding:60px 20px;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em"><i class="far fa-bell" style="font-size:2rem;display:block;margin-bottom:16px;opacity:.3"></i>No tienes avisos todavía</div>`
    :notifs.map(n=>{const icon=ICONS[n.type]||"fa-bell";const color=COLORS[n.type]||"#8A8580";const date=new Date(n.created_at).toLocaleDateString("es-ES",{day:"numeric",month:"short"});return`<div class="notif-item" style="display:flex;align-items:flex-start;gap:12px;padding:16px;border-bottom:1px solid var(--border);${n.read?'opacity:.6':'border-left:3px solid #1C1915'}"${n.action_url?` onclick="window.location.href='${n.action_url}'"`:""}><div style="width:36px;height:36px;background:${color};display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas ${icon}" style="color:#FFF;font-size:.75rem"></i></div><div style="flex:1;min-width:0"><div style="font-size:.78rem;font-weight:500;color:var(--text)">${n.title}</div>${n.body?`<div style="font-size:.7rem;color:var(--text-sub);margin-top:2px">${n.body}</div>`:''}</div><span style="font-family:var(--font-mono);font-size:.5rem;color:var(--text-dim);white-space:nowrap">${date}</span></div>`}).join("");
  const cta=`<div style="text-align:center;padding:60px 20px"><i class="far fa-bell" style="font-size:2rem;display:block;margin-bottom:12px;color:var(--text-dim);opacity:.3"></i><h2 style="font-family:var(--font-sans);font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus avisos te esperan</h2><p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesión para ver tus notificaciones</p><a href="/login" style="font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;text-decoration:none">Iniciar sesión</a></div>`;

  if(!styles)return<div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return<div dangerouslySetInnerHTML={{__html:`${styles}${header}${hasToken?`<div class="notif-list">${listHtml}</div>`:cta}${bottomNav}`}}/>;
}

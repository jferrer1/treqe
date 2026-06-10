import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

interface Match {id:string;match_id:string;status:string;my_item?:any;other_item?:any;other_user?:any;timer_end?:string;type?:string;price?:number}
const EM=["🎸","📱","🎮","📷","⌚","🎧","🚲","💻","📚","🎯","🖥️","🎹"];
function hs(s:string):number{let h=0;for(let i=0;i<s.length;i++)h=((h<<5)-h)+s.charCodeAt(i);return Math.abs(h)}
function bg(id:string):string{const c=["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#2A1A1A"];return c[hs(id)%c.length]}
const KEYS=["active","pending","in_progress","completed"] as const;
const LABELS=["Activos","Pendientes","En curso","Completados"];
const BADGE:Record<string,string>={active:'<i class="fas fa-star"></i> Match encontrado',requested:'<i class="fas fa-shopping-cart"></i> Solicitud de compra',pending:'<i class="fas fa-shopping-cart"></i> Solicitud de compra',in_progress:'<i class="fas fa-truck"></i> En camino',completed:'<i class="fas fa-check-circle"></i> Completado'};

function renderPurchase(m:Match):string{
  const e=m.my_item?.emoji||EM[hs(m.my_item?.id||"0")%EM.length];
  const seller=m.other_user?.name||"Vendedor";const loc=m.other_user?.location||"";const price=m.my_item?.price||m.price||0;
  return `<div class="match-card" style="border-left:3px solid var(--text)"><div class="match-card__header"><span class="match-card__id">#ORD-${(m.id||"").slice(-6)}</span><span class="match-card__status pending-status">${BADGE[m.status]||BADGE.requested}</span></div><div class="item-compare"><div class="item-compare__item" style="grid-column:1/-1;text-align:left"><div style="display:flex;align-items:center;gap:14px"><div style="width:50px;height:50px;background:${bg(m.my_item?.id||"0")};border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.3rem">${e}</div><div style="flex:1"><div style="font-size:.85rem;font-weight:500">${m.my_item?.title||"Artículo"}</div><div style="font-family:'IBM Plex Mono',monospace;font-size:.5rem;color:#A09A94;margin-top:2px">de ${seller}${loc?" · "+loc:""}${price?" · "+price+"€":""}</div></div></div></div></div><div class="progress-bar-wrap"><span style="font-weight:600"><i class="fas fa-clock"></i> Esperando respuesta del vendedor</span></div><div class="action-buttons"><button class="action-btn action-btn--secondary" style="flex:1" data-action="cancel" data-match-id="${m.id}">Cancelar</button></div></div>`;
}
function renderMatch(m:Match):string{
  const me=m.my_item?.emoji||EM[hs(m.my_item?.id||"0")%EM.length];const oe=m.other_item?.emoji||EM[hs(m.other_item?.id||"1")%EM.length];
  return `<div class="match-card" style="border-left:3px solid var(--text)"><div class="match-card__header"><span class="match-card__id">#TRX-${(m.match_id||m.id||"").slice(-6)}</span><span class="match-card__status ${m.status==="active"?"active-status":"pending-status"}">${BADGE[m.status]||m.status}</span></div><div class="item-compare"><div class="item-compare__item"><div style="display:flex;align-items:center;gap:10px"><div style="width:44px;height:44px;background:${bg(m.my_item?.id||"0")};border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.2rem">${me}</div><div style="flex:1;min-width:0"><div style="font-size:.78rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.my_item?.title||"Mi artículo"}</div><div style="font-family:var(--font-mono);font-size:.48rem;color:var(--text-dim)">${m.my_item?.price?"\u20AC"+m.my_item.price:""}</div></div></div></div><div class="item-compare__arrow"><i class="fas fa-exchange-alt"></i></div><div class="item-compare__item"><div style="display:flex;align-items:center;gap:10px"><div style="width:44px;height:44px;background:${bg(m.other_item?.id||"1")};border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.2rem">${oe}</div><div style="flex:1;min-width:0"><div style="font-size:.78rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.other_item?.title||"Otro artículo"}</div><div style="font-family:var(--font-mono);font-size:.48rem;color:var(--text-dim)">${m.other_user?.name||""}${m.other_user?.location?" · "+m.other_user.location:""}${m.other_item?.price?" · \u20AC"+m.other_item.price:""}</div></div></div></div></div>${m.status==="active"?`<div class="action-buttons"><button class="action-btn action-btn--primary" data-action="accept" data-match-id="${m.id||m.match_id}">Aceptar</button><button class="action-btn action-btn--secondary" data-action="reject" data-match-id="${m.id||m.match_id}">Rechazar</button></div>`:m.status==="in_progress"?`<div class="progress-bar-wrap"><span><i class="fas fa-truck"></i> Intercambio en curso</span></div>`:""}</div>`;
}

export function MatchesPage(){
  const nav=useNavigate();const user=useAuthStore(s=>s.user);
  const [styles,setStyles]=useState("");const [bottomNav,setBottomNav]=useState("");
  const [matches,setMatches]=useState<Match[]>([]);const [tab,setTab]=useState("active");
  const hasToken=!!localStorage.getItem("treqe-token");

  // Extract only styles + bottom nav from MIB, discard all content
  useEffect(()=>{fetch("/mib/v12-mis-matches.html").then(r=>r.text()).then(raw=>{
    const sm=raw.match(/<style>([\s\S]*?)<\/style>/);
    const bm=raw.match(/<body>([\s\S]*?)<\/body>/);
    setStyles(sm?`<style>${sm[1]}</style>`:"");
    let body=bm?bm[1]:"";
    const bn=body.indexOf('<nav class="bottom-nav">');
    if(bn>0){
      let nav=body.substring(bn);
      const navEnd=nav.indexOf('</nav>');
      if(navEnd>0) nav=nav.substring(0,navEnd+6);
      nav=nav.replace(/src="..\/..\/assets\/treqe-logo-mib\.png"/g,'src="/treqe-logo.png"');
      // Convert MIB nav links to SPA routes
      const map:Record<string,string>={"../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo","../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v8-ajustes/":"/ajustes","../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes","../v13-blog/":"/blog","../v13-favoritos/":"/favoritos"};
      for(const[k,v]of Object.entries(map))nav=nav.split(k).join(v);
      nav=nav.replace(/onclick="[^"]*switchTab[^"]*"/g,'');
      nav=nav.replace(/\s+on\w+="[^"]*"/g,'');
      nav=nav.replace(/<script[\s\S]*?<\/script>/g,'');
      setBottomNav(nav);
    }
  })},[]);

  useEffect(()=>{if(!hasToken)return;(async()=>{try{const[mr,pr]=await Promise.all([api.get("/api/matches/"),api.get("/api/purchases/")]);const trades=((mr as any).items||mr||[]).map((m:any)=>({...m,type:"trade"}));const seen=new Set<string>();const purchases=((pr as any).items||pr||[]).filter((p:any)=>!seen.has(p.id)&&seen.add(p.id)).map((p:any)=>({...p,type:"purchase",id:p.id,match_id:p.id,my_item:p.product||{title:p.product?.title||"Artículo",price:p.price},other_item:{title:"Compra directa",price:p.price},other_user:p.seller||{name:"Vendedor"},status:p.status==="requested"?"pending":p.status==="accepted"?"in_progress":p.status}));setMatches([...trades,...purchases])}catch{}})()},[hasToken]);

  useEffect(()=>{const h=(e:MouseEvent)=>{const btn=(e.target as HTMLElement).closest("[data-action]") as HTMLElement|null;if(!btn)return;e.preventDefault();e.stopPropagation();if(!user){nav("/login");return}const id=btn.dataset.matchId||"";if(btn.dataset.action==="cancel"){api.post(`/api/purchases/${id}/cancel`).then(()=>setMatches(prev=>prev.map(m=>m.id===id?{...m,status:"cancelled"}:m))).catch(console.error)}else{api.post(`/api/matches/${id}/${btn.dataset.action}`).then(()=>setMatches(prev=>prev.map(m=>(m.id===id||m.match_id===id)?{...m,status:btn.dataset.action==="accept"?"in_progress":"cancelled"}:m))).catch(console.error)}};document.addEventListener("click",h);return()=>document.removeEventListener("click",h)},[styles,user,nav]);

  const counts=[matches.filter(m=>(m.status==="active"||m.status==="requested")&&m.type!=="purchase").length,matches.filter(m=>m.status==="pending"||(m.status==="requested"&&m.type==="purchase")).length,matches.filter(m=>m.status==="in_progress"||m.status==="accepted").length,matches.filter(m=>m.status==="completed").length];
  const filtered=matches.filter(m=>{if(tab==="active")return(m.status==="active"||m.status==="requested")&&m.type!=="purchase";if(tab==="pending")return m.status==="pending"||(m.status==="requested"&&m.type==="purchase");if(tab==="in_progress")return m.status==="in_progress"||m.status==="accepted";return m.status==="completed"});
  const cards=filtered.length===0?`<div style="text-align:center;padding:60px 20px;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em"><i class="fas fa-exchange-alt" style="font-size:2rem;display:block;margin-bottom:16px;opacity:.3"></i>No hay treqes todavía<br><br><a href="/catalogo" style="font-family:var(--font-mono);font-size:.55rem;padding:8px 20px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.08em;text-transform:uppercase;text-decoration:none">Explorar catálogo</a></div>`:filtered.map(m=>m.type==="purchase"?renderPurchase(m):renderMatch(m)).join("");
  const tabsHtml=`<div class="tabs" style="display:flex;gap:6px;padding:12px 16px;background:var(--bg,#F9F7F2);overflow-x:auto;scrollbar-width:none">${KEYS.map((k,i)=>`<button class="tab${tab===k?" active":""}" style="flex-shrink:0;padding:8px 14px;font-family:'IBM Plex Mono',monospace;font-size:.5rem;font-weight:500;text-transform:uppercase;letter-spacing:.1em;background:${tab===k?"#1C1915":"#FFF"};border:1px solid ${tab===k?"#1C1915":"#E5E0D8"};color:${tab===k?"#F9F7F2":"#55504B"};transition:all .2s;cursor:pointer" id="treqes-tab-${i}">${LABELS[i]} <span class="count">${counts[i]}</span></button>`).join("")}</div><div id="treqes-content">${cards}</div>`;

  // Wire tab clicks via event delegation
  useEffect(()=>{const h=(e:MouseEvent)=>{const btn=(e.target as HTMLElement).closest('#treqes-tab-0,#treqes-tab-1,#treqes-tab-2,#treqes-tab-3');if(btn){const i=parseInt((btn as HTMLElement).id.replace('treqes-tab-',''));setTab(KEYS[i])}};document.addEventListener('click',h);return()=>document.removeEventListener('click',h)},[]);

  const header=`<div class="treqe-header"><button class="treqe-header__back" onclick="window.history.back()"><i class="fas fa-arrow-left"></i></button><span class="treqe-header__title">Treqes</span><span class="treqe-header__right"></span></div>`;
  const cta=`<div style="text-align:center;padding:60px 20px"><div style="font-size:2rem;margin-bottom:12px;color:var(--text-dim)"><i class="fas fa-exchange-alt"></i></div><h2 style="font-family:var(--font-sans);font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus treqes te esperan</h2><p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesión para ver tus intercambios</p><a href="/login" style="font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase;text-decoration:none">Iniciar sesión</a></div>`;

  if(!styles)return<div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return<div dangerouslySetInnerHTML={{__html:`${styles}${header}${hasToken?`<div id="treqes-tabs">${tabsHtml}</div>`:cta}${bottomNav}`}}/>;
}

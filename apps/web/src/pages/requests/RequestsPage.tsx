import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface Offer { id:string; product_id_offers?:string; product_id_wants?:string; status:string; created_at?:string; product_offered?:{title?:string;price?:number}; product_wanted?:{title?:string;price?:number;id?:string}; }

export function RequestsPage() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("treqe-token")) { setLoading(false); return; }
    api.get<{items:Offer[]}>("/api/offers/mine").then(r => setOffers(r.items || r as any)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    try { await api.delete(`/api/offers/${id}`); setOffers(offers.filter(o => o.id !== id)); } catch {}
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const statusBadge = (s:string) => ({
    pending:{bg:"#fef3c7",color:"#d97706",label:"Pendiente"},
    active:{bg:"#fef3c7",color:"#d97706",label:"Pendiente"},
    accepted:{bg:"#dcfce7",color:"#22c55e",label:"Aceptada"},
    rejected:{bg:"#fee2e2",color:"#DC2626",label:"Rechazada"},
    cancelled:{bg:"#fee2e2",color:"#DC2626",label:"Cancelada"},
  }[s] || {bg:"#f3f4f6",color:"#8A8580",label:s});

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Mis solicitudes</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         offers.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"#8A8580",fontSize:".85rem"}}>
            <i className="fas fa-paper-plane" style={{fontSize:"2rem",display:"block",marginBottom:12,opacity:.3}}></i>
            No has enviado solicitudes todavia
          </div>
        ) : offers.map(o => {
          const b = statusBadge(o.status);
          return (
            <div key={o.id} style={{background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,padding:14,marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                <span style={{fontSize:".85rem",fontWeight:500}}>{o.product_wanted?.title || "Articulo"}</span>
                <span style={{fontSize:".65rem",padding:"2px 8px",borderRadius:99,background:b.bg,color:b.color,fontWeight:600}}>{b.label}</span>
              </div>
              <div style={{fontSize:".7rem",color:"#8A8580",marginBottom:8}}>
                Das: {o.product_offered?.title || "Tu articulo"}{o.product_offered?.price ? ` (${o.product_offered.price} EUR)` : ""}<br/>
                Recibes: {o.product_wanted?.title || "Articulo"}{o.product_wanted?.price ? ` (${o.product_wanted.price} EUR)` : ""}
              </div>
              <div style={{display:"flex",gap:8}}>
                {o.product_wanted?.id && <Link to={`/articulo/${o.product_wanted.id}`} style={{fontSize:".75rem",color:"#1C1915",textDecoration:"underline"}}>Ver articulo</Link>}
                {o.status !== "cancelled" && o.status !== "rejected" && <button onClick={() => handleCancel(o.id)} style={{fontSize:".75rem",color:"#DC2626",background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Cancelar</button>}
              </div>
            </div>
          );
        })}
      </div>

      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>Treqes</span></Link>
        <Link to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span></Link>
        <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
}

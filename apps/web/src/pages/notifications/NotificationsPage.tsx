import { Link } from "react-router-dom";

export function NotificationsPage() {
  return (
    <>
      <div className="header"><Link to="/" className="logo-link"><span className="logo">treqe</span></Link></div>
      <div className="section-title"><h2>Avisos</h2><span>0 sin leer</span></div>
      <div style={{textAlign:"center",padding:"60px 20px",color:"#8A8580"}}>
        <div style={{fontSize:"2rem",marginBottom:12}}>🔔</div>
        <div style={{fontWeight:600,color:"#1C1915",marginBottom:4}}>No hay notificaciones</div>
        <div style={{fontSize:"0.85rem"}}>Te avisaremos cuando haya novedades</div>
      </div>
    </>
  );
}

import { Link } from "react-router-dom";

export function MatchesPage() {
  return (
    <>
      <div className="header"><Link to="/" className="logo-link"><span className="logo">treqe</span></Link></div>
      <div className="section-title"><h2>Mis Treqes</h2><span>0 activos</span></div>
      <div style={{display:"flex",gap:0,padding:"0 24px",marginBottom:16}}>
        {["Activos","Pendientes","En curso","Completados"].map(t=><button key={t} style={{flex:1,padding:"10px 0",fontFamily:"IBM Plex Mono,monospace",fontSize:"0.6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:1,border:"none",borderBottom:"2px solid #E5E0D8",background:"none",color:"#8A8580",cursor:"pointer"}}>{t}</button>)}
      </div>
      <div style={{textAlign:"center",padding:"60px 20px",color:"#8A8580"}}>
        <div style={{fontSize:"2rem",marginBottom:12}}>🔄</div>
        <div style={{fontWeight:600,color:"#1C1915",marginBottom:4}}>No hay treqes aún</div>
        <div style={{fontSize:"0.85rem"}}>Los intercambios aparecerán aquí</div>
      </div>
    </>
  );
}

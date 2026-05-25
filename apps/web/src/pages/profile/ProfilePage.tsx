import { Link } from "react-router-dom";

export function ProfilePage() {
  return (
    <>
      <div className="header">
        <Link to="/" className="logo-link"><span className="logo">treqe</span></Link>
      </div>
      <div style={{padding: "24px", textAlign: "center"}}>
        <div style={{width: 80, height: 80, borderRadius: "50%", background: "#1C1915", color: "#F9F7F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, margin: "0 auto 16px"}}>P</div>
        <h2 style={{fontSize: "1.2rem", fontWeight: 600, marginBottom: 4}}>Usuario</h2>
        <p style={{fontSize: "0.85rem", color: "#8A8580", marginBottom: 24}}>usuario@treqe.es</p>
        <div style={{display: "flex", justifyContent: "center", gap: 32, marginBottom: 32}}>
          <Stat value="0" label="Treqes" />
          <Stat value="0" label="Artículos" />
          <Stat value="0" label="Favoritos" />
        </div>
        <div className="catalog" style={{display: "flex", flexDirection:"column", gap: 4}}>
          <ActionLink to="/perfil/editar" icon="fas fa-pen" label="Editar perfil" />
          <ActionLink to="/perfil/verificar" icon="fas fa-check-circle" label="Verificar identidad" />
          <ActionLink to="/ajustes" icon="fas fa-cog" label="Ajustes" />
          <ActionLink to="/perfil/eliminar" icon="fas fa-trash" label="Eliminar cuenta" />
        </div>
      </div>
    </>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return <div style={{textAlign:"center"}}><div style={{fontSize:"1.4rem",fontWeight:700}}>{value}</div><div style={{fontSize:"0.7rem",color:"#8A8580",marginTop:2}}>{label}</div></div>;
}
function ActionLink({ to, icon, label }: { to: string; icon: string; label: string }) {
  return <Link to={to} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#FFF",border:"1px solid #E5E0D8",textDecoration:"none",color:"#1C1915",fontSize:"0.9rem"}}><i className={icon} style={{color:"#8A8580"}}></i>{label}</Link>;
}

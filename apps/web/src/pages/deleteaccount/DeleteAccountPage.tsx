import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

export function DeleteAccountPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const handleDelete = async () => {
    if (confirm !== "ELIMINAR") return;
    setDeleting(true);
    try { await api.delete("/api/users/me"); logout(); navigate("/"); } catch { setDeleting(false); }
  };

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Eliminar cuenta</span>
      </div></div>
      <div style={{padding:"40px 16px",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:16}}>&#9888;&#65039;</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:700,color:"#DC2626",marginBottom:8}}>Esta accion es irreversible</h2>
        <p style={{fontSize:".8rem",color:"#8A8580",lineHeight:1.5,marginBottom:24}}>Se borraran tu perfil, articulos, historial de intercambios y todos tus datos de Treqe.</p>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Escribe ELIMINAR para confirmar</label>
          <input value={confirm} onChange={e => setConfirm(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF",textAlign:"center"}} placeholder="ELIMINAR" />
        </div>
        <button onClick={handleDelete} disabled={confirm !== "ELIMINAR" || deleting} style={{width:"100%",padding:"12px",background:confirm==="ELIMINAR"?"#DC2626":"#E5E0D8",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:confirm==="ELIMINAR"?"pointer":"not-allowed"}}>
          {deleting ? "Eliminando..." : "Eliminar mi cuenta"}
        </button>
      </div>
    </div>
  );
}

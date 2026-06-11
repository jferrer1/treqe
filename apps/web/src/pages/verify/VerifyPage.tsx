import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

export function VerifyPage() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuthStore();
  const [status, setStatus] = useState<string>("loading");
  const [requesting, setRequesting] = useState(false);

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => {
    if (!localStorage.getItem("treqe-token")) return;
    api.get<{status:string}>("/api/users/verify/status").then(r => setStatus(r.status)).catch(() => setStatus("unknown"));
  }, []);

  const handleRequest = async () => {
    setRequesting(true);
    try { await api.post("/api/users/verify"); setStatus("pending"); } catch {}
    setRequesting(false);
  };

  if (!localStorage.getItem("treqe-token")) return (
    <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>
  );

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Verificar identidad</span>
      </div></div>
      <div style={{padding:"40px 16px",maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:"3rem",marginBottom:16}}>{user?.verified ? "\u2705" : status === "pending" ? "\u23F3" : "\U0001F6E1\uFE0F"}</div>
        <h2 style={{fontSize:"1.1rem",fontWeight:700,marginBottom:8}}>
          {user?.verified ? "Cuenta verificada" : status === "pending" ? "Verificacion en proceso" : "Verifica tu identidad"}
        </h2>
        <p style={{fontSize:".8rem",color:"#8A8580",marginBottom:24,lineHeight:1.5}}>
          {user?.verified
            ? "Tu identidad ha sido verificada. Los usuarios verificados generan mas confianza."
            : status === "pending"
            ? "Estamos revisando tu solicitud. Te avisaremos cuando este lista."
            : "La verificacion aumenta tu reputacion y permite intercambios de mayor valor."}
        </p>
        {!user?.verified && status !== "pending" && (
          <button onClick={handleRequest} disabled={requesting} style={{padding:"12px 32px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>
            {requesting ? "Solicitando..." : "Solicitar verificacion"}
          </button>
        )}
      </div>
    </div>
  );
}

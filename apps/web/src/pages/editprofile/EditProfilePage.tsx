import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user, checkAuth } = useAuthStore();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => { checkAuth(); }, []);
  useEffect(() => {
    if (user) { setName(user.name || ""); setBio(user.bio || ""); setLocation(user.location || ""); }
  }, [user]);

  const handleSave = async () => {
    setSaving(true); setMsg("");
    try {
      await api.put("/api/users/me", { name, bio, location });
      setMsg("Perfil actualizado");
      await checkAuth();
    } catch (e: any) { setMsg("Error: " + (e.message || "No se pudo guardar")); }
    setSaving(false);
  };

  if (!localStorage.getItem("treqe-token")) return (
    <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>
  );

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header">
        <div className="treqe-header__left">
          <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
          <span className="treqe-header__title">Editar perfil</span>
        </div>
      </div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Nombre</label>
          <input value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF"}} />
        </div>
        <div style={{marginBottom:20}}>
          <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Bio</label>
          <textarea value={bio} onChange={e=>setBio(e.target.value)} rows={3} style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF",resize:"vertical"}} />
        </div>
        <div style={{marginBottom:24}}>
          <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Ubicacion</label>
          <input value={location} onChange={e=>setLocation(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF"}} />
        </div>
        {msg && <p style={{fontSize:".8rem",color:msg.startsWith("Error")?"#DC2626":"#22c55e",marginBottom:12}}>{msg}</p>}
        <button onClick={handleSave} disabled={saving} style={{width:"100%",padding:"12px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:"pointer",opacity:saving?.6:1}}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}

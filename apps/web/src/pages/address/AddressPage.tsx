import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export function AddressPage() {
  const navigate = useNavigate();
  const [address, setAddress] = useState({street:"",city:"",zip:"",province:""});
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("treqe-token")) return;
    api.get<any>("/api/users/me").then(u => {
      if (u.address) setAddress(u.address);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try { await api.put("/api/users/me", { address }); setMsg("Direccion guardada"); } catch { setMsg("Error al guardar"); }
    setSaving(false);
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const S = {label:{fontSize:".7rem",fontWeight:600 as const,textTransform:"uppercase" as const,letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6},input:{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF"},field:{marginBottom:16}};

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Direccion de envio</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        <div style={S.field}><label style={S.label}>Calle</label><input value={address.street} onChange={e=>setAddress({...address,street:e.target.value})} style={S.input} /></div>
        <div style={S.field}><label style={S.label}>Ciudad</label><input value={address.city} onChange={e=>setAddress({...address,city:e.target.value})} style={S.input} /></div>
        <div style={{display:"flex",gap:12,marginBottom:16}}>
          <div style={{flex:1}}><label style={S.label}>CP</label><input value={address.zip} onChange={e=>setAddress({...address,zip:e.target.value})} style={S.input} /></div>
          <div style={{flex:2}}><label style={S.label}>Provincia</label><input value={address.province} onChange={e=>setAddress({...address,province:e.target.value})} style={S.input} /></div>
        </div>
        {msg && <p style={{fontSize:".8rem",color:msg.startsWith("Error")?"#DC2626":"#22c55e",marginBottom:12}}>{msg}</p>}
        <button onClick={handleSave} disabled={saving} style={{width:"100%",padding:"12px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>{saving?"Guardando...":"Guardar direccion"}</button>
      </div>
    </div>
  );
}

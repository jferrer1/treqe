import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface Dispute { id:string; status:string; reason:string; description?:string; resolution?:string; created_at?:string; }

export function DisputePage() {
  const { refType, id } = useParams<{refType:string;id:string}>();
  const navigate = useNavigate();
  const [dispute, setDispute] = useState<Dispute|null>(null);
  const [reason, setReason] = useState("item_not_received");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("treqe-token") || !id || id === "demo") { setLoading(false); return; }
    api.get<Dispute>(`/api/disputes/${id}`).then(setDispute).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await api.post<Dispute>("/api/disputes/", { reference_type: refType, reference_id: id, reason, description });
      setDispute(result);
      setMsg("Disputa creada correctamente");
    } catch (e: any) { setMsg("Error: " + (e.message || "No se pudo crear")); }
    setSubmitting(false);
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const reasons = [{v:"item_not_received",l:"No recibi el articulo"},{v:"item_not_as_described",l:"No es como se describia"},{v:"damaged",l:"Llego danado"},{v:"other",l:"Otro motivo"}];

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Disputa</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         dispute ? (
          <div style={{background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,padding:16}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <span style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",color:"#8A8580"}}>Estado</span>
              <span style={{fontSize:".75rem",padding:"2px 10px",borderRadius:99,background:dispute.status==="resolved"?"#dcfce7":"#fef3c7",color:dispute.status==="resolved"?"#22c55e":"#d97706",fontWeight:600}}>{dispute.status}</span>
            </div>
            <div style={{fontSize:".85rem",fontWeight:500,marginBottom:8}}>{dispute.reason}</div>
            {dispute.description && <p style={{fontSize:".8rem",color:"#8A8580",lineHeight:1.5}}>{dispute.description}</p>}
            {dispute.resolution && <div style={{marginTop:12,padding:12,background:"#F3F4F6",borderRadius:4}}><div style={{fontSize:".7rem",fontWeight:600,color:"#8A8580",marginBottom:4}}>Resolucion</div><p style={{fontSize:".8rem"}}>{dispute.resolution}</p></div>}
          </div>
        ) : (
          <>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Motivo</label>
              <select value={reason} onChange={e => setReason(e.target.value)} style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF"}}>
                {reasons.map(r => <option key={r.v} value={r.v}>{r.l}</option>)}
              </select>
            </div>
            <div style={{marginBottom:16}}>
              <label style={{fontSize:".7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",display:"block",marginBottom:6}}>Descripcion</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Explica el problema..." style={{width:"100%",padding:"10px 12px",border:"1px solid #E5E0D8",borderRadius:4,fontSize:".85rem",fontFamily:"inherit",background:"#FFF",resize:"vertical"}} />
            </div>
            {msg && <p style={{fontSize:".8rem",color:msg.startsWith("Error")?"#DC2626":"#22c55e",marginBottom:12}}>{msg}</p>}
            <button onClick={handleSubmit} disabled={submitting} style={{width:"100%",padding:"12px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:"pointer"}}>{submitting ? "Enviando..." : "Abrir disputa"}</button>
          </>
        )}
      </div>
    </div>
  );
}

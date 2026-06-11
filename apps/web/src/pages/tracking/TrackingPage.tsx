import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface Shipment { id:string; status:string; tracking_code?:string; carrier?:string; shipped_at?:string; delivered_at?:string; }

export function TrackingPage() {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState<Shipment|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("treqe-token") || !id || id === "demo") { setLoading(false); return; }
    api.get<Shipment>(`/api/shipments/${id}`).then(setShipment).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleConfirm = async () => {
    if (!shipment) return;
    try { await api.post(`/api/shipments/${shipment.id}/confirm`); const updated = await api.get<Shipment>(`/api/shipments/${shipment.id}`); setShipment(updated); } catch {}
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const steps = [{label:"Preparando",icon:"fa-box"},{label:"Enviado",icon:"fa-truck"},{label:"En reparto",icon:"fa-map-marker-alt"},{label:"Entregado",icon:"fa-check-circle"}];
  const statusIdx = !shipment ? 0 : shipment.status === "delivered" ? 3 : shipment.status === "in_transit" ? 2 : shipment.status === "shipped" ? 1 : 0;

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Seguimiento</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         !shipment ? <p style={{textAlign:"center",color:"#8A8580",padding:40}}>No se encontro el envio</p> : <>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:24}}>
            {steps.map((s,i) => (
              <div key={i} style={{textAlign:"center",flex:1}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:i<=statusIdx?"#1C1915":"#E5E0D8",color:i<=statusIdx?"#FFF":"#8A8580",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 6px",fontSize:".7rem"}}><i className={`fas ${s.icon}`}></i></div>
                <div style={{fontSize:".6rem",color:i<=statusIdx?"#1C1915":"#8A8580",fontWeight:i<=statusIdx?600:400}}>{s.label}</div>
              </div>
            ))}
          </div>
          {shipment.tracking_code && <div style={{background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,padding:14,marginBottom:12}}>
            <div style={{fontSize:".65rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",marginBottom:4}}>Codigo de seguimiento</div>
            <div style={{fontSize:".9rem",fontWeight:600,fontFamily:"'IBM Plex Mono',monospace"}}>{shipment.tracking_code}</div>
            {shipment.carrier && <div style={{fontSize:".7rem",color:"#8A8580",marginTop:2}}>{shipment.carrier}</div>}
          </div>}
          {shipment.status !== "delivered" && (
            <button onClick={handleConfirm} style={{width:"100%",padding:"12px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".85rem",fontWeight:600,cursor:"pointer",marginTop:12}}>Confirmar recepcion</button>
          )}
        </>}
      </div>
    </div>
  );
}

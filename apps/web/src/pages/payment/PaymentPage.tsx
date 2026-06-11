import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface PaymentData { id:string; amount:number; currency:string; status:string; escrow_status?:string; }

export function PaymentPage() {
  const { refType, id } = useParams<{refType:string;id:string}>();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentData|null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("treqe-token") || !id || id === "demo") { setLoading(false); return; }
    api.get<PaymentData>(`/api/payments/escrow/${id}`).then(setPayment).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post("/api/payments/intent", { reference_type: refType, reference_id: id });
      setMsg("Pago procesado correctamente");
      if (id) { const updated = await api.get<PaymentData>(`/api/payments/escrow/${id}`); setPayment(updated); }
    } catch (e: any) { setMsg("Error: " + (e.message || "No se pudo procesar")); }
    setPaying(false);
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Pago</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         !payment && !id ? <p style={{textAlign:"center",color:"#8A8580",padding:40}}>No hay pago pendiente</p> : <>
          {payment && (
            <div style={{background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,padding:20,marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:".65rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".08em",color:"#8A8580",marginBottom:8}}>Importe</div>
              <div style={{fontSize:"2rem",fontWeight:700}}>{payment.amount} {payment.currency || "EUR"}</div>
              <div style={{fontSize:".75rem",color:"#8A8580",marginTop:4}}>Estado: {payment.status}</div>
              {payment.escrow_status && <div style={{fontSize:".7rem",color:"#8A8580"}}>Escrow: {payment.escrow_status}</div>}
            </div>
          )}
          {msg && <p style={{fontSize:".8rem",color:msg.startsWith("Error")?"#DC2626":"#22c55e",marginBottom:12,textAlign:"center"}}>{msg}</p>}
          {(!payment || payment.status === "pending") && (
            <button onClick={handlePay} disabled={paying} style={{width:"100%",padding:"14px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontSize:".9rem",fontWeight:600,cursor:"pointer"}}>
              {paying ? "Procesando..." : "Pagar ahora"}
            </button>
          )}
        </>}
      </div>
    </div>
  );
}

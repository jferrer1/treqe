import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export function PaymentPage() {
  const { refType, id } = useParams<{refType:string;id:string}>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState("");
  const [amount, setAmount] = useState(0);
  const [clientSecret, setClientSecret] = useState("");

  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => {
    if (!hasToken || !id || id === "demo") { setLoading(false); return; }

    if (refType === "trade") {
      // For trade escrow: get payment intent from match
      api.get(`/api/matches/${id}/payment`).then((data: any) => {
        setAmount(data.amount || 0);
        setClientSecret(data.client_secret || "");
      }).catch(() => setMsg("No se pudo cargar el pago")).finally(() => setLoading(false));
    } else {
      // Purchase escrow
      api.get(`/api/payments/escrow/${id}`).then((data: any) => {
        setAmount(data.amount || 0);
        setClientSecret(data.client_secret || "");
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, [id, refType, hasToken]);

  const handlePay = async () => {
    if (!clientSecret) {
      // For purchase: create intent first
      setPaying(true);
      try {
        await api.post("/api/payments/intent", { reference_type: refType, reference_id: id });
        const updated = await api.get(`/api/payments/escrow/${id}`);
        setClientSecret((updated as any).client_secret || "");
        setAmount((updated as any).amount || 0);
        setMsg("Pago listo. Confirma en el siguiente paso.");
      } catch (e: any) {
        setMsg("Error: " + (e.message || "No se pudo procesar"));
      }
      setPaying(false);
      return;
    }

    // For trade escrow: confirm the existing PaymentIntent
    setPaying(true);
    try {
      await api.post(`/api/matches/${id}/confirm-payment`);
      setDone(true);
      setMsg("Pago realizado y retenido en escrow. Se liberará cuando todos acepten.");
    } catch (e: any) {
      setMsg("Error: " + (e.message || "No se pudo confirmar el pago"));
    }
    setPaying(false);
  };

  if (!hasToken) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>
    <p style={{marginBottom:16}}>Necesitas iniciar sesión</p>
    <a href="/login" style={{fontFamily:"var(--font-mono)",fontSize:".6rem",padding:"10px 28px",background:"#1C1915",color:"#FFF",textDecoration:"none"}}>Iniciar sesión</a>
  </div>;

  if (loading) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)",color:"var(--text-dim)"}}>Cargando...</div>;

  return (
    <div style={{fontFamily:"var(--font-sans)",maxWidth:480,margin:"0 auto",padding:24}}>
      <div className="treqe-header" style={{display:"flex",alignItems:"center",gap:12,marginBottom:32}}>
        <button onClick={() => window.history.back()} style={{width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border)",background:"none",cursor:"pointer"}}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <span style={{fontWeight:600,fontSize:"1rem"}}>
          {refType === "trade" ? "Pago de diferencia — Treqe" : "Pago — Compra directa"}
        </span>
      </div>

      {done ? (
        <div style={{textAlign:"center",padding:"48px 20px"}}>
          <div style={{fontSize:"2.5rem",marginBottom:16}}>🔒</div>
          <div style={{fontSize:"1rem",fontWeight:600,marginBottom:8}}>¡Pago en escrow!</div>
          <p style={{fontSize:".8rem",color:"var(--text-sub)",lineHeight:1.5,marginBottom:24}}>
            {refType === "trade"
              ? `Tu diferencia de €${(amount/100).toFixed(2)} queda retenida. Se liberará cuando todos los participantes acepten el intercambio.`
              : `Pago de €${(amount/100).toFixed(2)} procesado correctamente.`}
          </p>
          <button onClick={() => navigate("/treqes")} style={{fontFamily:"var(--font-mono)",fontSize:".6rem",padding:"12px 28px",background:"#1C1915",color:"#FFF",border:"none",cursor:"pointer",textTransform:"uppercase",letterSpacing:".1em"}}>
            Volver a mis Treqes
          </button>
        </div>
      ) : (
        <>
          <div style={{background:"var(--bg,#F9F7F2)",border:"1px solid var(--border)",padding:24,marginBottom:24,textAlign:"center"}}>
            <div style={{fontSize:".6rem",color:"var(--text-dim)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>
              {refType === "trade" ? "DIFERENCIA A PAGAR" : "IMPORTE"}
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"2rem",fontWeight:600}}>
              €{(amount/100).toFixed(2)}
            </div>
          </div>

          <button
            onClick={handlePay}
            disabled={paying}
            style={{
              width:"100%",padding:"16px",fontFamily:"var(--font-mono)",fontSize:".6rem",fontWeight:600,
              textTransform:"uppercase",letterSpacing:".1em",
              background:paying?"var(--border)":"#1C1915",color:paying?"var(--text-dim)":"#FFF",
              border:"none",cursor:paying?"not-allowed":"pointer"
            }}
          >
            {paying ? "Procesando..." : clientSecret ? `Pagar €${(amount/100).toFixed(2)} (escrow)` : "Preparar pago"}
          </button>

          {msg && (
            <div style={{marginTop:16,padding:"12px 16px",background:done?"#F0FDF4":"#FEF2F2",color:done?"#166534":"#DC2626",fontSize:".7rem",textAlign:"center"}}>
              {msg}
            </div>
          )}
        </>
      )}
    </div>
  );
}

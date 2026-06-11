import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface PayMethod { id: string; type: string; last4: string; brand: string; }

export function PayMethodsPage() {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PayMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("treqe-token")) return;
    api.get<{items:PayMethod[]}>("/api/payments/methods/").then(r => setMethods(r.items||r as any)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este metodo de pago?")) return;
    try { await api.delete(`/api/payments/methods/${id}`); setMethods(methods.filter(m => m.id !== id)); } catch {}
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Metodos de pago</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         methods.length === 0 ? (
          <div style={{textAlign:"center",padding:"40px 20px",color:"#8A8580",fontSize:".85rem"}}>
            <i className="fas fa-credit-card" style={{fontSize:"2rem",display:"block",marginBottom:12,opacity:.3}}></i>
            No tienes metodos de pago guardados
          </div>
        ) : methods.map(m => (
          <div key={m.id} style={{display:"flex",alignItems:"center",padding:"14px 12px",background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,marginBottom:8}}>
            <i className="fas fa-credit-card" style={{fontSize:"1.2rem",marginRight:12,color:"#8A8580"}}></i>
            <div style={{flex:1}}>
              <div style={{fontSize:".85rem",fontWeight:500}}>{m.brand || "Tarjeta"} .... {m.last4}</div>
              <div style={{fontSize:".7rem",color:"#8A8580"}}>{m.type}</div>
            </div>
            <button onClick={() => handleDelete(m.id)} style={{background:"none",border:"none",color:"#DC2626",cursor:"pointer",fontSize:".8rem"}}><i className="fas fa-trash"></i></button>
          </div>
        ))}
      </div>
    </div>
  );
}

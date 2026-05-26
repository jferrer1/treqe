import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const BG = "#1A1A2A";
const cl = (c: string) => ({ like_new: "Como nuevo", good: "Buen estado", new: "Nuevo", fair: "Aceptable" } as Record<string,string>)[c] || c;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const queryClient = useQueryClient();
  const [tradeOpen, setTradeOpen] = useState(false);
  const [offerProductId, setOfferProductId] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get<Product>(`/api/products/${id}`),
    enabled: !!id,
  });

  const { data: myProducts } = useQuery({
    queryKey: ["my-products"],
    queryFn: () => api.get<{ items: Product[] }>("/api/products/?limit=100"),
    enabled: !!user,
  });

  const buyMutation = useMutation({
    mutationFn: (productId: string) =>
      api.post(`/api/purchases/?product_id=${productId}&shipping=5.99&insurance=false`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["purchases"] }); navigate("/treqes"); },
  });

  const offerMutation = useMutation({
    mutationFn: (wantsId: string) =>
      api.post(`/api/offers/?product_id_offers=${offerProductId}&product_id_wants=${wantsId}`),
    onSuccess: () => { setTradeOpen(false); alert("¡Oferta enviada! Te notificaremos si hay match."); },
  });

  if (isLoading) return <div style={{padding:60,textAlign:"center"}}>Cargando...</div>;
  if (!product) return <div style={{padding:60,textAlign:"center"}}>Producto no encontrado</div>;

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <button onClick={() => navigate(-1)} style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:1,color:"var(--text-sub)",border:"1px solid var(--border)",padding:"8px 14px",background:"transparent",cursor:"pointer"}}>
          <i className="fas fa-arrow-left"></i> Volver
        </button>
        <Link to="/" className="logo-link"><img className="treqe-logo" src="/treqe-logo.png" alt="treqe" /></Link>
      </div>

      {/* GALLERY PLACEHOLDER */}
      <div style={{height:340,background:BG,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"4rem",color:"rgba(255,255,255,0.15)"}}>
        <i className="fas fa-box"></i>
      </div>

      {/* INFO */}
      <div style={{padding:"20px 24px"}}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:1,color:"var(--text-dim)",marginBottom:8}}>
          {product.category}{product.subcategory ? ` / ${product.subcategory}` : ""}
        </div>
        <h1 style={{fontSize:"1.3rem",fontWeight:600,lineHeight:1.3,marginBottom:8}}>{product.title}</h1>
        <div style={{fontSize:"1.6rem",fontWeight:700,marginBottom:12}}>€{product.price}</div>

        <div style={{display:"flex",gap:8,marginBottom:16}}>
          <span style={{padding:"4px 12px",border:"1px solid var(--border)",fontSize:"0.75rem",fontWeight:500}}>{cl(product.condition)}</span>
          {product.weight && <span style={{padding:"4px 12px",border:"1px solid var(--border)",fontSize:"0.75rem",color:"var(--text-sub)"}}>{product.weight} kg</span>}
        </div>

        {product.description && (
          <p style={{fontSize:"0.9rem",color:"var(--text-sub)",lineHeight:1.6,marginBottom:20}}>{product.description}</p>
        )}

        {/* ACTION BUTTONS */}
        {user ? (
          <div style={{display:"flex",gap:10,marginBottom:24}}>
            <button
              onClick={() => buyMutation.mutate(product.id)}
              disabled={buyMutation.isPending}
              style={{flex:1,padding:"14px 0",background:"var(--accent)",color:"var(--surface)",border:"none",fontFamily:"var(--font-mono)",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:1,cursor:"pointer"}}
            >
              {buyMutation.isPending ? "Procesando..." : "Comprar ahora"}
            </button>
            <button
              onClick={() => setTradeOpen(true)}
              style={{flex:1,padding:"14px 0",background:"var(--surface)",color:"var(--text)",border:"1px solid var(--border)",fontFamily:"var(--font-mono)",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:1,cursor:"pointer"}}
            >
              Quiero esto (intercambio)
            </button>
          </div>
        ) : (
          <Link to="/registro" style={{display:"block",textAlign:"center",padding:"14px 0",background:"var(--accent)",color:"var(--surface)",textDecoration:"none",fontFamily:"var(--font-mono)",fontSize:"0.7rem",fontWeight:600,textTransform:"uppercase",letterSpacing:1,marginBottom:24}}>
            Regístrate para comprar o intercambiar
          </Link>
        )}
      </div>

      {/* TRADE MODAL */}
      {tradeOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={() => setTradeOpen(false)}>
          <div style={{background:"var(--surface)",width:"100%",maxHeight:"80vh",overflow:"auto",padding:24,borderTop:"1px solid var(--border)"}} onClick={e => e.stopPropagation()}>
            <h3 style={{fontSize:"1rem",fontWeight:600,marginBottom:16}}>Selecciona un artículo para intercambiar</h3>
            {myProducts?.items.filter(p => p.id !== product.id).length === 0 && (
              <p style={{color:"var(--text-sub)",marginBottom:16}}>No tienes otros artículos. <Link to="/subir">Publica uno primero</Link>.</p>
            )}
            <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:"50vh",overflow:"auto"}}>
              {myProducts?.items.filter(p => p.id !== product.id).map(p => (
                <button
                  key={p.id}
                  onClick={() => setOfferProductId(p.id)}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",border:"1px solid var(--border)",background:offerProductId === p.id ? "var(--accent)" : "transparent",color:offerProductId === p.id ? "var(--surface)" : "var(--text)",cursor:"pointer",textAlign:"left",fontSize:"0.9rem"}}
                >
                  <span>{p.title}</span>
                  <span style={{fontWeight:700}}>€{p.price}</span>
                </button>
              ))}
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={() => setTradeOpen(false)} style={{flex:1,padding:"12px",border:"1px solid var(--border)",background:"transparent",fontFamily:"var(--font-mono)",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:1,cursor:"pointer"}}>Cancelar</button>
              <button
                onClick={() => offerProductId && offerMutation.mutate(product.id)}
                disabled={!offerProductId || offerMutation.isPending}
                style={{flex:1,padding:"12px",background:offerProductId ? "var(--accent)" : "#ccc",color:"var(--surface)",border:"none",fontFamily:"var(--font-mono)",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:1,cursor:offerProductId ? "pointer":"not-allowed"}}
              >
                {offerMutation.isPending ? "Enviando..." : "Confirmar intercambio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item active"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
        <Link to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div><span>Subir</span></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
        <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </>
  );
}

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const cl = (c: string) => ({ like_new: "Como nuevo", good: "Buen estado", new: "Nuevo", fair: "Aceptable" } as Record<string,string>)[c] || c;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [offerId, setOfferId] = useState("");

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
    mutationFn: (pid: string) => api.post(`/api/purchases/?product_id=${pid}&shipping=5.99&insurance=false`),
    onSuccess: () => navigate("/treqes"),
  });

  const offerMutation = useMutation({
    mutationFn: (wantsId: string) => api.post(`/api/offers/?product_id_offers=${offerId}&product_id_wants=${wantsId}`),
    onSuccess: () => { setTradeOpen(false); alert("¡Oferta enviada!"); },
  });

  if (isLoading) return <div style={{padding:60,textAlign:"center"}}>Cargando...</div>;
  if (!product) return <div style={{padding:60,textAlign:"center"}}>No encontrado</div>;

  return (
    <>
      {/* ═══ DETAIL HEADER (exact MIB) ═══ */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Atrás">
          <i className="fas fa-chevron-left"></i>
        </button>
      </div>

      {/* ═══ DETAIL LAYOUT (exact MIB wrapper) ═══ */}
      <div className="detail-layout">

        {/* GALLERY (exact MIB) */}
        <div className="gallery" id="gallery">
          <div className="gallery-slides" id="gallerySlides">
            <div className="gallery-slide active" style={{background:"linear-gradient(135deg, #2D2D2D 0%, #111 100%)"}}>
              <i className="fas fa-box main-icon"></i>
            </div>
          </div>
          <div style={{position:"absolute",top:16,left:16,fontFamily:"var(--font-mono)",fontSize:"0.6rem",color:"rgba(255,255,255,0.7)",letterSpacing:1,zIndex:2}}>1/1</div>
          <div className="gallery-dots"><span className="dot active"></span></div>
        </div>

        {/* PRODUCT INFO */}
        <div style={{padding:"24px"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--text-dim)",marginBottom:10}}>
            {product.category.toUpperCase()}{product.subcategory ? ` > ${product.subcategory.toUpperCase()}` : ""}
          </div>
          <h1 style={{fontSize:"1.5rem",fontWeight:600,lineHeight:1.2,marginBottom:10}}>
            {product.title} · {cl(product.condition)}
          </h1>
          <div style={{fontSize:"2rem",fontWeight:700,marginBottom:24}}>€{product.price}</div>

          <div style={{borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)",padding:"14px 0",marginBottom:24,display:"flex",alignItems:"center",gap:12,fontSize:"0.9rem"}}>
            <i className="fas fa-check-circle" style={{color:"var(--text-dim)",fontSize:"0.9rem"}}></i>
            {cl(product.condition)}
          </div>

          <div style={{marginBottom:24}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--text-dim)",marginBottom:12}}>DESCRIPCIÓN</div>
            <p style={{fontSize:"0.95rem",lineHeight:1.7,color:"var(--text-sub)"}}>{product.description || "Sin descripción."}</p>
          </div>

          {/* ACTION BUTTONS */}
          {user ? (
            <div style={{display:"flex",gap:8,marginBottom:24}}>
              <button className="btn-primary" onClick={() => buyMutation.mutate(product.id)} disabled={buyMutation.isPending}
                style={{flex:1}}>
                {buyMutation.isPending ? "Procesando..." : "COMPRAR"}
              </button>
              <button className="btn-secondary" onClick={() => setTradeOpen(true)} style={{flex:1}}>
                QUIERO ESTO (INTERCAMBIO)
              </button>
            </div>
          ) : (
            <Link to="/registro" className="btn-primary" style={{display:"block",textAlign:"center",textDecoration:"none",marginBottom:24}}>
              REGÍSTRATE PARA COMPRAR O INTERCAMBIAR
            </Link>
          )}
        </div>
      </div>

      {/* TRADE MODAL */}
      {tradeOpen && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={() => setTradeOpen(false)}>
          <div className="trade-modal" onClick={e => e.stopPropagation()}>
            <div className="trade-modal__header">
              <h3 className="trade-modal__title">Selecciona un artículo para intercambiar</h3>
              <button className="trade-modal__close" onClick={() => setTradeOpen(false)}><i className="fas fa-times"></i></button>
            </div>
            <div className="trade-modal__content">
              {myProducts?.items.filter(p => p.id !== product.id).map(p => (
                <button key={p.id} onClick={() => setOfferId(p.id)}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"12px 16px",border:offerId===p.id?"1px solid var(--accent)":"1px solid var(--border)",background:offerId===p.id?"var(--accent)":"transparent",color:offerId===p.id?"var(--surface)":"var(--text)",cursor:"pointer",fontSize:"0.9rem",fontFamily:"var(--font-sans)"}}>
                  <span>{p.title}</span>
                  <span style={{fontWeight:700}}>€{p.price}</span>
                </button>
              ))}
            </div>
            <div className="trade-modal__footer">
              <button className="btn-secondary" onClick={() => setTradeOpen(false)}>Cancelar</button>
              <button className="btn-primary" disabled={!offerId} onClick={() => offerId && offerMutation.mutate(product.id)}>
                {offerMutation.isPending ? "Enviando..." : "Confirmar intercambio"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM NAV (exact MIB) */}
      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item active"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
        <Link to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
        <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </>
  );
}

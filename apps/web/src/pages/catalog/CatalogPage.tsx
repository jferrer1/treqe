import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";

const BG = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A","#1A1A3A","#3A3A2A","#1A2A1A","#2D1A2A","#3A3A3A","#2A1A1A","#1A2A2A","#2D2A3A","#3A2D1A","#1A1A1A","#2A3D2A","#3A1A3A","#1A3D3A","#2D2A1A","#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A"];

const cl = (c: string) => ({ like_new: "Como nuevo", good: "Buen estado", new: "Nuevo", fair: "Aceptable" } as Record<string,string>)[c] || c;

export function CatalogPage() {
  const { data } = useQuery({ queryKey: ["products"], queryFn: () => api.get<{ items: Product[]; total: number }>("/api/products/?limit=70") });

  return (
    <>
      {/* HEADER */}
      <div className="header">
        <Link to="/" className="logo-link"><img className="treqe-logo" src="/treqe-logo.png" alt="treqe" /></Link>
        <div className="header-right">
          <Link to="/blog" className="blog-link"><i className="fas fa-book-open"></i>Blog</Link>
          <div className="search-icon"><i className="fas fa-search"></i></div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="toolbar">
        <button className="tool-btn"><i className="fas fa-sliders-h"></i> Filtrar</button>
        <button className="tool-btn"><i className="fas fa-arrow-down-wide-short"></i> Ordenar</button>
      </div>

      {/* TITLE */}
      <div className="section-title">
        <h2>Descubrir</h2>
        <span>{data ? `${data.total} artículos` : "Cargando..."}</span>
      </div>

      {/* CATALOG GRID */}
      <div className="catalog">
        {data?.items.map((p, i) => (
          <Link key={p.id} to={`/articulo/${p.id}`} className="item-card">
            <div className="item-card__image" style={{ background: BG[i % BG.length] }}>
              <button className="like-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                <i className="far fa-heart"></i>
              </button>
              <i className="fas fa-box placeholder-icon white"></i>
              <span className="price-tag">€{p.price}</span>
              <button className="trade-btn" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                <i className="fas fa-exchange-alt"></i>
              </button>
            </div>
            <div className="item-card__info">
              <div className="item-card__title">{p.title} · {cl(p.condition)}</div>
            </div>
          </Link>
        ))}
        {!data && <div id="pagingSentinel"><i className="fas fa-spinner fa-pulse"></i> CARGANDO ARTÍCULOS...</div>}
      </div>

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

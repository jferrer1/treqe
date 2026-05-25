import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";

import { BottomNav } from "@/components/layout/BottomNav";

const BG_COLORS = [
  "#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A",
  "#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A",
  "#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A",
  "#1A1A3A","#3A3A2A","#1A2A1A","#2D1A2A","#3A3A3A","#2A1A1A",
  "#1A2A2A","#2D2A3A","#3A2D1A","#1A1A1A","#2A3D2A","#3A1A3A",
  "#1A3D3A","#2D2A1A","#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A",
  "#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A",
  "#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A",
  "#2A3A1A","#3A1A2A",
];

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sort, setSort] = useState("newest");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 20;
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset), sort });
  if (search) params.set("search", search);

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, page, sort],
    queryFn: () => api.get<{ items: Product[]; total: number }>(`/api/products/?${params}`),
  });

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <div className="header">
        <Link to="/" className="logo-link">
          <img className="treqe-logo" src="/treqe-logo.png" alt="treqe" />
        </Link>
        <div className="header-right">
          <Link to="/blog" className="blog-link"><i className="fas fa-book-open"></i>Blog</Link>
          <div className="search-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <i className="fas fa-search"></i>
          </div>
          <div className={`search-expand ${searchOpen ? "open" : ""}`}>
            <input type="text" placeholder="Buscar artículos..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
            <button className="search-close" onClick={() => { setSearchOpen(false); setSearch(""); }}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TOOLBAR ═══ */}
      <div className="toolbar">
        <button className="tool-btn"><i className="fas fa-sliders-h"></i> Filtrar</button>
        <div className="sort-wrapper">
          <button className="tool-btn" onClick={() => setSortOpen(!sortOpen)}>
            <i className="fas fa-arrow-down-wide-short"></i>{" "}
            {sort === "newest" ? "Más recientes" : sort === "price_asc" ? "Precio ↑" : "Precio ↓"}
          </button>
          {sortOpen && (
            <div className="sort-dropdown open">
              <button className={`sort-option ${sort === "newest" ? "active" : ""}`} onClick={() => { setSort("newest"); setSortOpen(false); }}>Más recientes</button>
              <button className={`sort-option ${sort === "price_asc" ? "active" : ""}`} onClick={() => { setSort("price_asc"); setSortOpen(false); }}>Precio: menor a mayor</button>
              <button className={`sort-option ${sort === "price_desc" ? "active" : ""}`} onClick={() => { setSort("price_desc"); setSortOpen(false); }}>Precio: mayor a menor</button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ SECTION TITLE ═══ */}
      <div className="section-title">
        <h2>Descubrir</h2>
        <span>{data ? `${data.total} artículos` : "Cargando..."}</span>
      </div>

      {/* ═══ CATALOG GRID ═══ */}
      {isLoading && (
        <div id="pagingSentinel"><i className="fas fa-spinner fa-pulse"></i> Cargando artículos...</div>
      )}
      {data && data.total === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon"><i className="fas fa-box-open"></i></div>
          <div className="empty-state__title">No hay productos aún</div>
          <div className="empty-state__text">Sé el primero en publicar un artículo</div>
          <Link to="/subir" className="empty-state__btn">
            <i className="fas fa-plus"></i> Publicar artículo
          </Link>
        </div>
      )}
      <div className="catalog">
        {data?.items.map((product, i) => (
          <Link key={product.id} to={`/articulo/${product.id}`} className="item-card">
            <div className="item-card__image" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
              <button className="like-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <i className="far fa-heart"></i>
              </button>
              <i className="fas fa-box placeholder-icon white"></i>
              <span className="price-tag">€{product.price}</span>
            </div>
            <div className="item-card__info">
              <div className="item-card__title">{product.title} · {product.condition === "like_new" ? "Como nuevo" : product.condition === "good" ? "Buen estado" : product.condition}</div>
              <div className="item-card__meta">
                <i className="fas fa-tag"></i> {product.category}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ═══ PAGINATION ═══ */}
      {data && data.total > limit && (
        <div id="pagingSentinel" style={{ display: "flex", gap: 8, justifyContent: "center", paddingBottom: 24 }}>
          {Array.from({ length: Math.ceil(data.total / limit) }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", textTransform: "uppercase",
                padding: "6px 12px", border: "1px solid var(--border)",
                background: page === i + 1 ? "var(--accent)" : "transparent",
                color: page === i + 1 ? "var(--surface)" : "var(--text-sub)",
              }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <BottomNav />
    </>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api, Product } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

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

const CAT_ICONS: Record<string, string> = {
  musica: "guitar", moda: "clock", electronica: "mobile-alt",
  hogar: "couch", deporte: "bicycle", libros: "book",
  consolas: "gamepad", camaras: "camera", portatiles: "laptop",
  audio: "headphones", moviles: "mobile-alt", tablets: "tablet-alt",
  muebles: "couch", lamparas: "lightbulb", electrodomesticos: "coffee",
  bolsos: "shopping-bag", zapatos: "shoe-prints", fitness: "dumbbell",
  padel: "table-tennis", accesorios: "apple-alt", guitarras: "guitar",
  vinilos: "compact-disc", baterias: "drum", novelas: "book",
  relojes: "clock", bicicletas: "bicycle",
};

function catIcon(cat: string, sub: string | null): string {
  return CAT_ICONS[sub || ""] || CAT_ICONS[cat.toLowerCase()] || "box";
}

function conditionLabel(c: string): string {
  const m: Record<string, string> = {
    new: "Nuevo", like_new: "Como nuevo", good: "Buen estado",
    fair: "Aceptable", poor: "Con desgaste",
  };
  return m[c] || c;
}

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, _setCategory] = useState<string | null>(null);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const user = useAuthStore((s) => s.user);

  const limit = 20;
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({ limit: String(limit), offset: String(offset), sort });
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const { data, isLoading } = useQuery({
    queryKey: ["products", search, category, page, sort],
    queryFn: () => api.get<{ items: Product[]; total: number }>(`/api/products/?${params}`),
  });

  const { data: _categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<{ categories: string[] }>("/api/products/categories"),
  });

  return (
    <>
      {/* ═══ HEADER ═══ */}
      <div className="header">
        <Link to="/" style={{ display: "flex", alignItems: "center" }}>
          <span className="logo">treqe</span>
        </Link>
        <div className="header-right">
          <Link to="/blog" className="blog-link">
            <i className="fas fa-book-open" /> Blog
          </Link>
          <div className="search-icon" onClick={() => setSearchOpen(!searchOpen)}>
            <i className="fas fa-search" />
          </div>
          <div className={`search-expand ${searchOpen ? "open" : ""}`}>
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="search-close" onClick={() => { setSearchOpen(false); setSearch(""); }}>
              <i className="fas fa-times" />
            </button>
          </div>
        </div>
      </div>

      {/* ═══ TOOLBAR ═══ */}
      <div className="toolbar">
        <button className="tool-btn">
          <i className="fas fa-sliders-h" /> Filtrar
        </button>
        <div className="sort-wrapper">
          <button className="tool-btn" onClick={() => {
            const next = sort === "newest" ? "price_asc" : sort === "price_asc" ? "price_desc" : "newest";
            setSort(next);
          }}>
            <i className="fas fa-arrow-down-wide-short" />{" "}
            {sort === "newest" ? "Más recientes" : sort === "price_asc" ? "Precio ↑" : "Precio ↓"}
          </button>
        </div>
      </div>

      {/* ═══ TITLE ═══ */}
      <div className="section-title">
        <h2>Descubrir</h2>
        <span>{data ? `${data.total} artículos` : "Cargando..."}</span>
      </div>

      {/* ═══ CATALOG ═══ */}
      {isLoading && (
        <div id="pagingSentinel"><i className="fas fa-spinner fa-pulse" /> Cargando artículos...</div>
      )}
      {data && data.total === 0 && (
        <div className="empty-state">
          <div className="empty-state__icon"><i className="fas fa-box-open" /></div>
          <div className="empty-state__title">No hay productos aún</div>
          <div className="empty-state__text">Sé el primero en publicar un artículo</div>
          <Link to={user ? "/subir" : "/registro"} className="empty-state__btn">
            <i className="fas fa-plus" /> Publicar artículo
          </Link>
        </div>
      )}
      <div className="catalog">
        {data?.items.map((product, i) => (
          <Link
            key={product.id}
            to={`/articulo/${product.id}`}
            className="item-card"
            style={{ cursor: "pointer" }}
          >
            <div className="item-card__image" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
              <button className="like-btn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                <i className="far fa-heart" />
              </button>
              <i className={`fas fa-${catIcon(product.category, product.subcategory)} placeholder-icon white`} />
              <span className="price-tag">€{product.price}</span>
            </div>
            <div className="item-card__info">
              <div className="item-card__title">
                {product.title} · {conditionLabel(product.condition)}
              </div>
              <div className="item-card__meta">
                <i className={`fas fa-${catIcon(product.category, product.subcategory)}`} /> {product.category}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ═══ PAGING SENTINEL ═══ */}
      {data && data.total > limit && (
        <div id="pagingSentinel" style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          {Array.from({ length: Math.ceil(data.total / limit) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", textTransform: "uppercase",
                padding: "6px 12px", border: "1px solid var(--border)", background: page === i + 1 ? "var(--accent)" : "transparent",
                color: page === i + 1 ? "var(--surface)" : "var(--text-sub)",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

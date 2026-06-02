import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";

interface Product {
  id: string; title: string; price: number; condition: string;
  category?: string; photos?: string[]; images?: string[];
}

const BG = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A",
  "#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A",
  "#2A2A1A","#2A3A1A","#3A1A2A","#1A1A3A","#3A3A2A"];

const SUBCATEGORIES: Record<string, string[]> = {
  electronica: ["Móviles","Portátiles","Tablets","Cámaras","Audio","Consolas","Accesorios","TV y Proyectores","Smartwatches","Componentes PC","Periféricos"],
  moda: ["Ropa hombre","Ropa mujer","Zapatos","Bolsos","Relojes","Joyería","Vintage","Accesorios","Belleza"],
  deporte: ["Bicicletas","Fitness","Running","Natación","Fútbol","Padel","Camping","Montaña y Ski","Baloncesto","Golf","Yoga","Pesas","Patines"],
  musica: ["Guitarras","Baterías","Teclados","Vinilos","Equipos DJ","Instrumentos viento","Micrófonos","Partituras"],
  hogar: ["Muebles","Decoración","Electrodomésticos","Jardín","Bricolaje","Lámparas","Cocina","Baño","Textiles","Mascotas","Calefacción"],
  libros: ["Novelas","Cómics","Académicos","Infantil","Idiomas","Arte","Revistas","Ensayo"],
  motor: ["Coches","Motos","Recambios coche","Recambios moto","GPS","Herramientas","Neumáticos","Accesorios"],
  coleccionismo: ["Antigüedades","Monedas","Sellos","Cromos","Figuras","Pósters","Postales"],
};

const CONDITIONS = [
  { value: "any", label: "Cualquiera" },
  { value: "new", label: "Nuevo" },
  { value: "like_new", label: "Como nuevo" },
  { value: "good", label: "Buen estado" },
  { value: "fair", label: "Usado" },
];

const PRICE_RANGES = [
  { label: "Hasta €50", min: 0, max: 50 },
  { label: "€50-200", min: 50, max: 200 },
  { label: "€200-500", min: 200, max: 500 },
  { label: "+€500", min: 500, max: Infinity },
];

const cl = (c: string) => ({ like_new: "Como nuevo", good: "Buen estado", new: "Nuevo", fair: "Aceptable" } as Record<string, string>)[c] || c;

export function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [showSort, setShowSort] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [filterSubcat, setFilterSubcat] = useState("");
  const [filterPrice, setFilterPrice] = useState<typeof PRICE_RANGES[0] | null>(null);
  const [filterCond, setFilterCond] = useState("any");

  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/products/?limit=70");
        setProducts((res.items || res || []).slice(0, 70));
      } catch {}
    })();
  }, []);

  // Derived filtered/sorted products
  const displayed = useMemo(() => {
    let items = [...products];
    // Filter
    items = items.filter(p => {
      const cat = (p as any).category || "";
      if (filterCat && cat !== filterCat) return false;
      if (filterPrice) {
        if (p.price < filterPrice.min) return false;
        if (filterPrice.max !== Infinity && p.price > filterPrice.max) return false;
      }
      if (filterCond !== "any" && p.condition !== filterCond) return false;
      return true;
    });
    // Sort
    if (sortBy === "price-asc") items.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") items.sort((a, b) => b.price - a.price);
    else if (sortBy === "name") items.sort((a, b) => a.title.localeCompare(b.title));
    return items;
  }, [products, sortBy, filterCat, filterSubcat, filterPrice, filterCond]);

  // Active filter chips
  const chips: { label: string; clear: () => void }[] = [];
  if (filterCat) chips.push({ label: filterCat, clear: () => { setFilterCat(""); setFilterSubcat(""); } });
  if (filterPrice) chips.push({ label: filterPrice.label, clear: () => setFilterPrice(null) });
  if (filterCond !== "any") chips.push({ label: CONDITIONS.find(c => c.value === filterCond)?.label || filterCond, clear: () => setFilterCond("any") });

  return (
    <div className="catalog-page" style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "var(--bg,#F9F7F2)", minHeight: "100vh", paddingBottom: 90 }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid var(--border,#E5E0D8)", position: "sticky", top: 0, zIndex: 50, background: "var(--bg,#F9F7F2)" }}>
        <button onClick={() => window.history.back()} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, background: "none", cursor: "pointer" }}>
          <i className="fas fa-chevron-left" />
        </button>
        <Link to="/" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text,#1C1915)", textDecoration: "none" }}>
          treqe
        </Link>
        <Link to="/blog" style={{ color: "var(--text-sub,#6B6560)", fontSize: "0.75rem", textDecoration: "none" }}>
          <i className="fas fa-book-open" /> Blog
        </Link>
      </div>

      {/* TOOLBAR */}
      <div style={{ display: "flex", gap: 8, padding: "8px 24px 4px", alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setShowFilter(!showFilter)} className="tool-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, background: "var(--surface,#FFF)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}>
          <i className="fas fa-sliders-h" /> Filtrar
        </button>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowSort(!showSort)} className="tool-btn" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, background: "var(--surface,#FFF)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em", cursor: "pointer" }}>
            <i className="fas fa-arrow-down-wide-short" /> Ordenar
          </button>
          {showSort && (
            <div className="sort-dropdown" style={{ position: "absolute", top: "100%", left: 0, zIndex: 100, background: "var(--surface,#FFF)", border: "1px solid var(--border,#E5E0D8)", minWidth: 160 }}>
              {["relevance", "price-asc", "price-desc", "name"].map(o => (
                <button key={o} onClick={() => { setSortBy(o); setShowSort(false); }}
                  style={{ display: "block", width: "100%", padding: "8px 16px", textAlign: "left", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", textTransform: "uppercase", border: "none", background: sortBy === o ? "var(--border,#E5E0D8)" : "transparent", cursor: "pointer" }}>
                  {o === "relevance" ? "Relevancia" : o === "price-asc" ? "Precio ↑" : o === "price-desc" ? "Precio ↓" : "Alfabético"}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* Filter chips */}
        {chips.map((c, i) => (
          <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", background: "var(--text,#1C1915)", color: "var(--bg,#F9F7F2)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {c.label}
            <span onClick={c.clear} style={{ cursor: "pointer", marginLeft: 2 }}>×</span>
          </div>
        ))}
      </div>

      {/* FILTER MODAL */}
      {showFilter && (
        <div onClick={() => setShowFilter(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--surface,#FFF)", width: "100%", maxHeight: "80vh", overflow: "auto", borderTop: "1px solid var(--border,#E5E0D8)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px 12px", borderBottom: "1px solid var(--border,#E5E0D8)" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em" }}>Filtros</span>
              <button onClick={() => setShowFilter(false)} style={{ width: 30, height: 30, border: "1px solid var(--border,#E5E0D8)", background: "none", cursor: "pointer" }}>
                <i className="fas fa-times" />
              </button>
            </div>
            <div style={{ padding: "16px 20px 20px" }}>
              {/* Category */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", textTransform: "uppercase", marginBottom: 8 }}>Categoría</div>
                <select value={filterCat} onChange={e => { setFilterCat(e.target.value); setFilterSubcat(""); }}
                  style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border,#E5E0D8)", fontFamily: "inherit", fontSize: "0.8rem" }}>
                  <option value="">Todas</option>
                  {Object.keys(SUBCATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {/* Subcategory */}
              {filterCat && SUBCATEGORIES[filterCat] && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", textTransform: "uppercase", marginBottom: 8 }}>Subcategoría</div>
                  <select value={filterSubcat} onChange={e => setFilterSubcat(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", border: "1px solid var(--border,#E5E0D8)", fontFamily: "inherit", fontSize: "0.8rem" }}>
                    <option value="">Todas</option>
                    {SUBCATEGORIES[filterCat].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
              {/* Price */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", textTransform: "uppercase", marginBottom: 8 }}>Precio (€)</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {PRICE_RANGES.map(pr => (
                    <button key={pr.label} onClick={() => setFilterPrice(filterPrice?.label === pr.label ? null : pr)}
                      style={{ padding: "6px 12px", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, background: filterPrice?.label === pr.label ? "var(--text,#1C1915)" : "var(--surface,#FFF)", color: filterPrice?.label === pr.label ? "var(--bg,#F9F7F2)" : "var(--text,#1C1915)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", fontWeight: 500, textTransform: "uppercase", cursor: "pointer" }}>
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Condition */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", textTransform: "uppercase", marginBottom: 8 }}>Condición</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CONDITIONS.map(c => (
                    <button key={c.value} onClick={() => setFilterCond(c.value)}
                      style={{ padding: "6px 12px", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, background: filterCond === c.value ? "var(--text,#1C1915)" : "var(--surface,#FFF)", color: filterCond === c.value ? "var(--bg,#F9F7F2)" : "var(--text,#1C1915)", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", fontWeight: 500, textTransform: "uppercase", cursor: "pointer" }}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowFilter(false)}
                style={{ width: "100%", padding: "12px", background: "var(--text,#1C1915)", color: "var(--bg,#F9F7F2)", border: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION TITLE */}
      <div style={{ padding: "16px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "1.2rem", fontWeight: 500, margin: 0 }}>Descubrir</h2>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "var(--text-dim,#A09A94)" }}>{displayed.length} artículos</span>
      </div>

      {/* PRODUCT GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, padding: "12px 16px" }}>
        {displayed.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.55rem", color: "var(--text-dim,#A09A94)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            <i className="fas fa-box-open" style={{ fontSize: "2rem", display: "block", marginBottom: 12, opacity: 0.3 }} />
            No hay artículos todavía
          </div>
        )}
        {displayed.map((p, i) => (
          <Link key={p.id} to={`/articulo/${p.id}`}
            style={{ textDecoration: "none", color: "inherit", background: "var(--surface,#FFF)", border: "1px solid var(--border,#E5E0D8)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
            <div style={{ aspectRatio: "1", background: BG[i % BG.length], position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <button onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                style={{ position: "absolute", top: 8, right: 8, zIndex: 2, width: 32, height: 32, borderRadius: 2, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)", color: "#FFF", cursor: "pointer", fontSize: "0.9rem" }}>
                <i className="far fa-heart" />
              </button>
              {p.photos?.[0] || p.images?.[0] ? (
                <img src={p.photos?.[0] || p.images?.[0]} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <i className="fas fa-box" style={{ fontSize: "2rem", color: "rgba(255,255,255,0.2)" }} />
              )}
              <span style={{ position: "absolute", bottom: 8, left: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", fontWeight: 600, color: "#FFF", textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>
                €{String(p.price).replace(".", ",")}
              </span>
              <button onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                style={{ position: "absolute", bottom: 8, right: 8, zIndex: 2, width: 32, height: 32, borderRadius: 2, border: "1px solid rgba(255,255,255,0.3)", background: "rgba(0,0,0,0.25)", color: "#FFF", cursor: "pointer", fontSize: "0.8rem" }}>
                <i className="fas fa-exchange-alt" />
              </button>
            </div>
            <div style={{ padding: "8px 10px 10px" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {p.title} · {cl(p.condition)}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav" style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "var(--surface,#FFF)", borderTop: "1px solid var(--border,#E5E0D8)", display: "flex", justifyContent: "space-evenly", height: 68, paddingBottom: 12, zIndex: 100 }}>
        <Link to="/catalogo" className="nav-item active" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text,#1C1915)", textDecoration: "none", padding: "4px 0", flex: 1, maxWidth: 80 }}>
          <i className="fas fa-search" style={{ fontSize: "1.1rem" }} />
          <span>Buscar</span>
        </Link>
        <Link to="/treqes" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim,#A09A94)", textDecoration: "none", padding: "4px 0", flex: 1, maxWidth: 80 }}>
          <i className="fas fa-exchange-alt" style={{ fontSize: "1.1rem" }} />
          <span>treqes</span>
        </Link>
        <Link to="/subir" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim,#A09A94)", textDecoration: "none", padding: "4px 0", flex: 1, maxWidth: 80 }}>
          <div style={{ width: 42, height: 42, background: "var(--text,#1C1915)", color: "var(--bg,#F9F7F2)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 2 }}>
            <i className="fas fa-plus" style={{ fontSize: "1rem" }} />
          </div>
          <span>Subir</span>
        </Link>
        <Link to="/avisos" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim,#A09A94)", textDecoration: "none", padding: "4px 0", flex: 1, maxWidth: 80 }}>
          <i className="fas fa-bell" style={{ fontSize: "1.1rem" }} />
          <span>Avisos</span>
        </Link>
        <Link to="/perfil" className="nav-item" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.5rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-dim,#A09A94)", textDecoration: "none", padding: "4px 0", flex: 1, maxWidth: 80 }}>
          <i className="fas fa-user" style={{ fontSize: "1.1rem" }} />
          <span>Perfil</span>
        </Link>
      </nav>
    </div>
  );
}

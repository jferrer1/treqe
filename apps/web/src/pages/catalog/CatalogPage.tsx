import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export function CatalogPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", search, category, page, sort],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: "20", sort });
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      return api.get<{ items: Product[]; total: number; pages: number }>(
        `/api/products/?${params}`
      );
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get<{ categories: string[] }>("/api/products/categories"),
  });

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", paddingBottom: 80 }}>
      <Header />

      {/* Search bar */}
      <div style={{ padding: "12px 16px" }}>
        <input
          type="text"
          placeholder="¿Qué buscas?"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{
            width: "100%",
            padding: "12px 16px",
            borderRadius: 12,
            border: "1px solid #E0E0D8",
            background: "#FFFFFF",
            fontSize: "0.95rem",
            outline: "none",
          }}
        />
      </div>

      {/* Category chips */}
      {categories && (
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "0 16px 12px",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          <Chip active={!category} onClick={() => setCategory(null)}>
            Todo
          </Chip>
          {categories.categories.slice(0, 12).map((cat) => (
            <Chip
              key={cat}
              active={category === cat}
              onClick={() => setCategory(category === cat ? null : cat)}
            >
              {cat}
            </Chip>
          ))}
        </div>
      )}

      {/* Sort */}
      <div style={{ padding: "0 16px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.85rem", color: "#5C5C5C" }}>
          {data ? `${data.total} productos` : "Cargando..."}
        </span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid #E0E0D8",
            fontSize: "0.8rem",
            background: "#FFF",
          }}
        >
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio ↑</option>
          <option value="price_desc">Precio ↓</option>
        </select>
      </div>

      {/* Product grid */}
      {error && (
        <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
          Error al cargar productos
        </div>
      )}
      {isLoading && (
        <div style={{ padding: 40, textAlign: "center", color: "#999" }}>
          Cargando...
        </div>
      )}
      {data && data.total === 0 && (
        <div style={{ padding: 60, textAlign: "center", color: "#999" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📦</div>
          <div style={{ fontSize: "1rem", fontWeight: 600 }}>No hay productos aún</div>
          <div style={{ fontSize: "0.85rem", marginTop: 4 }}>¡Sé el primero en publicar!</div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 12,
          padding: "0 16px",
        }}
      >
        {data?.items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 20 }}>
          {Array.from({ length: Math.min(data.pages, 5) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                border: "none",
                background: page === i + 1 ? "#141414" : "#F5F5F0",
                color: page === i + 1 ? "#FFF" : "#141414",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flexShrink: 0,
        padding: "6px 14px",
        borderRadius: 20,
        border: "none",
        background: active ? "#141414" : "#F5F5F0",
        color: active ? "#FAFAF8" : "#5C5C5C",
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

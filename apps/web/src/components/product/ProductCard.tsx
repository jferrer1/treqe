import { Link } from "react-router-dom";
import type { Product } from "@/lib/api";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/articulo/${product.id}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "#FFFFFF",
        borderRadius: 14,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
        textDecoration: "none",
        color: "inherit",
        transition: "transform 0.15s",
      }}
    >
      {/* Placeholder image */}
      <div
        style={{
          height: 180,
          background: `linear-gradient(135deg, ${categoryColor(product.category)}, #e8e4dc)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "2.5rem",
        }}
      >
        {categoryIcon(product.category)}
      </div>

      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: "0.7rem", color: "#999", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>
          {product.category}
        </div>
        <div
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: "#141414",
            lineHeight: 1.3,
            marginBottom: 6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#141414" }}>
          {product.price.toLocaleString("es-ES")} €
        </div>
        {product.condition && (
          <div
            style={{
              marginTop: 4,
              fontSize: "0.7rem",
              color: "#5C5C5C",
              background: "#F5F5F0",
              display: "inline-block",
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            {conditionLabel(product.condition)}
          </div>
        )}
      </div>
    </Link>
  );
}

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Electrónica: "#e8e0d4",
    Móviles: "#dce4e8",
    Consolas: "#e0dce8",
    Hogar: "#e8e4dc",
    Deporte: "#dce8e0",
    Moda: "#e8dce0",
    Libros: "#e8e8dc",
    Música: "#dce0e8",
    Informática: "#d4dce8",
    Bicicletas: "#dce8d4",
    Cámaras: "#e8dcd4",
    Instrumentos: "#dce8e4",
    Motor: "#e4dce8",
    Herramientas: "#e8dce4",
    Decoración: "#e4e8dc",
    Jardín: "#dce4d4",
    Juguetes: "#e4e0dc",
    Coleccionismo: "#dce4e0",
    Niños: "#e0dce4",
    Otros: "#e8e8e4",
  };
  return map[cat] || "#e8e4dc";
}

function categoryIcon(cat: string): string {
  const map: Record<string, string> = {
    Electrónica: "📱", Móviles: "📱", Consolas: "🎮", Hogar: "🏠",
    Deporte: "⚽", Moda: "👕", Libros: "📚", Música: "🎵",
    Informática: "💻", Bicicletas: "🚲", Cámaras: "📷",
    Instrumentos: "🎸", Motor: "🏍️", Herramientas: "🔧",
    Decoración: "🛋️", Jardín: "🌿", Juguetes: "🧸",
    Coleccionismo: "🏆", Niños: "👶", Otros: "📦",
  };
  return map[cat] || "📦";
}

export function conditionLabel(c: string): string {
  const map: Record<string, string> = {
    new: "Nuevo", like_new: "Como nuevo", good: "Buen estado",
    fair: "Aceptable", poor: "Con desgaste",
  };
  return map[c] || c;
}

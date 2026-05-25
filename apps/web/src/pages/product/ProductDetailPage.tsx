import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, Product } from "@/lib/api";
import { conditionLabel } from "@/components/product/ProductCard";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuthStore } from "@/stores/authStore";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get<Product>(`/api/products/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return <div style={center}>Cargando...</div>;
  }
  if (!product) {
    return <div style={center}>Producto no encontrado</div>;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", paddingBottom: 80 }}>
      <Header />

      {/* Gallery placeholder */}
      <div
        style={{
          height: 320,
          background: "linear-gradient(135deg, #e8e4dc, #d4d0c8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "4rem",
        }}
      >
        📦
      </div>

      <div style={{ padding: "16px 20px" }}>
        {/* Category badge */}
        <div style={{ fontSize: "0.75rem", color: "#999", fontWeight: 600, marginBottom: 6 }}>
          {product.category}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#141414", marginBottom: 12 }}>
          {product.title}
        </h1>

        {/* Price */}
        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#141414", marginBottom: 16 }}>
          {product.price.toLocaleString("es-ES")} €
        </div>

        {/* Description */}
        {product.description && (
          <p style={{ fontSize: "0.9rem", color: "#5C5C5C", lineHeight: 1.6, marginBottom: 20 }}>
            {product.description}
          </p>
        )}

        {/* Condition */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <Badge label={conditionLabel(product.condition)} />
          {product.subcategory && <Badge label={product.subcategory} />}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {user ? (
            <>
              <Link
                to={`/pago/purchase/${product.id}`}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#141414",
                  color: "#FAFAF8",
                  textAlign: "center",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Comprar ahora
              </Link>
              <Link
                to={`/subir?offer_for=${product.id}`}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: "#F5F5F0",
                  color: "#141414",
                  textAlign: "center",
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                  border: "1px solid #E0E0D8",
                }}
              >
                Quiero esto (intercambio)
              </Link>
            </>
          ) : (
            <Link
              to="/registro"
              style={{
                flex: 1,
                padding: "14px 0",
                background: "#141414",
                color: "#FAFAF8",
                textAlign: "center",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.95rem",
                textDecoration: "none",
              }}
            >
              Regístrate para comprar
            </Link>
          )}
        </div>

        {/* Seller */}
        <div
          style={{
            padding: 16,
            background: "#FFF",
            borderRadius: 12,
            border: "1px solid #E0E0D8",
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: "0.8rem", color: "#999", marginBottom: 4 }}>Publicado por</div>
          <div style={{ fontWeight: 600, color: "#141414" }}>Usuario #{product.id.slice(0, 8)}</div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "4px 10px",
        background: "#F5F5F0",
        borderRadius: 20,
        fontSize: "0.75rem",
        color: "#5C5C5C",
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}

const center = { padding: 60, textAlign: "center" as const, color: "#999" };

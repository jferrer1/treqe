import { Helmet } from "react-helmet-async";

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Treqe — Intercambia lo que no usas por lo que necesitas</title>
        <meta name="description" content="Marketplace de segunda mano con intercambio circular inteligente." />
        <meta property="og:title" content="Treqe — Intercambio circular inteligente" />
        <meta property="og:description" content="Intercambia artículos en círculos de 3 personas. Sin dinero, solo trueque." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://treqe.es" />
      </Helmet>

      <main style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "#f8fafc",
        textAlign: "center",
        padding: "2rem",
      }}>
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔄 Treqe</h1>
        <p style={{ fontSize: "1.25rem", color: "#94a3b8", maxWidth: "500px", marginBottom: "2rem" }}>
          Intercambia lo que no usas por lo que necesitas.
          Marketplace de segunda mano con intercambio circular inteligente.
        </p>
        <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
          🚧 Fase 0 — Infraestructura en construcción
        </p>
      </main>
    </>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Header } from "@/components/layout/Header";

export function RegisterPage() {
  const { login, register, error, loading } = useAuthStore();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await register(email, password, name);
    }
    if (!useAuthStore.getState().error) {
      navigate("/catalogo");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, textAlign: "center", marginBottom: 8 }}>
            {isLogin ? "Bienvenido de nuevo" : "Únete a Treqe"}
          </h1>
          <p style={{ textAlign: "center", color: "#5C5C5C", marginBottom: 28, fontSize: "0.9rem" }}>
            {isLogin ? "Accede a tu cuenta" : "Intercambia lo que no usas por lo que necesitas"}
          </p>

          {error && (
            <div style={{ padding: 10, background: "#FEE2E2", borderRadius: 8, color: "#991B1B", fontSize: "0.85rem", marginBottom: 16, textAlign: "center" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={inputStyle}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: 14,
                background: loading ? "#999" : "#141414",
                color: "#FAFAF8",
                border: "none",
                borderRadius: 12,
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: 8,
              }}
            >
              {loading ? "Cargando..." : isLogin ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{ background: "none", border: "none", color: "#5C5C5C", fontSize: "0.85rem", cursor: "pointer", textDecoration: "underline" }}
            >
              {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 10,
  border: "1px solid #E0E0D8",
  background: "#FFFFFF",
  fontSize: "0.95rem",
  marginBottom: 12,
  outline: "none",
  display: "block",
};

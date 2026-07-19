import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { login, register, user } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  if (user) { navigate("/catalogo", { replace: true }); return null; }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Todos los campos son obligatorios."); return; }
    if (mode === "register" && !name.trim()) { setError("El nombre es obligatorio."); return; }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password, name.trim() || email.split("@")[0]);
      }
      const err = useAuthStore.getState().error;
      if (err) { setError(err); setLoading(false); return; }
      navigate("/catalogo", { replace: true });
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight:"100vh",background:"#F9F7F2",fontFamily:"'IBM Plex Sans',sans-serif",display:"flex",flexDirection:"column" }}>
      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",padding:"12px 16px",borderBottom:"1px solid #E5E0D8",background:"#F9F7F2" }}>
        <button onClick={() => navigate(-1)} style={{ background:"none",border:"1px solid #E5E0D8",borderRadius:2,padding:"6px 12px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",textTransform:"uppercase",letterSpacing:".1em",color:"#55504B" }}>
          ←
        </button>
      </div>

      {/* Form */}
      <div style={{ flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem 1rem" }}>
        <div style={{ background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,padding:"40px 36px",width:"100%",maxWidth:420 }}>
          <h1 style={{ fontSize:"1.3rem",fontWeight:400,letterSpacing:"-.5px",color:"#1C1915",marginBottom:6 }}>
            {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </h1>
          <p style={{ fontSize:".82rem",color:"#6B6560",marginBottom:28 }}>
            {mode === "login" ? "Accede a tu cuenta de Treqe." : "Únete a la comunidad de intercambio circular."}
          </p>

          {error && (
            <div style={{ padding:"12px 14px",background:"#FEF2F2",border:"1px solid #FECACA",borderRadius:8,marginBottom:20 }}>
              <p style={{ fontSize:".85rem",color:"#991B1B",margin:0,lineHeight:1.5 }}>
                ⚠️ {error}
              </p>
              {mode === "login" && error.toLowerCase().includes("incorrect") && (
                <p style={{ fontSize:".8rem",color:"#7F1D1D",margin:"8px 0 0",lineHeight:1.5 }}>
                  <Link to="/recuperar-password" style={{ color:"#1C1915",fontWeight:500 }}>¿Olvidaste tu contraseña? Recuperar acceso</Link>
                  <br />
                  <Link to="/registro" style={{ color:"#6B6560",fontSize:".75rem" }}>¿No tienes cuenta? Regístrate aquí</Link>
                </p>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:18 }}>
            {mode === "register" && (
              <label style={labelStyle}>
                Nombre
                <input type="text" value={name} onChange={e => setName(e.target.value)} style={inputStyle} placeholder="Tu nombre" autoFocus />
              </label>
            )}
            <label style={labelStyle}>
              Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="tu@email.com" autoFocus={mode==="login"} />
            </label>
            <label style={labelStyle}>
              Contraseña
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} placeholder="••••••••" />
            </label>

            {mode === "login" && (
              <div style={{ textAlign:"right" }}>
                <Link to="/recuperar-password" style={{ fontSize:".75rem",color:"#6B6560",textDecoration:"none",fontFamily:"'IBM Plex Mono',monospace" }}>
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              padding:"12px 24px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".65rem",
              fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",
              background:"#1C1915",color:"#F9F7F2",border:"none",borderRadius:2,
              cursor:loading?"not-allowed":"pointer",opacity:loading?.7:1,
            }}>
              {loading ? (mode === "login" ? "Entrando..." : "Creando cuenta...") : (mode === "login" ? "Entrar" : "Crear cuenta")}
            </button>
          </form>

          <p style={{ marginTop:24,textAlign:"center",fontSize:".8rem",color:"#6B6560",borderTop:"1px solid #E5E0D8",paddingTop:20 }}>
            {mode === "login" ? (
              <>¿No tienes cuenta? <Link to="/registro" style={{ color:"#1C1915",fontWeight:500,fontFamily:"'IBM Plex Mono',monospace",fontSize:".7rem" }}>Regístrate gratis</Link></>
            ) : (
              <>¿Ya tienes cuenta? <Link to="/login" style={{ color:"#1C1915",fontWeight:500,fontFamily:"'IBM Plex Mono',monospace",fontSize:".7rem" }}>Inicia sesión</Link></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display:"flex",flexDirection:"column",gap:6,
  fontSize:".7rem",fontWeight:500,color:"#55504B",
  fontFamily:"'IBM Plex Mono',monospace",
  textTransform:"uppercase",letterSpacing:".05em",
};
const inputStyle: React.CSSProperties = {
  padding:"10px 14px",fontSize:".9rem",
  fontFamily:"'IBM Plex Sans',sans-serif",
  border:"1px solid #E5E0D8",borderRadius:2,
  background:"#F9F7F2",color:"#1C1915",outline:"none",
};

export function RegisterPage() { return <AuthPage mode="register" />; }
export function LoginPage() { return <AuthPage mode="login" />; }

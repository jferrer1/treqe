import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function Header() {
  const user = useAuthStore((s) => s.user);
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 16px",
        minHeight: 56,
        background: "#F9F7F2",
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid #E5E0D8",
        fontFamily: "'IBM Plex Sans',sans-serif",
      }}
    >
      <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: 8 }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: ".85rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "#1C1915" }}>
          treqe
        </span>
      </Link>
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        <Link to="/catalogo" style={linkStyle}>Catálogo</Link>
        <Link to="/blog" style={linkStyle}>Blog</Link>
        <Link to="/faq" style={linkStyle}>FAQ</Link>
        <Link to="/sobre" style={linkStyle}>Sobre</Link>
        {user ? (
          <Link to="/perfil" style={{...linkStyle, display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:24,height:24,borderRadius:2,background:"#1C1915",color:"#F9F7F2",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:600,textTransform:"uppercase"}}>{(user.full_name || user.email || "?").charAt(0)}</span>
          </Link>
        ) : (
          <Link to="/login" style={{...linkStyle, border:"1px solid #1C1915", color:"#1C1915"}}>Entrar</Link>
        )}
      </div>
    </header>
  );
}

const linkStyle: React.CSSProperties = {
  fontFamily: "'IBM Plex Mono',monospace",
  fontSize: ".55rem", fontWeight: 500,
  textTransform: "uppercase", letterSpacing: ".1em",
  padding: "6px 12px", color: "#55504B",
  textDecoration: "none", borderRadius: 2,
  border: "1px solid transparent",
};

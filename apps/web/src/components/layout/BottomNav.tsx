import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function BottomNav() {
  const user = useAuthStore((s) => s.user);

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 0 12px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid #E0E0D8",
        zIndex: 100,
      }}
    >
      <NavItem to="/catalogo" icon="🔍" label="Buscar" />
      <NavItem to={user ? "/treqes" : "/registro"} icon="🔄" label="Treqes" />
      <NavItem to={user ? "/subir" : "/registro"} icon="➕" label="Subir" />
      <NavItem to={user ? "/avisos" : "/registro"} icon="🔔" label="Avisos" />
      <NavItem to={user ? "/perfil" : "/registro"} icon="👤" label="Perfil" />
    </nav>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: string; label: string }) {
  return (
    <Link
      to={to}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textDecoration: "none",
        color: "#5C5C5C",
        fontSize: "0.65rem",
        fontWeight: 500,
        gap: 2,
      }}
    >
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

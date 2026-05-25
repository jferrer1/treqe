import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function BottomNav() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const base = user ? "" : "/registro";

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  return (
    <nav className="bottom-nav">
      <Link to="/catalogo" className={`nav-item ${isActive("/catalogo") ? "active" : ""}`}>
        <i className="fas fa-search" />
        <span>Buscar</span>
      </Link>
      <Link to="/treqes" className={`nav-item ${isActive("/treqes") ? "active" : ""}`}>
        <i className="fas fa-rotate" />
        <span>Treqes</span>
      </Link>
      <Link to={user ? "/subir" : base} className="nav-item">
        <div className="nav-add-btn">
          <i className="fas fa-plus" />
        </div>
        <span>Subir</span>
      </Link>
      <Link to={user ? "/avisos" : base} className={`nav-item ${isActive("/avisos") ? "active" : ""}`}>
        <i className="far fa-bell" />
        <span>Avisos</span>
      </Link>
      <Link to={user ? "/perfil" : base} className={`nav-item ${isActive("/perfil") ? "active" : ""}`}>
        <i className="far fa-user" />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}

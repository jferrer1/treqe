import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

export function BottomNav() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const [unread, setUnread] = useState(0);
  const base = user ? "" : "/registro";
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

  useEffect(() => {
    if (!user) return;
    const iv = setInterval(async () => {
      try {
        const res: any = await api.get("/api/notifications/");
        const items = res.items || res || [];
        setUnread(items.filter((n: any) => !n.read).length);
      } catch {}
    }, 10000); // poll every 10s
    (async () => {
      try {
        const res: any = await api.get("/api/notifications/");
        const items = res.items || res || [];
        setUnread(items.filter((n: any) => !n.read).length);
      } catch {}
    })();
    return () => clearInterval(iv);
  }, [user]);

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
        <div style={{position:"relative",display:"inline-flex"}}>
          <i className="far fa-bell" />
          {unread > 0 && (
            <span style={{
              position:"absolute",top:-6,right:-8,
              minWidth:16,height:16,borderRadius:8,
              background:"#E74C3C",color:"#FFF",
              fontFamily:"'IBM Plex Mono',monospace",
              fontSize:".5rem",fontWeight:700,
              display:"flex",alignItems:"center",justifyContent:"center",
              padding:"0 4px",lineHeight:1,
            }}>{unread > 99 ? "99+" : unread}</span>
          )}
        </div>
        <span>Avisos</span>
      </Link>
      <Link to={user ? "/perfil" : base} className={`nav-item ${isActive("/perfil") ? "active" : ""}`}>
        {user ? (
          <div style={{
            width:28,height:28,borderRadius:2,
            background:"#1C1915",color:"#F9F7F2",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontFamily:"'IBM Plex Mono',monospace",
            fontSize:".7rem",fontWeight:600,
            textTransform:"uppercase"
          }}>
            {(user.full_name || user.email || "?").charAt(0)}
          </div>
        ) : (
          <i className="far fa-user" />
        )}
        <span>Perfil</span>
      </Link>
    </nav>
  );
}

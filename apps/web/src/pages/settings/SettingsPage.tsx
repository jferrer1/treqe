import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => { checkAuth(); }, []);

  const handleLogout = () => { logout(); navigate("/login"); };

  const name = user?.name || "Usuario";
  const email = user?.email || "";
  const initial = name.charAt(0).toUpperCase();

  if (!hasToken) return (
    <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>
      <p>Necesitas iniciar sesion</p>
      <Link to="/login" style={{color:"#1C1915",textDecoration:"underline",marginTop:12,display:"inline-block"}}>Iniciar sesion</Link>
    </div>
  );

  return (
    <>
      <div className="treqe-header">
        <div className="treqe-header__left">
          <button className="treqe-header__back" onClick={() => navigate(-1)} aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
          <span className="treqe-header__title">Ajustes</span>
        </div>
      </div>

      <div className="settings-wrap">
        <Link to="/perfil" style={{textDecoration:"none",color:"inherit"}}>
          <div className="profile-card">
            <div className="profile-card__avatar">{initial}</div>
            <div className="profile-card__info">
              <div className="profile-card__name">{name}</div>
              <div className="profile-card__email">{email}</div>
            </div>
            <div className="profile-card__arrow"><i className="fas fa-chevron-right"></i></div>
          </div>
        </Link>

        <div className="section">
          <div className="section__label">Perfil</div>
          <div className="settings-group">
            <Link to="/perfil/editar" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-accent"><i className="fas fa-user-edit"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title">Editar perfil</div>
                <div className="settings-item__sub">Nombre, bio, ubicacion</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
            <Link to="/perfil/verificar" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-teal"><i className="fas fa-check-circle"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title">Verificar identidad</div>
                <div className="settings-item__sub">{user?.verified ? "Verificado" : "No verificado"}</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
          </div>
        </div>

        <div className="section">
          <div className="section__label">Envios</div>
          <div className="settings-group">
            <Link to="/perfil/direccion" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-gray"><i className="fas fa-map-marker-alt"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title">Direccion de envio</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
            <Link to="/perfil/pagos" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-teal"><i className="fas fa-credit-card"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title">Metodos de pago</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
          </div>
        </div>

        <div className="section">
          <div className="section__label">Legal</div>
          <div className="settings-group">
            <Link to="/legal/terminos" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-gray"><i className="fas fa-file-alt"></i></div>
              <div className="settings-item__content"><div className="settings-item__title">Terminos y condiciones</div></div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
            <Link to="/legal/privacidad" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-gray"><i className="fas fa-shield-alt"></i></div>
              <div className="settings-item__content"><div className="settings-item__title">Politica de privacidad</div></div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
          </div>
        </div>

        <div className="section">
          <div className="section__label">Acerca de</div>
          <div className="settings-group">
            <Link to="/sobre" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-accent"><i className="fas fa-info-circle"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title">Sobre Treqe</div>
                <div className="settings-item__sub">v0.1.0</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
            <Link to="/faq" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-gray"><i className="fas fa-question-circle"></i></div>
              <div className="settings-item__content"><div className="settings-item__title">FAQ</div></div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
            <Link to="/contactar" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-gray"><i className="fas fa-headset"></i></div>
              <div className="settings-item__content"><div className="settings-item__title">Contactar soporte</div></div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
          </div>
        </div>

        <div className="section danger-zone">
          <div className="section__label danger-label">Zona de peligro</div>
          <div className="settings-group danger-group">
            <Link to="/perfil/eliminar" className="settings-item" style={{textDecoration:"none",color:"inherit"}}>
              <div className="settings-item__icon icon-red"><i className="fas fa-trash-alt"></i></div>
              <div className="settings-item__content">
                <div className="settings-item__title" style={{color:"var(--danger)"}}>Eliminar cuenta</div>
              </div>
              <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
            </Link>
          </div>
        </div>

        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Cerrar sesion
          </button>
        </div>

        <div className="version-info">treqe v0.1.0<span>&copy; 2026 Treqe</span></div>
      </div>

      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>Treqes</span></Link>
        <Link to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span></Link>
        <Link to="/perfil" className="nav-item active"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </>
  );
}

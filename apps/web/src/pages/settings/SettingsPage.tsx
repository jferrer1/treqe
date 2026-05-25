import { Link } from "react-router-dom";


export function SettingsPage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Ajustes</span>
    </div>
    <div className="treqe-header__right">
    </div>
  </div>

  <div className="settings-wrap">

    
    <div className="profile-card" >
      <div className="profile-card__avatar">P</div>
      <div className="profile-card__info">
        <div className="profile-card__name">Pepe</div>
        <div className="profile-card__email">pepe@email.com</div>
      </div>
      <div className="profile-card__arrow"><i className="fas fa-chevron-right"></i></div>
    </div>

    
    <div className="section">
      <div className="section__label">Notificaciones</div>
      <div className="settings-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-accent"><i className="fas fa-star"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Match encontrado</div>
            <div className="settings-item__sub">Cuando un intercambio es posible</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-teal"><i className="fas fa-box"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Estado del envío</div>
            <div className="settings-item__sub">Cambios en el seguimiento</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked />
            <span className="toggle__slider"></span>
          </label>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-envelope"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Correo electrónico</div>
            <div className="settings-item__sub">Resúmenes y ofertas</div>
          </div>
          <label className="toggle">
            <input type="checkbox" />
            <span className="toggle__slider"></span>
          </label>
        </div>

      </div>
    </div>

    
    <div className="section">
      <div className="section__label">Envíos</div>
      <div className="settings-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-map-marker-alt"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Dirección de envío</div>
            <div className="settings-item__sub">Calle Mayor 42, 28001 Madrid</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-teal"><i className="fas fa-credit-card"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Métodos de pago</div>
            <div className="settings-item__sub">Visa ···· 4242</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

      </div>
    </div>

    
    <div className="section">
      <div className="section__label">Cuenta</div>
      <div className="settings-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-lock"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Contraseña</div>
            <div className="settings-item__sub">Último cambio hace 2 meses</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

      </div>
    </div>

    
    
    
    <div className="section">
      <div className="section__label">Privacidad</div>
      <div className="settings-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-file-alt"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Términos y condiciones</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-shield-alt"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Política de privacidad</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

      </div>
    </div>

    
    
    
    <div className="section danger-zone">
      <div className="section__label danger-label">Zona de peligro</div>
      <div className="settings-group danger-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-red"><i className="fas fa-trash-alt"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title" style={{ color: 'var(--danger)' }}>Eliminar cuenta</div>
            <div className="settings-item__sub">Se borrarán tus datos, perfil y artículos</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

      </div>
    </div>

    
    
    
    <div className="section">
      <div className="section__label">Acerca de</div>
      <div className="settings-group">

        <div className="settings-item" >
          <div className="settings-item__icon icon-accent"><i className="fas fa-info-circle"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Sobre Treqe</div>
            <div className="settings-item__sub">Versión 0.1.0 · Build 2026.04</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-question-circle"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">FAQ</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

        <div className="settings-item" >
          <div className="settings-item__icon icon-gray"><i className="fas fa-headset"></i></div>
          <div className="settings-item__content">
            <div className="settings-item__title">Contactar soporte</div>
          </div>
          <div className="settings-item__action"><i className="fas fa-chevron-right"></i></div>
        </div>

      </div>
    </div>

    
    <div className="logout-section">
      <button className="logout-btn" >
        <i className="fas fa-sign-out-alt"></i> Cerrar sesión
      </button>
    </div>

    
    <div className="version-info">
      treqe v0.1.0
      <span>© 2026 Treqe - Intercambio circular inteligente</span>
    </div>

  </div>

  
  <div className="modal-overlay" id="deleteModal" >
    <div className="modal-box">
      <div className="modal-icon"><i className="fas fa-exclamation-triangle"></i></div>
      <h3>&iquest;Est&aacute;s seguro?</h3>
      <div className="modal-sub">Esta acci&oacute;n es irreversible. Se borrar&aacute;n tu perfil, art&iacute;culos y todo tu historial en Treqe.</div>
      <div className="modal-actions">
        <button className="modal-btn-cancel" >Cancelar</button>
        <button className="modal-btn-delete" >S&iacute;, eliminar</button>
      </div>
    </div>
  </div>

  

    <nav className="bottom-nav">
    <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
    <Link  to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>Treqes</span></Link>
    <Link  to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
    <Link  to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
    <Link  to="/perfil" className="nav-item active"><i className="fas fa-user"></i><span>Perfil</span></Link>
  </nav>


  <nav className="bottom-nav">
    <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
    <Link  to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
    <Link  to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
    <Link  to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
    <Link  to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
  </nav>
    </>
  );
}

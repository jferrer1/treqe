import { Link } from "react-router-dom";

export function HubPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Prototipo</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>

<div className="phone">
 
 <div className="nav-bar">
 <span className="logo"><Link to="#" className="treqe-logo-link"><svg className="treqe-logo" viewBox="0 0 76 24" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="19" font-family="Inter, sans-serif" font-weight="700" font-size={22} letter-spacing="-1.5" fill="#1C1915">treqe<text x="60" y="19" fill="#1C1915">.</text></text></svg></Link></span>
 <select className="nav-select" id="screenSelect">
 <option value="splash">🚀 Splash</option>
 <option value="onboarding">📱 Onboarding</option>
 <option value="registro">📝 Registro</option>
 <option value="catalogo" selected>🔍 Catálogo</option>
 <option value="detalle">📦 Detalle</option>
 <option value="subir">⬆️ Subir</option>
 <option value="perfil">👤 Perfil</option>
 <option value="notificaciones">🔔 Notificaciones</option>
 <option value="matches">⭐ Mis Matches</option>
 <option value="match">💱 Match</option>
 <option value="seguimiento">📍 Seguimiento</option>
 <option value="ajustes">⚙️ Ajustes</option>
 </select>
 <button className="nav-btn" title="Volver"><i className="fas fa-arrow-left"></i></button>
 <button className="nav-btn primary" title="Recargar"><i className="fas fa-sync-alt"></i></button>
 </div>

 
 <div className="quick-actions" id="quickActions">
 <button className="active" id="btn-catalogo">Catálogo</button>
 <button id="btn-perfil">Perfil</button>
 <button id="btn-notificaciones">Notifs</button>
 <button id="btn-matches">Matches</button>
 <button id="btn-subir">Subir</button>
 <button id="btn-match">Match</button>
 </div>

 
 <div className="loader" id="loader"><div className="spinner"></div></div>

 
 <iframe id="screenFrame" src="../v1-catalogo/"></iframe>

 
 <div className="info-bar">
 <span><i className="fas fa-mouse-pointer"></i> Click en pantalla para interactuar</span>
 <span><i className="fas fa-code-branch"></i> v0-prototype</span>
 </div>
 </div>

 
<div className="treqe-bottom-nav">
 <Link to="/catalogo" className="treqe-nav-item"><i className="fas fa-th"></i> Catalogo</Link>
 <Link to="/treqes" className="treqe-nav-item"><i className="fas fa-exchange-alt"></i> Intercambios</Link>
 <Link to="/favoritos" className="treqe-nav-item"><i className="fas fa-heart"></i> Favoritos</Link>
 <Link to="/perfil" className="treqe-nav-item"><i className="fas fa-user"></i> Perfil</Link>
</div>

<div className="treqe-footer">(c) 2026 treqe - Todos los derechos reservados</div>

<div className="demo-tag"><i className="fas fa-flask"></i> treqe Prototype -- v0-prototype -- May 2026</div>
    </>
  );
}

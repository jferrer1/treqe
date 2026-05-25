import { Link } from "react-router-dom";

export function MatchPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Match</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>


 
 
 
 
 <div className="app-bar">
 <span className="app-bar__logo"><Link to="#" className="treqe-logo-link"><svg className="treqe-logo" viewBox="0 0 76 24" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="19" font-family="Inter, sans-serif" font-weight="700" font-size="22" letter-spacing="-1.5" fill="#1C1915">treqe<text x="60" y="19" fill="#1C1915">.</text></text></svg></Link></span>
 <span className="app-bar__spacer"></span>
 <button><i className="fas fa-bell"></i></button>
 <button><i className="fas fa-user"></i></button>
 </div>

 
 <div className="push-notif" id="pushNotif">
 <i className="fas fa-bolt"></i> ¡Nuevo match encontrado!
 </div>

 
 <div className="overlay" id="overlay">
 <div className="overlay-bg"></div>

 <div className="notification-sheet" id="notifSheet">

 
 <div className="sheet-handle"><span></span></div>

 
 <div id="celebrationState">
 <div className="celebration">
 <div className="celebration__icon"><i className="fas fa-bolt"></i></div>
 <h2>¡Enhorabuena!</h2>
 <p>Hay una oportunidad para ti</p>
 </div>

 
 <div className="item-compare">
 <div className="item-compare__item">
 <div className="item-compare__image get">
 <i className="fas fa-guitar"></i>
 </div>
 <div className="item-compare__name">Fender Stratocaster</div>
 <div className="item-compare__price">580€</div>
 </div>
 <div className="item-compare__arrow"><i className="fas fa-arrow-right"></i></div>
 <div className="item-compare__item">
 <div className="item-compare__image give">
 <i className="fas fa-bicycle"></i>
 </div>
 <div className="item-compare__name">Trek Marlin 7</div>
 <div className="item-compare__price">420€</div>
 </div>
 <div className="item-compare__labels">
 <span>Recibes</span>
 <span style={{ visibility: 'hidden' }}>—</span>
 <span>Ofreces</span>
 </div>
 </div>

 
 <div className="trade-summary">
 <div className="trade-summary__row">
 <span className="label">Artículo solicitado</span>
 <span className="value">🎸 580€</span>
 </div>
 <div className="trade-summary__row">
 <span className="label">Tu artículo</span>
 <span className="value">🚲 420€</span>
 </div>
 <div className="trade-summary__row total">
 <span className="label">Diferencia a pagar</span>
 <span className="value">+160€</span>
 </div>
 </div>

 
 <div className="timer">
 <i className="fas fa-hourglass-half"></i>
 Tienes <strong id="countdown">23:59:59</strong> para decidir
 </div>

 
 <div className="participants-status" id="participantsStatus" style={{ display: 'none' }}>
 <h4 style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '12px', color: 'var(--text)' }}>Estado del círculo</h4>
 <div className="participant-row">
 <div className="participant-avatar">T</div>
 <div className="participant-info">
 <span className="participant-name">Tú</span>
 <span className="participant-item">Trek Marlin 7</span>
 </div>
 <div className="participant-status status-accepted"><i className="fas fa-check"></i> Aceptado</div>
 </div>
 <div className="participant-row">
 <div className="participant-avatar">A</div>
 <div className="participant-info">
 <span className="participant-name">Ana</span>
 <span className="participant-item">Fender Stratocaster</span>
 </div>
 <div className="participant-status status-pending"><i className="fas fa-clock"></i> Pendiente</div>
 </div>
 <div className="participant-row">
 <div className="participant-avatar">B</div>
 <div className="participant-info">
 <span className="participant-name">Bruno</span>
 <span className="participant-item">Cámara Canon</span>
 </div>
 <div className="participant-status status-pending"><i className="fas fa-clock"></i> Pendiente</div>
 </div>
 </div>

 
 <div className="action-buttons" id="actionBtns">
 <button className="action-btn action-btn--reject">
 <i className="fas fa-times"></i> Rechazar
 </button>
 <button className="action-btn action-btn--accept">
 <i className="fas fa-bolt" style={{ color: '#FFF' }}></i> Aceptar
 </button>
 </div>
 </div>

 
 <div className="accepted-state" id="acceptedState">
 <div className="check-icon"><i className="fas fa-check"></i></div>
 <h3>¡Has aceptado!</h3>
 <p>Esperando confirmación de Ana y Bruno...</p>
 
 
 <div className="timer" style={{ marginTop: '16px' }}>
 <i className="fas fa-hourglass-half"></i>
 Expira en <strong id="countdownAccepted">23:45:12</strong>
 </div>

 
 <div className="participants-status" style={{ marginTop: '20px', textAlign: 'left' }}>
 <div className="participant-row">
 <div className="participant-avatar" style={{ background: 'var(--success)', color: '#FFF' }}>T</div>
 <div className="participant-info">
 <span className="participant-name">Tú</span>
 <span className="participant-item">Trek Marlin 7</span>
 </div>
 <div className="participant-status status-accepted"><i className="fas fa-check"></i></div>
 </div>
 <div className="participant-row">
 <div className="participant-avatar">A</div>
 <div className="participant-info">
 <span className="participant-name">Ana</span>
 <span className="participant-item">Fender Stratocaster</span>
 </div>
 <div className="participant-status status-pending"><i className="fas fa-clock"></i></div>
 </div>
 <div className="participant-row">
 <div className="participant-avatar">B</div>
 <div className="participant-info">
 <span className="participant-name">Bruno</span>
 <span className="participant-item">Cámara Canon</span>
 </div>
 <div className="participant-status status-pending"><i className="fas fa-clock"></i></div>
 </div>
 </div>

 <button className="next-btn" style={{ marginTop: '24px' }}>
 Entendido
 </button>
 </div>

 
 <div className="rejected-state" id="rejectedState" style={{ display: 'none', textAlign: 'center', padding: '24px 0' }}>
 <div className="check-icon" style={{ background: 'var(--text-tertiary)' }}><i className="fas fa-times" style={{ color: '#FFF' }}></i></div>
 <h3>Match rechazado</h3>
 <p>Tu artículo vuelve a estar disponible para otros trueques.</p>
 <button className="next-btn" style={{ background: 'var(--text-secondary)' }}>
 Entendido
 </button>
 </div>

 </div>
 </div>

 
<div className="treqe-bottom-nav">
 <Link to="/catalogo" className="treqe-nav-item"><i className="fas fa-th"></i> Catalogo</Link>
 <Link to="/treqes" className="treqe-nav-item"><i className="fas fa-exchange-alt"></i> Intercambios</Link>
 <Link to="/favoritos" className="treqe-nav-item"><i className="fas fa-heart"></i> Favoritos</Link>
 <Link to="/perfil" className="treqe-nav-item"><i className="fas fa-user"></i> Perfil</Link>
</div>

<div className="treqe-footer">(c) 2026 treqe - Todos los derechos reservados</div>

<div className="demo-tag"><i className="fas fa-flask"></i> treqe Prototype -- v6-match-notification -- May 2026</div>
    </>
  );
}

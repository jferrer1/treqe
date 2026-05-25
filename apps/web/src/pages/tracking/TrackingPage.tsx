import { Link } from "react-router-dom";

export function TrackingPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Seguimiento</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>

 
 <div className="tabs">
 <button className="tab active"><i className="fas fa-truck"></i> Envíos activos <span className="count">3</span></button>
 <button className="tab"><i className="fas fa-check-circle"></i> Historial <span className="count">2</span></button>
 </div>

 
 <div className="tracking-section active" id="active-section">

 
 <div className="tracking-card">
 <div className="tracking-card__header">
 <div>
 <span className="tracking-card__type direct"><i className="fas fa-credit-card"></i> Compra directa</span>
 <div className="tracking-card__id">#ORD-5501</div>
 </div>
 <span style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>7 de mayo</span>
 </div>
 <div className="tracking-card__title">iPhone 15 Pro · 256GB · Titanio</div>
 <div className="tracking-card__meta">890€ · Vendedor: Ana</div>

 <div className="timeline">
 <div className="timeline-step completed">
 <div className="timeline-step__dot"><i className="fas fa-check"></i></div>
 <div className="timeline-step__label">Esperando envío del vendedor</div>
 </div>
 <div className="timeline-step active">
 <div className="timeline-step__dot"><i className="fas fa-truck"></i></div>
 <div className="timeline-step__label">En tránsito</div>
 </div>
 <div className="timeline-step">
 <div className="timeline-step__dot"><i className="fas fa-box"></i></div>
 <div className="timeline-step__label">Acción requerida: entregar paquete</div>
 </div>
 <div className="timeline-step">
 <div className="timeline-step__dot"><i className="fas fa-home"></i></div>
 <div className="timeline-step__label">¡Entregado!</div>
 </div>
 </div>

 <div className="tracking-info">
 <i className="fas fa-map-marker-alt"></i>
 <div className="tracking-info__text">
 <a href="https://www.correosexpress.com/tracking?num=123456" target="_blank" rel="noopener">Correos Express</a> · En tránsito · Madrid, 14:32
 </div>
 <div className="tracking-info__date">Hoy</div>
 </div>
 <button className="tracking-action tracking-action--outline"><i className="fas fa-search-location"></i> Ver seguimiento completo</button>
 </div>

 
 <div className="tracking-card">
 <div className="tracking-card__header">
 <div>
 <span className="tracking-card__type circular"><i className="fas fa-exchange-alt"></i> Intercambio circular</span>
 <div className="tracking-card__id">#TRX-7843</div>
 </div>
 <span style={{ fontSize: '.7rem', color: 'var(--text-tertiary)' }}>7 de mayo</span>
 </div>

 <div className="swap-split">
 <div className="swap-split__side swap-split__side--receive">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-down"></i></div>
 <span className="swap-split__header-label">Lo que recibo</span>
 <span className="swap-split__status swap-split__status--info">En tránsito</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-camera"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">Canon EOS R</div>
 <div className="swap-split__item-from">de Ana</div>
 </div>
 </div>
 <div className="swap-split__carrier">
 <i className="fas fa-truck"></i>
 <a href="https://www.seur.com/livres/pseguim.web?n=SEUR789012" target="_blank" rel="noopener">SEUR <i className="fas fa-external-link-alt"></i></a>
 · Barcelona, 9:15 · Llega mañana
 </div>
 </div>

 <div className="swap-split__side swap-split__side--send">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-up"></i></div>
 <span className="swap-split__header-label">Lo que envío</span>
 <span className="swap-split__status swap-split__status--success">¡Entregado!</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-headphones"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">AirPods Max</div>
 <div className="swap-split__item-from">380€</div>
 </div>
 </div>
 <div className="swap-split__carrier">
 <i className="fas fa-check-circle" style={{ color: 'var(--success)' }}></i>
 <span>Ana ya lo recibió <span style={{ color: 'var(--text-tertiary)' }}>· Hace 2 días</span></span>
 </div>
 </div>
 </div>

 <button className="tracking-action tracking-action--outline"><i className="fas fa-search-location"></i> Ver seguimiento completo</button>
 </div>

 
 <div className="tracking-card">
 <div className="tracking-card__header">
 <div>
 <span className="tracking-card__type circular"><i className="fas fa-exchange-alt"></i> Intercambio circular</span>
 <div className="tracking-card__id">#TRX-7842</div>
 </div>
 <span style={{ fontSize: '.7rem', color: 'var(--warning)', fontWeight: '500' }}>Esperando envío de Ana</span>
 </div>

 <div className="swap-split">
 <div className="swap-split__side swap-split__side--receive">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-down"></i></div>
 <span className="swap-split__header-label">Lo que recibo</span>
 <span className="swap-split__status swap-split__status--warn">Esperando envío del vendedor</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-mobile-alt"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">iPhone 15 Pro</div>
 <div className="swap-split__item-from">de Ana</div>
 </div>
 </div>
 <div className="swap-split__carrier">
 <i className="fas fa-clock" style={{ color: 'var(--warning)' }}></i>
 <span>Ana aún no lo ha enviado</span>
 </div>
 </div>

 <div className="swap-split__side swap-split__side--send">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-up"></i></div>
 <span className="swap-split__header-label">Lo que envío</span>
 <span className="swap-split__status swap-split__status--info">En tránsito</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-guitar"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">Fender Stratocaster</div>
 <div className="swap-split__item-from">580€ + 310€</div>
 </div>
 </div>
 <div className="swap-split__carrier">
 <i className="fas fa-truck"></i>
 <a href="https://www.correosexpress.com/tracking?num=654321" target="_blank" rel="noopener">Correos Express <i className="fas fa-external-link-alt"></i></a>
 · Pendiente de recepción por Ana
 </div>
 </div>
 </div>

 <button className="tracking-action tracking-action--accent"><i className="fas fa-bell"></i> Recordar a Ana que envíe</button>
 </div>

 </div>

 
 <div className="tracking-section" id="history-section">

 <div className="tracking-card">
 <div className="tracking-card__header">
 <div>
 <span className="tracking-card__type direct"><i className="fas fa-credit-card"></i> Compra directa</span>
 <div className="tracking-card__id">#ORD-5400</div>
 </div>
 <span style={{ fontSize: '.7rem', color: 'var(--success)', fontWeight: '600' }}>Completado</span>
 </div>
 <div className="tracking-card__title">Canon EOS R</div>
 <div className="tracking-card__meta">1.200€ · Entregado: 12 Abr 2026</div>

 <div className="timeline">
 <div className="timeline-step completed">
 <div className="timeline-step__dot"><i className="fas fa-check"></i></div>
 <div className="timeline-step__label">Esperando envío del vendedor</div>
 </div>
 <div className="timeline-step completed">
 <div className="timeline-step__dot"><i className="fas fa-check"></i></div>
 <div className="timeline-step__label">En tránsito</div>
 </div>
 <div className="timeline-step completed">
 <div className="timeline-step__dot"><i className="fas fa-check"></i></div>
 <div className="timeline-step__label">Acción requerida: entregar paquete</div>
 </div>
 <div className="timeline-step completed">
 <div className="timeline-step__dot"><i className="fas fa-check"></i></div>
 <div className="timeline-step__label">¡Entregado!</div>
 </div>
 </div>
 </div>

 <div className="tracking-card">
 <div className="tracking-card__header">
 <div>
 <span className="tracking-card__type circular"><i className="fas fa-exchange-alt"></i> Intercambio circular</span>
 <div className="tracking-card__id">#TRX-7839</div>
 </div>
 <span style={{ fontSize: '.7rem', color: 'var(--success)', fontWeight: '600' }}>Completado</span>
 </div>

 <div className="swap-split">
 <div className="swap-split__side swap-split__side--receive">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-down"></i></div>
 <span className="swap-split__header-label">Recibiste</span>
 <span className="swap-split__status swap-split__status--success">¡Entregado!</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-headphones"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">AirPods Max</div>
 <div className="swap-split__item-from">380€</div>
 </div>
 </div>
 </div>
 <div className="swap-split__side swap-split__side--send">
 <div className="swap-split__header">
 <div className="swap-split__header-icon"><i className="fas fa-arrow-up"></i></div>
 <span className="swap-split__header-label">Enviaste</span>
 <span className="swap-split__status swap-split__status--success">¡Entregado!</span>
 </div>
 <div className="swap-split__item">
 <div className="swap-split__item-icon"><i className="fas fa-bicycle"></i></div>
 <div className="swap-split__item-details">
 <div className="swap-split__item-name">Trek Marlin 7</div>
 <div className="swap-split__item-from">420€ (40€ vuelta)</div>
 </div>
 </div>
 </div>
 </div>

 <div className="tracking-card__meta">Completado: 3 Abr 2026</div>
 <div className="participants">
 <div className="participant-row"><i className="fas fa-star"></i> Ana <span style={{ color: 'var(--warning)' }}>★★★★★</span></div>
 <div className="participant-row"><i className="fas fa-star"></i> Bruno <span style={{ color: 'var(--warning)' }}>★★★★☆</span></div>
 </div>
 </div>

 </div>

 
 <nav className="bottom-nav">
 <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
 <Link to="/treqes" className="nav-item active"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
 <Link to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
 <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
 <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
 </nav>
    </>
  );
}

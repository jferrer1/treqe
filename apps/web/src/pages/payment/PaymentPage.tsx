import { Link } from "react-router-dom";

export function PaymentPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Pago</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>

 <Link className="back-link" to="/treqes"><i className="fas fa-chevron-left"></i> Volver a mis treqes</Link>

 <div className="container">
 <div className="form-section">
 <h2 style={{ marginTop: '0' }}><span className="step-num">1</span> Recibirás de</h2>
 <div className="address-card">
 <div className="address-card__label"><i className="fas fa-location-dot" style={{ marginRight: '4px' }}></i> Recibirás de Ana</div>
 <div className="address-card__name">Ana García López</div>
 <div className="address-card__dir">Avda. Diagonal 345, 3º 2ª<br />08037 Barcelona</div>
 <a className="address-card__edit"><i className="fas fa-pen"></i> Cambiar dirección</a>
 </div>

 <h2 style={{ marginTop: '24px' }}><span className="step-num">2</span> Método de pago</h2>
 <div className="payment-tabs">
 <div className="payment-tab active">
 <i className="fas fa-credit-card"></i>
 <span>Tarjeta</span>
 </div>
 <div className="payment-tab">
 <i className="fab fa-paypal"></i>
 <span>PayPal</span>
 </div>
 <div className="payment-tab">
 <i className="fas fa-mobile-alt"></i>
 <span>Bizum</span>
 </div>
 </div>

 <div id="cardForm">
 <div className="form-group">
 <label>Número de tarjeta</label>
 <div className="card-input">
 <i className="far fa-credit-card card-icon"></i>
 <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} />
 <div className="card-icons">
 <i className="fab fa-cc-visa"></i>
 <i className="fab fa-cc-mastercard"></i>
 </div>
 </div>
 </div>
 <div className="form-row">
 <div className="form-group">
 <label>Caducidad</label>
 <input type="text" placeholder="MM/AA" maxLength={5} />
 </div>
 <div className="form-group">
 <label>CVC</label>
 <input type="text" placeholder="123" maxLength={4} />
 </div>
 </div>
 <div className="form-group">
 <label>Titular de la tarjeta</label>
 <input type="text" placeholder="Como aparece en la tarjeta" />
 </div>
 </div>

 <div id="paypalForm" style={{ display: 'none' }}>
 <div style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px', textAlign: 'center' }}>
 <i className="fab fa-paypal" style={{ fontSize: '3rem', color: '#003087', marginBottom: '12px', display: 'block' }}></i>
 <p style={{ fontSize: '.9rem', color: 'var(--text-sub)', marginBottom: '16px' }}>Serás redirigido a PayPal para completar el pago de forma segura.</p>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '.82rem', color: 'var(--text-sub)' }}>
 <i className="fas fa-envelope" style={{ color: '#003087' }}></i>
 <span>usuario@email.com</span>
 </div>
 </div>
 </div>
 <div id="bizumForm" style={{ display: 'none' }}>
 <div style={{ padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '2px', textAlign: 'center' }}>
 <i className="fas fa-mobile-alt" style={{ fontSize: '3rem', color: '#5C6BC0', marginBottom: '12px', display: 'block' }}></i>
 <p style={{ fontSize: '.9rem', color: 'var(--text-sub)', marginBottom: '16px' }}>Recibirás una solicitud de pago en tu app de Bizum.</p>
 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '240px', margin: '0 auto' }}>
 <input type="tel" placeholder="Tu número de teléfono" style={{ flex: '1', padding: '14px', border: '1px solid var(--border)', borderRadius: '2px', fontSize: '.9rem', textAlign: 'center', outline: 'none', fontFamily: 'inherit', background: 'var(--surface)', color: 'var(--text)' }} />
 </div>
 </div>
 </div>

 <div className="submit-wrap">
 <button className="btn-pagar">
 <i className="fas fa-lock"></i> Pagar 276,95€
 </button>
 <div className="secure-note">
 <i className="fas fa-shield-alt"></i> Pago procesado por Stripe. Tus datos están seguros.
 </div>
 </div>
 </div>

 <div className="summary-section">
 <div className="summary-card">
 <h3>Resumen del intercambio</h3>
 <div className="summary-item">
 <div className="summary-item__img" style={{ background: '#1A2A3A' }}><span style={{ fontSize: '1.3rem' }}>📷</span></div>
 <div className="summary-item__info">
 <div className="summary-item__name">Canon EOS R</div>
 <div className="summary-item__meta">de Ana · Como nueva</div>
 </div>
 <div className="summary-item__price">650€</div>
 </div>
 <div className="summary-item">
 <div className="summary-item__img" style={{ background: '#2A1A2A' }}><span style={{ fontSize: '1.3rem' }}>🎧</span></div>
 <div className="summary-item__info">
 <div className="summary-item__name">AirPods Max</div>
 <div className="summary-item__meta">tú das · Azul cielo</div>
 </div>
 <div className="summary-item__price">380€</div>
 </div>
 <div style={{ marginTop: '12px' }}>
 <div className="summary-row"><span>Diferencia</span><span>270€</span></div>
 <div className="summary-row"><span>Envío</span><span>6,95€</span></div>
 <div className="summary-row"><span>Comisión treqe (5%)</span><span>13,50€</span></div>
 <div className="summary-row total"><span>Total</span><span>276,95€</span></div>
 </div>
 <div style={{ marginTop: '16px', padding: '12px', background: 'transparent', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '.78rem', color: 'var(--text-sub)', border: '1px solid var(--border)' }}>
 <i className="fas fa-shield-alt" style={{ color: 'var(--accent)', fontSize: '1.2rem' }}></i>
 El importe se retiene mediante escrow. Se libera cuando todos reciben sus artículos.
 </div>
 </div>
 </div>
 </div>

 
 <div className="toast-overlay" id="toastOverlay"></div>
 <div className="toast" id="toast" style={{ display: 'none' }}>
 <div className="toast__icon success"><i className="fas fa-check"></i></div>
 <div className="toast__title">¡Pago realizado!</div>
 <div className="toast__text">Los 276,95€ se han retenido mediante escrow. Cuando todos los participantes reciban sus artículos, el importe se liberará automáticamente.</div>
 <button className="toast__btn">Volver a mis treqes</button>
 </div>

 
 <nav className="bottom-nav">
 <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
 <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
 <Link to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
 <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
 <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
 </nav>
    </>
  );
}

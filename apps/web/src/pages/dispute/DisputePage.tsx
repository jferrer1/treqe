import { Link } from "react-router-dom";


export function DisputePage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Disputa</span>
    </div>
    <div className="treqe-header__right">
    </div>
  </div>

  <div className="container">
    <div className="order-info">
      <div className="order-info__icon" style={{ background: '#2D2D2D' }}><span style={{ fontSize: '1.2rem' }}>🎸</span></div>
      <div className="order-info__text">
        <div className="order-info__id">#TRX-7840 · Intercambio circular</div>
        <div className="order-info__name">Fender Stratocaster</div>
        <div className="order-info__price">580€ · Enviado por Ana</div>
      </div>
    </div>

    <div className="info-box">
      <i className="fas fa-shield-alt"></i>
      Si el artículo no llega, llega roto o no es lo que pediste, te ayudamos. Revisaremos tu caso en menos de 48h.
    </div>

    <div className="card">
      <h2><i className="fas fa-exclamation-triangle" style={{ color: 'var(--warning)' }}></i> ¿Qué ha ocurrido?</h2>
      <div className="form-group">
        <div className="radio-group">
          <label className="radio-option" ><input type="radio" name="reason" value="not-arrived" /> El artículo no ha llegado</label>
          <label className="radio-option" ><input type="radio" name="reason" value="damaged" /> Ha llegado roto o dañado</label>
          <label className="radio-option" ><input type="radio" name="reason" value="wrong" /> No corresponde a la descripción</label>
          <label className="radio-option" ><input type="radio" name="reason" value="other" /> Otro motivo</label>
        </div>
      </div>
    </div>

    <div className="card">
      <h2><i className="fas fa-pen" style={{ color: '#5C6BC0' }}></i> Explica con detalle</h2>
      <div className="form-group">
        <textarea placeholder="Describe qué ha pasado, desde cuándo esperas el artículo, qué esperabas recibir..."></textarea>
      </div>
    </div>

    <div className="card">
      <h2><i className="fas fa-camera" style={{ color: 'var(--accent)' }}></i> Añade fotos y vídeos</h2>
      <div className="form-group">
        <div className="photo-upload">
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
          <div className="photo-slot" ><i className="fas fa-plus"></i></div>
        </div>
        <p style={{ fontSize: '.72rem', color: 'var(--text-sub)', marginTop: '8px' }}>Máximo 8 fotos. Sube fotos del artículo dañado o del embalaje.</p>
        <div style={{ marginTop: '16px' }}>
          <label style={{ fontSize: '.75rem', fontWeight: '500', color: 'var(--text)', marginBottom: '8px', display: 'block' }}>Vídeos (opcional)</label>
          <div className="photo-upload">
            <div className="photo-slot" ><i className="fas fa-video"></i></div>
            <div className="photo-slot" ><i className="fas fa-video"></i></div>
            <div className="photo-slot" ><i className="fas fa-video"></i></div>
            <div className="photo-slot" ><i className="fas fa-video"></i></div>
          </div>
          <p style={{ fontSize: '.72rem', color: 'var(--text-sub)', marginTop: '8px' }}>Máximo 4 vídeos.</p>
        </div>
      </div>
    </div>

    <button className="btn btn--primary" ><i className="fas fa-paper-plane"></i> Enviar disputa</button>
    <button className="btn btn--secondary" >Cancelar</button>
  </div>

  <div className="toast-overlay" id="toastOverlay"></div>
  <div className="toast" id="toast" style={{ display: 'none' }}>
    <div className="toast__icon"><i className="fas fa-check"></i></div>
    <div className="toast__title">Disputa abierta</div>
    <div className="toast__text">Hemos recibido tu reclamación. Revisaremos el caso y te daremos una respuesta en menos de 48 horas. Puedes ver el estado desde Mis treqes.</div>
    <button className="toast__btn" >Volver a Mis treqes</button>
  </div>

  
  <nav className="bottom-nav">
    <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
    <Link  to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
    <Link  to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
    <Link  to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
    <Link  to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
  </nav>
    </>
  );
}

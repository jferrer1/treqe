import { Link } from "react-router-dom";


export function MatchesPage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Treqes</span>
    </div>
    <div className="treqe-header__right">
      
    </div>
  </div>


  <div className="tabs">
    <button className="tab active" >
      Activos <span className="count">1</span>
    </button>
    <button className="tab" >
      Pendientes <span className="count">2</span>
    </button>
    <button className="tab" >
      En curso <span className="count">2</span>
    </button>
    <button className="tab" >
      Completados <span className="count">2</span>
    </button>
  </div>

  
  <div className="match-section" id="active-section">
    <div className="match-card" id="buy-580" style={{ border-left: '3px solid #1C1915' }}>
      <div className="match-card__header">
        <span className="match-card__id">#ORD-580</span>
        <span className="match-card__status pending-status"><i className="fas fa-shopping-cart"></i> Solicitud de compra</span>
      </div>
      <div className="item-compare">
        <div className="item-compare__item" style={{ gridColumn: '1/-1', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', background: '#2D2D2D', border: '1px solid #E5E0D8', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🎸</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '.85rem', fontWeight: '500' }}>Fender Stratocaster</div>
              <div style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.5rem', color: '#A09A94', marginTop: '2px' }}>de Ana · Barcelona · 580€</div>
            </div>
          </div>
        </div>
      </div>
      <div className="progress-bar-wrap">
        <span style={{ fontWeight: '600' }}><i className="fas fa-clock"></i> Esperando respuesta del vendedor</span>
      </div>
      <div className="action-buttons">
        <button className="action-btn action-btn--secondary" style={{ flex: '1' }} >Cancelar</button>
      </div>
    </div>

    <div className="match-card" id="match-7842">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7842</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="match-card__status active-status">⭐ Match encontrado</span>
          <span className="match-card__timer timer--urgent" id="timer-7842">
            ⏱ <span id="time-7842">23:45:12</span>
          </span>
        </div>
      </div>
      <div className="item-compare">
        <div className="item-compare__item">
          <div className="item-compare__emoji">📱</div>
          <div className="item-compare__name">iPhone 15 Pro</div>
          <div className="item-compare__from">de Ana</div>
          <div className="item-compare__price">890€</div>
        </div>
        <div className="item-compare__arrow">
          <i className="fas fa-arrow-right"></i><br />
          <span style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.45rem' }}>recibes</span>
        </div>
        <div className="item-compare__item">
          <div className="item-compare__emoji">🎸</div>
          <div className="item-compare__name">Fender Stratocaster</div>
          <div className="item-compare__from">das tú</div>
          <div className="item-compare__price">580€ + 310€</div>
        </div>
      </div>
      <div className="match-card__circle">
        <div className="circle-title">Círculo</div>
        <div className="circle-row">
          <div className="circle-avatar you">Tú</div>
          <div className="circle-info">
            <div className="circle-name">Tú</div>
            <div className="circle-item">🎸 F. Stratocaster → Bruno</div>
          </div>
          <span className="circle-badge pending">⏳ Decidir</span>
        </div>
        <div className="circle-row">
          <div className="circle-avatar">A</div>
          <div className="circle-info">
            <div className="circle-name">Ana</div>
            <div className="circle-item">📱 iPhone 15 Pro → Tú</div>
          </div>
          <span className="circle-badge accepted">✅ Aceptado</span>
        </div>
        <div className="circle-row">
          <div className="circle-avatar">B</div>
          <div className="circle-info">
            <div className="circle-name">Bruno</div>
            <div className="circle-item">🎮 PS5 → Ana</div>
          </div>
          <span className="circle-badge accepted">✅ Aceptado</span>
        </div>
      </div>
      <div className="action-buttons">
        <button className="action-btn action-btn--primary" >✅ Aceptar</button>
        <button className="action-btn action-btn--secondary" >❌ Rechazar</button>
      </div>
    </div>
  </div>

  
  <div className="match-section" id="pending-section" style={{ display: 'none' }}>
    <div className="match-card" id="buy-581" style={{ border-left: '3px solid #6B6560' }}>
      <div className="match-card__header">
        <span className="match-card__id">#ORD-581</span>
        <span className="match-card__status pending-status"><i className="fas fa-clock"></i> Pendiente de pago</span>
        <span className="match-card__timer">⏱ 23:45:12</span>
      </div>
      <div className="item-compare">
        <div className="item-compare__item" style={{ gridColumn: '1/-1', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', background: '#3A2A1A', border: '1px solid #E5E0D8', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>⌚</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '.85rem', fontWeight: '500' }}>G-SHOCK Mudmaster</div>
              <div style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.5rem', color: '#A09A94', marginTop: '2px' }}>de Marcos · Madrid · 250€</div>
            </div>
          </div>
        </div>
      </div>
      <div className="progress-bar-wrap">
        <span style={{ fontWeight: '600' }}><i className="fas fa-check"></i> Vendedor aceptó</span>
      </div>
      <button className="action-btn action-btn--primary action-btn--full" >💳 Pagar 250€</button>
    </div>

    <div className="match-card" id="match-7843">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7843</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="match-card__status pending-status">⏳ Esperando confirmación</span>
          <span className="match-card__timer" id="timer-7843">
            ⏱ <span id="time-7843">18:32:05</span>
          </span>
        </div>
      </div>
      <div className="item-compare">
        <div className="item-compare__item">
          <div className="item-compare__emoji">📷</div>
          <div className="item-compare__name">Canon EOS R</div>
          <div className="item-compare__from">de Carlos</div>
          <div className="item-compare__price">650€</div>
        </div>
        <div className="item-compare__arrow">
          <i className="fas fa-arrow-right"></i><br />
          <span style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.45rem' }}>recibes</span>
        </div>
        <div className="item-compare__item">
          <div className="item-compare__emoji">🎧</div>
          <div className="item-compare__name">AirPods Max</div>
          <div className="item-compare__from">para Ana</div>
          <div className="item-compare__price">380€ + 270€</div>
        </div>
      </div>
      <div className="match-card__circle">
        <div className="circle-title">Círculo</div>
        <div className="circle-row">
          <div className="circle-avatar you">Tú</div>
          <div className="circle-info">
            <div className="circle-name">Tú</div>
            <div className="circle-item">🎧 AirPods Max → Ana</div>
          </div>
          <span className="circle-badge accepted">✅ Aceptaste</span>
        </div>
        <div className="circle-row">
          <div className="circle-avatar">A</div>
          <div className="circle-info">
            <div className="circle-name">Ana</div>
            <div className="circle-item">🚲 Trek Marlin → Carlos</div>
          </div>
          <span className="circle-badge accepted">✅ Aceptado</span>
        </div>
        <div className="circle-row">
          <div className="circle-avatar">C</div>
          <div className="circle-info">
            <div className="circle-name">Carlos</div>
            <div className="circle-item">📷 Canon EOS R → Tú</div>
          </div>
          <span className="circle-badge pending">⏳ Pendiente</span>
        </div>
      </div>
      <div className="progress-bar-wrap">
        <span>Progreso</span>
        <div className="progress-bar">
          <div className="progress-bar__fill" style={{ width: '66.66%' }}></div>
        </div>
        <span>2/3</span>
      </div>
      <div className="action-buttons">
        <button className="action-btn action-btn--secondary" >⏸ Cancelar</button>
        <button className="action-btn action-btn--primary" >🔔 Recordar</button>
      </div>
    </div>

    <div className="match-card" id="match-7841">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7841</span>
        <span className="match-card__status broken-status">❌ Match roto</span>
      </div>
      <div className="broken-reason">
        <i className="fas fa-info-circle"></i>
        <span>Bruno rechazó el intercambio. Tu artículo vuelve a estar disponible.</span>
      </div>
      <div className="item-compare" style={{ gridTemplateColumns: '1fr' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.5rem', color: '#A09A94', marginBottom: '2px' }}>Ibas a recibir</div>
            <div style={{ fontSize: '.8rem', fontWeight: '500' }}>⌚ G-SHOCK Mudmaster <span style={{ fontWeight: '400', color: 'var(--text-sub)' }}>(250€)</span></div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.5rem', color: '#A09A94', marginBottom: '2px' }}>Ibas a dar</div>
            <div style={{ fontSize: '.8rem', fontWeight: '500' }}>🏍️ Casco Shoei NXR2 <span style={{ fontWeight: '400', color: '#6B6560' }}>(320€ → 70€)</span></div>
          </div>
        </div>
      </div>
      <button className="action-btn action-btn--ghost action-btn--full" >
        🔍 Buscar nuevo match
      </button>
    </div>
  </div>

  
  <div className="match-section" id="in-progress-section" style={{ display: 'none' }}>
    <div className="match-card" id="buy-582" style={{ border-left: '3px solid #1C1915' }}>
      <div className="match-card__header">
        <span className="match-card__id">#ORD-582</span>
        <span className="match-card__status pending-status"><i className="fas fa-truck"></i> En camino</span>
      </div>
      <div className="item-compare">
        <div className="item-compare__item" style={{ gridColumn: '1/-1', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '50px', height: '50px', background: '#2D2D2D', border: '1px solid #E5E0D8', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>📱</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontSize: '.85rem', fontWeight: '500' }}>iPhone 15 Pro</div>
              <div style={{ fontFamily: ''IBM Plex Mono',monospace', fontSize: '.5rem', color: '#A09A94', marginTop: '2px' }}>de Ana · 890€ · Pagado el 10 may</div>
            </div>
          </div>
        </div>
      </div>
      <div className="tracking-item" style={{ border: 'none', padding: '0' }}>
        <div className="tracking-item__icon"><i className="fas fa-truck"></i></div>
        <div className="tracking-item__info">
          <div className="tracking-item__label">Correos Express · ES1234567890</div>
          <div className="tracking-item__meta">Madrid, 14:32h · Llega mañana</div>
        </div>
      </div>
      <button className="action-btn action-btn--ghost action-btn--full" >📍 Ver seguimiento</button>
      <button className="action-btn action-btn--ghost action-btn--full" style={{ marginTop: '8px', borderColor: '#C5C0B8', color: '#6B6560' }} >⚠️ Abrir disputa</button>
    </div>

    <div className="match-card" id="match-7840">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7840</span>
        <span className="match-card__status in-progress">📦 Coordinar envío</span>
      </div>
      <div className="shipping-block">
        <div className="shipping-block__label">Envía TU artículo a</div>
        <div className="shipping-block__dir">Carlos · C/ Mayor 23, 28013 Madrid</div>
        <div className="shipping-block__item">🎧 AirPods Max + 270€</div>
      </div>
      <div className="shipping-block">
        <div className="shipping-block__label">Recibirás de</div>
        <div className="shipping-block__dir">Ana · Avda. Diagonal 345, 08037 Barcelona</div>
        <div className="shipping-block__item">📷 Canon EOS R</div>
      </div>
      <button className="action-btn action-btn--success action-btn--full" >
        ✔️ Ya lo he enviado
      </button>
      <div style={{ marginTop: '10px', fontFamily: ''IBM Plex Mono',monospace', fontSize: '.45rem', textAlign: 'center' }}>
        <Link  to="/legal/pagos" style={{ color: '#A09A94', textDecoration: 'none' }}>¿Cómo funciona el pago?</Link>
        ·
        <Link  to="/legal/envios" style={{ color: '#A09A94', textDecoration: 'none' }}>Costes de envío</Link>
      </div>
    </div>

    <div className="match-card" id="match-7838">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7838</span>
        <span className="match-card__status in-progress">🚚 En camino</span>
      </div>
      <div className="tracking-item">
        <div className="tracking-item__icon"><i className="fas fa-check"></i></div>
        <div className="tracking-item__info">
          <div className="tracking-item__label">Tu envío a Bruno</div>
          <div className="tracking-item__meta">📦 Recibido (hace 2 días)</div>
        </div>
      </div>
      <div className="tracking-item">
        <div className="tracking-item__icon"><i className="fas fa-truck"></i></div>
        <div className="tracking-item__info">
          <div className="tracking-item__label">Tu recepción de Ana</div>
          <div className="tracking-item__meta">🚚 En camino → llega mañana</div>
          <div className="tracking-item__meta">📍 Última actualización: Madrid, 14:32h</div>
        </div>
      </div>
      <button className="action-btn action-btn--primary action-btn--full" >
        📍 Ver seguimiento completo
      </button>
      <button className="action-btn action-btn--ghost action-btn--full" style={{ marginTop: '8px', borderColor: '#C5C0B8', color: '#6B6560' }} >⚠️ Abrir disputa</button>
    </div>
  </div>

  
  <div className="match-section" id="completed-section" style={{ display: 'none' }}>
    <div className="match-card" id="buy-583" style={{ border-left: '3px solid #C5C0B8' }}>
      <div className="match-card__header">
        <span className="match-card__id">#ORD-583</span>
        <span className="match-card__status done-status"><i className="fas fa-check-double"></i> Recibido · Hace 2 días</span>
      </div>
      <div className="completed-summary">
        <div className="completed-row"><strong>Recibiste:</strong> 🎧 AirPods Max (380€)</div>
        <div className="completed-row"><strong>Vendedor:</strong> Bruno · ⭐⭐⭐⭐</div>
      </div>
      <button className="action-btn action-btn--primary action-btn--full" >⭐ Valorar compra</button>
    </div>

    <div className="match-card" id="match-7839">
      <div className="match-card__header">
        <span className="match-card__id">#TRX-7839</span>
        <span className="match-card__status done-status">✅ Completado · Hace 3 días</span>
      </div>
      <div className="completed-summary">
        <div className="completed-row"><strong>Recibiste:</strong> 🎧 AirPods Max (380€)</div>
        <div className="completed-row"><strong>Diste:</strong> 🚲 Trek Marlin 7 (420€ → recibiste <strong>40€</strong>)</div>
      </div>
      <div className="rating-stars">
        <span>Participantes:</span>
        <span>Ana ⭐⭐⭐⭐⭐</span>
        <span>Bruno ⭐⭐⭐⭐</span>
      </div>
      <button className="action-btn action-btn--primary action-btn--full" >
        ⭐ Valorar intercambio
      </button>
    </div>
  </div>

  
  <div className="feedback-overlay" id="feedbackOverlay"></div>
  <div className="feedback-toast" id="feedbackToast">
    <div className="feedback-toast__icon" id="feedbackIcon">✅</div>
    <div className="feedback-toast__title" id="feedbackTitle">¡Hecho!</div>
    <div className="feedback-toast__text" id="feedbackText">Acción completada correctamente.</div>
    <button className="feedback-toast__btn" >Cerrar</button>
  </div>

  
  <div className="rate-overlay" id="rateOverlay" >
    <div className="rate-card">
      <div className="rate-card__hd">
        <span className="rate-card__title"><i className="fas fa-star" style={{ marginRight: '8px' }}></i>Valorar intercambio</span>
        <button className="rate-card__cls" ><i className="fas fa-times"></i></button>
      </div>
      <div className="rate-card__body">
        <div className="rate-card__score" id="rateScore">Selecciona estrellas</div>
        <div className="rate-card__stars">
          <i className="fas fa-star rate-star" ></i>
          <i className="fas fa-star rate-star" ></i>
          <i className="fas fa-star rate-star" ></i>
          <i className="fas fa-star rate-star" ></i>
          <i className="fas fa-star rate-star" ></i>
        </div>
        <textarea className="rate-card__ta" id="rateComment" placeholder="Añade un comentario (opcional)..."></textarea>
      </div>
      <div className="rate-card__ft">
        <button className="btn-r btn-r--secondary" >Cancelar</button>
        <button className="btn-r btn-r--primary" ><i className="fas fa-paper-plane"></i> Enviar</button>
      </div>
    </div>
  </div>
  <input type="hidden" id="rateVal" value="0" />

  
  <nav className="bottom-nav">
    <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
    <Link  to="/treqes" className="nav-item active"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
    <Link  to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
    <Link  to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
    <Link  to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
  </nav>
    </>
  );
}

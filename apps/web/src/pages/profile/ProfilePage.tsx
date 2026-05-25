import { Link } from "react-router-dom";


export function ProfilePage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atrás"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Perfil</span>
    </div>
    <div className="treqe-header__right">
      <Link  to="/ajustes" className="treqe-header__back" style={{ textDecoration: 'none', marginRight: '4px' }} title="Ajustes"><i className="fas fa-cog"></i></Link>
      <button className="dm-toggle" >Dark</button>
    </div>
  </div>

  <div className="profile-wrap">

    
    <div className="scoring-card">
      <div className="scoring-card__top">
        <span className="scoring-card__label">Scoring <i className="fas fa-info-circle"  style={{ fontSize: '.65rem', color: 'var(--text-dim)', cursor: 'pointer', marginLeft: '3px' }}></i></span>
        <span className="scoring-card__score">82 <small>/ 100</small></span>
      </div>
      <div className="scoring-card__bar">
        <div className="scoring-card__bar-fill" id="scoreFill" style={{ width: '82%' }}></div>
      </div>
      <div className="scoring-card__info">
        <button  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: ''IBM Plex Mono',monospace', fontSize: '.55rem', fontWeight: '500', color: 'var(--text-dim)', textDecoration: 'underline', text-underline-offset: '2px', padding: '0', textTransform: 'uppercase', letterSpacing: '.08em' }}>¿Cómo aumentar?</button>
        <span className="next-level">95 para nivel Avanzado</span>
      </div>
    </div>

    
    <div className="profile-actions">
      <button className="profile-action" >
        <div className="profile-action__icon"><i className="fas fa-user-edit"></i></div>
        <div className="profile-action__text">
          <div className="profile-action__title">Editar perfil</div>
          <div className="profile-action__sub">Nombre, foto, bio</div>
        </div>
        <i className="fas fa-chevron-right"></i>
      </button>

      <button className="profile-action" >
        <div className="profile-action__icon verified"><i className="fas fa-shield-alt"></i></div>
        <div className="profile-action__text">
          <div className="profile-action__title">Verificar identidad</div>
          <div className="profile-action__sub">Más confianza en intercambios</div>
        </div>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>

    
    <div className="section">
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-card__number">12</div>
          <div className="stat-card__label">intercambios</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">6</div>
          <div className="stat-card__label">artículos</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__number">1</div>
          <div className="stat-card__label">mes en treqe</div>
        </div>
      </div>
    </div>

    
    <div className="section">
      <div className="section__header">
        <span className="section__title"><i className="fas fa-heart" style={{ marginRight: '5px' }}></i>Me gustan</span>
        <button className="section__action" >Ver todo</button>
      </div>
      <div className="my-items">
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#1A3A2A,#2A5A3A)!important' }}>
            <span className="my-item__emoji">🎸</span>
            <div className="my-item__overlay">Fender Stratocaster</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">Fender Stratocaster</div>
            <div className="my-item__price">€580</div>
          </div>
        </div>
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#1A2A3A,#2A3A5A)!important' }}>
            <span className="my-item__emoji">📷</span>
            <div className="my-item__overlay">Canon EOS R</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">Canon EOS R</div>
            <div className="my-item__price">€1.200</div>
          </div>
        </div>
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#2A1A3A,#4A2A5A)!important' }}>
            <span className="my-item__emoji">🎮</span>
            <div className="my-item__overlay">PlayStation 5</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">PlayStation 5</div>
            <div className="my-item__price">€450</div>
          </div>
        </div>
      </div>
    </div>

    
    <div className="section">
      <div className="section__header">
        <span className="section__title">Mis artículos</span>
        <button className="section__action" ><i className="fas fa-plus"></i> Añadir</button>
      </div>
      <div className="my-items">
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-bicycle"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">Trek Marlin 7</div>
            <div className="my-item__price">€420</div>
          </div>
          <span className="my-item__status active">Activo</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-headphones"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">AirPods Max</div>
            <div className="my-item__price">€380</div>
          </div>
          <span className="my-item__status active">Activo</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-clock"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">G-SHOCK Mudmaster</div>
            <div className="my-item__price">€250</div>
          </div>
          <span className="my-item__status active">Activo</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-plug"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">Cargador USB-C 65W</div>
            <div className="my-item__price">€25</div>
          </div>
          <span className="my-item__status pending">Cambio</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-mobile-alt"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">iPhone 12 128GB</div>
            <div className="my-item__price">350€</div>
          </div>
          <span className="my-item__status pending">Cambio</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image"><i className="fas fa-guitar"></i></div>
          <div className="my-item__info">
            <div className="my-item__title">Bajo Ibanez GSR200</div>
            <div className="my-item__price">180€</div>
          </div>
          <span className="my-item__status active">Activo</span>
        </div>
      </div>
    </div>

    
    <div className="section">
      <div className="section__header">
        <span className="section__title"><i className="fas fa-exchange-alt" style={{ marginRight: '5px' }}></i>Solicitudes de intercambio</span>
        <button className="section__action" >Ver todas</button>
      </div>
      <div className="my-items">
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#1A2A3A,#2A3A5A)!important' }}>
            <span className="my-item__emoji">🎮</span>
            <div className="my-item__overlay">Nintendo Switch OLED</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">Nintendo Switch OLED</div>
            <div className="my-item__price">€280</div>
          </div>
          <span className="my-item__status pending">Pendiente</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#2A1A3A,#4A2A5A)!important' }}>
            <span className="my-item__emoji">📱</span>
            <div className="my-item__overlay">iPhone 15 Pro</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">iPhone 15 Pro</div>
            <div className="my-item__price">€890</div>
          </div>
          <span className="my-item__status accepted">Aceptado</span>
        </div>
        <div className="my-item" >
          <div className="my-item__image my-item__image--liked" style={{ background: 'linear-gradient(135deg,#1A3A2A,#2A5A3A)!important' }}>
            <span className="my-item__emoji">🎸</span>
            <div className="my-item__overlay">Yamaha F310</div>
          </div>
          <div className="my-item__info">
            <div className="my-item__title">Yamaha F310</div>
            <div className="my-item__price">€210</div>
          </div>
          <span className="my-item__status rejected">Rechazado</span>
        </div>
      </div>
    </div>

  </div>

  
  <nav className="bottom-nav">
    <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
    <Link  to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
    <Link  to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
    <Link  to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
    <Link  to="/perfil" className="nav-item active"><i className="fas fa-user"></i><span>Perfil</span></Link>
  </nav>

  
  <div className="scoring-modal-overlay" id="scoringModal" >
    <div className="scoring-modal">
      <div className="scoring-modal__header">
        <span className="scoring-modal__title"><i className="fas fa-chart-line" style={{ marginRight: '8px' }}></i> Cómo funciona el Scoring</span>
        <button className="scoring-modal__close" ><i className="fas fa-times"></i></button>
      </div>
      <div className="scoring-modal__body">
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-exchange-alt"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Intercambios completados</div>
            <div className="score-item__desc">Cada intercambio completado con éxito suma puntos. Cuantos más completas, más sube tu scoring.</div>
          </div>
          <div className="score-item__points">+5 c/u</div>
        </div>
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-clock"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Tiempo de respuesta</div>
            <div className="score-item__desc">Responder rápido a las consultas y propuestas de intercambio mejora tu puntuación. Menos de 1h suma el máximo.</div>
          </div>
          <div className="score-item__points">+1 a +3</div>
        </div>
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-star"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Valoraciones recibidas</div>
            <div className="score-item__desc">Las valoraciones positivas de otros usuarios aumentan tu reputación. Cada estrella cuenta.</div>
          </div>
          <div className="score-item__points">+1 a +5</div>
        </div>
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-shield-alt"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Verificación de identidad</div>
            <div className="score-item__desc">Verificar tu identidad con DNI y selfie sube tu scoring considerablemente y genera más confianza.</div>
          </div>
          <div className="score-item__points">+15</div>
        </div>
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-calendar-check"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Antigüedad en treqe</div>
            <div className="score-item__desc">Los usuarios con más tiempo en la plataforma obtienen una bonificación por permanencia.</div>
          </div>
          <div className="score-item__points">+1/mes</div>
        </div>
        <div className="score-item">
          <div className="score-item__icon"><i className="fas fa-box-open"></i></div>
          <div className="score-item__text">
            <div className="score-item__title">Artículos publicados</div>
            <div className="score-item__desc">Tener artículos activos y bien descritos contribuye positivamente a tu perfil.</div>
          </div>
          <div className="score-item__points">+2 c/u</div>
        </div>
      </div>
    </div>
  </div>
    </>
  );
}

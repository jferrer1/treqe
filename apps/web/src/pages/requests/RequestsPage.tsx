import { Link } from "react-router-dom";


export function RequestsPage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Solicitudes</span>
    </div>
    <div className="treqe-header__right">
      
    </div>
  </div>

  
  <div className="section-title">
    <h2>Solicitudes de trueque</h2>
    <span id="articleCount">8 solicitudes</span>
  </div>

  
  <div className="catalog" id="catalog">
    
    <div className="item-card" data-price="580" >
      <div className="item-card__image" style={{ background: '#2D2D2D' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-guitar placeholder-icon white"></i>
        <span className="price-tag">€580</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">Fender Stratocaster · Muy buen estado</div>
      </div>
    </div>
    <div className="item-card" data-price="890" >
      <div className="item-card__image" style={{ background: '#1A2A3A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-mobile-alt placeholder-icon white"></i>
        <span className="price-tag">€890</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">iPhone 15 Pro · 256GB · Titanio natural</div>
      </div>
    </div>
    <div className="item-card" data-price="650" >
      <div className="item-card__image" style={{ background: '#1A3A2A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-camera placeholder-icon white"></i>
        <span className="price-tag">€650</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">Canon EOS R · Objetivo 24-70mm · Como nueva</div>
      </div>
    </div>
    <div className="item-card" data-price="420" >
      <div className="item-card__image" style={{ background: '#3A2A3A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-bicycle placeholder-icon white"></i>
        <span className="price-tag">€420</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">Trek Marlin 7 · Mtb · Talla L · 2023</div>
      </div>
    </div>
    <div className="item-card" data-price="380" >
      <div className="item-card__image" style={{ background: '#1A1A2A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-headphones placeholder-icon white"></i>
        <span className="price-tag">€380</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">AirPods Max · Azul cielo · Como nuevos</div>
      </div>
    </div>
    <div className="item-card" data-price="250" >
      <div className="item-card__image" style={{ background: '#3A2A1A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-clock placeholder-icon white"></i>
        <span className="price-tag">€250</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">G-SHOCK Mudmaster · Edición limitada</div>
      </div>
    </div>
    <div className="item-card" data-price="720" >
      <div className="item-card__image" style={{ background: '#3A1A1A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-mobile-alt placeholder-icon white"></i>
        <span className="price-tag">€720</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">Samsung Galaxy S25 Ultra · 512GB · Titanium</div>
      </div>
    </div>
    <div className="item-card" data-price="550" >
      <div className="item-card__image" style={{ background: '#1A3A3A' }}>
        <span className="like-btn liked"><i className="fas fa-exchange-alt"></i></span>
        <i className="fas fa-apple-alt placeholder-icon white"></i>
        <span className="price-tag">€550</span>
      </div>
      <div className="item-card__info">
        <div className="item-card__title">Apple Watch Ultra 2 · Naranja · 49mm</div>
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
    </>
  );
}

import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <>
      <div className="header">
 <Link to="/" className="logo-link"><img className="treqe-logo" src="/treqe-logo.png" alt="treqe" /></Link>
 <div className="header-right">
 
 <Link to="#" className="blog-link"><i className="fas fa-book-open"></i>Blog</Link>
 <div className="search-icon" id="searchIcon">
 <i className="fas fa-search"></i>
 </div>
 <div className="search-expand" id="searchExpand">
 <input type="text" placeholder="Buscar articulos..." id="searchInput" />
 <button className="search-close"><i className="fas fa-times"></i></button>
 </div>
 </div>
 </div>


<section className="hero">
 <div className="hero-label">Intercambio circular</div>
 <h1><strong>Trueque circular:</strong><br />das a uno,<br />recibes de otro</h1>
 <p className="sub"><em>Sin dinero.</em> O con dinero. Como tú decidas.</p>
</section>


<section className="exchange-section">
 <div className="exchange-card">
 <div className="exchange-label">Así funciona</div>
 <div className="exchange-flow">
 <div className="exchange-item">
 <div className="exchange-icon">👶</div>
 <div className="exchange-item-label">Tú das</div>
 <div className="exchange-item-name">un carrito de bebé</div>
 </div>
 <div className="exchange-arrow">→</div>
 <div className="exchange-item">
 <div className="exchange-icon">📱</div>
 <div className="exchange-item-label">Recibes</div>
 <div className="exchange-item-name">este iPhone</div>
 </div>
 </div>
 <div className="exchange-insight">
 <strong>Trueque circular:</strong> das a uno, recibes de otro.
 </div>
 </div>
</section>


<section className="how-section">
 <div className="section-label">En 3 pasos</div>
 <div className="steps">
 <div className="step">
 <div className="step-num">01</div>
 <div className="step-content">
 <h3>Publica lo que no usas</h3>
 <p>Rápido, sin complicaciones. Dale salida a lo que ya no necesitas.</p>
 </div>
 </div>
 <div className="step">
 <div className="step-num">02</div>
 <div className="step-content">
 <h3>Elige lo que quieres</h3>
 <p>Lo que sea. Sin límites. Tú marcas el destino.</p>
 </div>
 </div>
 <div className="step">
 <div className="step-num">03</div>
 <div className="step-content">
 <h3>treqe cierra el círculo</h3>
 <p>Nosotros lo encontramos y te notificamos para hacer el intercambio.</p>
 </div>
 </div>
 </div>
</section>




<section className="guide-section">
 <div className="section-label">Cómo funciona</div>
 <h2>Dos formas de conseguir<br /><strong>lo que quieres</strong></h2>
 <p className="guide-sub">Una sola comunidad</p>
 <div className="guide-grid">
 <div className="guide-card">
 <div className="guide-card__tag">Compra directa</div>
 <h3>Como en cualquier tienda</h3>
 <p>Ves algo que te gusta, pagas y lo recibes en casa. Rápido, sencillo, sin complicaciones.</p>
 <ol>
 <li>Busca en el catálogo</li>
 <li>Haz clic en "Comprar ahora"</li>
 <li>El vendedor acepta</li>
 <li>Pagas y recibes en casa</li>
 </ol>
 </div>
 <div className="guide-card">
 <div className="guide-card__tag">Intercambio circular</div>
 <h3>Trueque entre varios</h3>
 <p>Ofreces algo a cambio y nosotros nos encargamos de que te llegue lo que quieres. No hace falta que sea directo.</p>
 <ol>
 <li>Busca en el catálogo</li>
 <li>Pulsa "Quiero esto"</li>
 <li>treqe te encuentra el match</li>
 <li>Solo envías tu artículo</li>
 </ol>
 </div>
 <div className="guide-card" style={{ gridColumn: '1/-1' }}>
 <div className="guide-card__tag">Modo híbrido</div>
 <h3>Combina ambas</h3>
 <p>Si tu artículo vale menos que el que quieres, puedes pagar la diferencia. El intercambio circular también admite dinero para ajustar valores.</p>
 </div>
 </div>
 <div className="guide-link">
 <a href="../v13-blog/posts/guia-principiantes.html">
 Guía completa <i className="fas fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
 </a>
 </div>
</section>


<section className="cta-section">
 <h2>Paga lo que quieras<br />con lo que tengas</h2>
 <p className="cta-sub">Dale una segunda vida a tus cosas</p>
 <Link to="/registro" className="cta-btn">
 Empieza ahora <i className="fas fa-arrow-right" style={{ fontSize: '0.6rem' }}></i>
 </Link>
</section>


<nav className="bottom-nav">
 <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
 <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
 <Link to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
 <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
 <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
</nav>


<div className="legal-footer">
 <div className="footer-brand">treqe</div>
 <div className="legal-footer-links">
 <Link to="/legal/aviso">Aviso Legal</Link>
 <Link to="/legal/privacidad">Privacidad</Link>
 <Link to="/legal/terminos">Términos</Link>
 <Link to="/legal/cookies">Cookies</Link>
 <Link to="/legal/pagos">Pagos</Link>
 <Link to="/legal/envios">Envíos</Link>
 </div>
 <div style={{ marginTop: '12px' }}>&copy; 2026 treqe</div>
</div>
    </>
  );
}

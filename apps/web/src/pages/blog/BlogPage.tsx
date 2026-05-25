import { Link } from "react-router-dom";


export function BlogPage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <Link  to="/" className="logo-link" style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img className="treqe-logo" src="../../assets/treqe-logo-mib.png" alt="treqe" /><span style={{ fontFamily: 'IBM Plex Sans,sans-serif', fontSize: '1.2rem', fontWeight: '400', color: '#8A8580', marginLeft: '2px', lineHeight: '36px' }}>.blog</span>
      </Link>
    </div></div>
    <div className="treqe-header__right">
      
    </div>
  </div>

  
  <main className="blog-wrapper">

    
    <div className="hero-blog">
      <div className="hero-blog__tag">Primera entrega</div>
      <h1>Por qué el intercambio es más inteligente que comprar</h1>
      <p>Intercambiamos desde antes de inventar el dinero. treqe recupera lo mejor de esa idea con un algoritmo que hace posible lo imposible.</p>
      <a  className="hero-blog__cta" href="posts/primera-entrega.html">
        Leer artículo <i className="fas fa-arrow-right"></i>
      </a>
    </div>

    
    <div className="categories">
      <button className="cat-chip active" >Todo</button>
      <button className="cat-chip" >Intercambio y economía</button>
      <button className="cat-chip" >Casos reales</button>
      <button className="cat-chip" >Tecnología</button>
      <button className="cat-chip" >Guía</button>
      <button className="cat-chip" >Sostenibilidad</button>
    </div>

    
    <div className="content-row">

      
      <div className="content-main">

        <div className="section-title">
          <h2>Artículos destacados</h2>
          <span>Más recientes</span>
        </div>

        
        <div className="featured-article" >
          <div className="featured-article__image">
            <img src="assets/primera-entrega.png" alt="treqe no es Wallapop" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} />
            <span className="featured-badge">Nuevo</span>
            
          </div>
          <div className="featured-article__body">
            <div className="featured-article__meta">
              <span>9 mayo 2026</span>
              <span className="dot"></span>
              <span>5 min lectura</span>
            </div>
            <div className="featured-article__title">treqe no es Wallapop: el intercambio estructurado llegó para quedarse</div>
            <div className="featured-article__excerpt">Comprar y vender es el modelo más obvio, pero no el más eficiente. Detrás de cada objeto que acumulas en tu casa hay una oportunidad de intercambio que estás desperdiciando.</div>
            <div className="featured-article__read">Seguir leyendo <i className="fas fa-arrow-right"></i></div>
          </div>
        </div>

        <div className="section-title">
          <h2>Más artículos</h2>
          <span>Página 1 de 3</span>
        </div>

        
        <div className="article-grid">

          <div className="article-card" data-cat="tecnologia" >
            <div className="article-card__thumb"><img src="assets/algoritmo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>7 may 2026</span>
                <span className="tag">Tecnología</span>
              </div>
              <div className="article-card__title">El algoritmo que hace posible el intercambio circular</div>
              <div className="article-card__excerpt">Cómo resuelve treqe el problema matemático del intercambio múltiple sin volverse loco en el intento.</div>
            </div>
          </div>

          <div className="article-card" data-cat="historias" >
            <div className="article-card__thumb"><img src="assets/historia-ipad.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>5 may 2026</span>
                <span className="tag">Historias</span>
              </div>
              <div className="article-card__title">Intercambié un iPad por 3 meses de clases de guitarra y una cena</div>
              <div className="article-card__excerpt">La historia de cómo Laura consiguió lo que necesitaba sin gastar un euro.</div>
            </div>
          </div>

          <div className="article-card" data-cat="guia" >
            <div className="article-card__thumb"><img src="assets/guia.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>3 may 2026</span>
                <span className="tag">Guía</span>
              </div>
              <div className="article-card__title">Guía para principiantes: cómo funciona el intercambio en treqe</div>
              <div className="article-card__excerpt">Todo lo que necesitas saber para hacer tu primer intercambio.</div>
            </div>
          </div>

          <div className="article-card" data-cat="economia" >
            <div className="article-card__thumb dark"><img src="assets/anti-consumismo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>1 may 2026</span>
                <span className="tag">Reflexión</span>
              </div>
              <div className="article-card__title">Anti-consumismo inteligente: no es comprar menos, es intercambiar mejor</div>
              <div className="article-card__excerpt">El consumo consciente no va de privarse. Va de optimizar.</div>
            </div>
          </div>

          <div className="article-card" data-cat="guia" >
            <div className="article-card__thumb"><img src="assets/reputacion.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>28 abr 2026</span>
                <span className="tag">Producto</span>
              </div>
              <div className="article-card__title">Cómo funciona el sistema de reputación</div>
              <div className="article-card__excerpt">La confianza es la moneda más valiosa en una comunidad de intercambio.</div>
            </div>
          </div>

          <div className="article-card" data-cat="sostenibilidad" >
            <div className="article-card__thumb"><img src="assets/economia-circular.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', position: 'absolute', top: '0', left: '0' }} /></div>
            <div className="article-card__content">
              <div className="article-card__meta">
                <span>25 abr 2026</span>
                <span className="tag">Sostenibilidad</span>
              </div>
              <div className="article-card__title">treqe y la economía circular: cómo tus objetos pueden tener mil vidas</div>
              <div className="article-card__excerpt">Cada vez que intercambias algo, alargas su ciclo de vida.</div>
            </div>
          </div>

        </div>

        
        <div className="load-more">
          <button >Cargar más artículos</button>
        </div>
      </div>

      
      <aside className="content-sidebar">
        <div className="sidebar-sticky">

          
          <div className="sidebar-card sidebar-newsletter">
            <h3>Newsletter</h3>
            <p>Recibe los nuevos artículos una vez a la semana. Zero spam.</p>
            <input type="email" placeholder="tu@email.com" />
            <button >Suscribirse</button>
          </div>

          
          <div className="sidebar-card">
            <h3>Categorías</h3>
            <ul>
              <li ><i className="fas fa-tag"></i> Intercambio y economía <span className="badge">12</span></li>
              <li ><i className="fas fa-tag"></i> Casos reales <span className="badge">8</span></li>
              <li ><i className="fas fa-tag"></i> Tecnología <span className="badge">6</span></li>
              <li ><i className="fas fa-tag"></i> Guía <span className="badge">5</span></li>
              <li ><i className="fas fa-tag"></i> Sostenibilidad <span className="badge">4</span></li>
            </ul>
          </div>

          
          <div className="sidebar-card">
            <h3>Más leídos</h3>
            <ul>
              <li ><i className="fas fa-arrow-right"></i> treqe no es Wallapop</li>
              <li ><i className="fas fa-arrow-right"></i> Cómo treqe encuentra tu intercambio</li>
              <li ><i className="fas fa-arrow-right"></i> Guía para principiantes</li>
              <li ><i className="fas fa-arrow-right"></i> Sistema de reputación</li>
            </ul>
          </div>

        </div>
      </aside>

    </div>
  </main>

  
  <footer className="site-footer">
    <div className="footer-inner">
      <span>&copy; 2026 treqe. Intercambia, no compres.</span>
      <div className="social-links">
        <a  href="#" ><i className="fab fa-twitter"></i></a>
        <a  href="#" ><i className="fab fa-instagram"></i></a>
        <a  href="#" ><i className="fab fa-linkedin-in"></i></a>
        <a  href="#" ><i className="fab fa-tiktok"></i></a>
      </div>
    </div>
  </footer>

  
  

  
  <div style={{ padding: '24px 16px 80px', textAlign: 'center', fontFamily: ''IBM Plex Mono',monospace', fontSize: '.45rem', color: '#A09A94', lineHeight: '2' }}>
    <div style={{ marginBottom: '4px' }}><span style={{ fontWeight: '600', color: '#1C1915' }}>treqe</span><span style={{ color: '#6B6560' }}>.blog</span></div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flex-wrap: 'wrap' }}>
      <Link  to="/legal/aviso" style={{ color: '#A09A94', textDecoration: 'none' }}>Aviso Legal</Link>
      <Link  to="/legal/privacidad" style={{ color: '#A09A94', textDecoration: 'none' }}>Privacidad</Link>
      <Link  to="/legal/terminos" style={{ color: '#A09A94', textDecoration: 'none' }}>Términos</Link>
      <Link  to="/legal/cookies" style={{ color: '#A09A94', textDecoration: 'none' }}>Cookies</Link>
    </div>
    <div style={{ marginTop: '6px', color: '#6B6560' }}>© 2026 treqe. Todos los derechos reservados.</div>
  </div>
    </>
  );
}

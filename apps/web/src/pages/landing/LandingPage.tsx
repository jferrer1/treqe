import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export function LandingPage() {
  return (
    <>
      <Helmet>
        <title>Treqe — Intercambia lo que no usas por lo que necesitas</title>
        <meta name="description" content="Intercambio circular. Consigue lo que quieres con lo que tienes." />
        <meta property="og:title" content="Treqe — Intercambio circular" />
        <meta property="og:description" content="Consigue lo que quieres con lo que tienes. Treqe cierra el círculo de intercambio." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://treqe.es" />
      </Helmet>

      {/* ═══ HEADER ═══ */}
      <div className="header">
        <Link to="/" className="logo-link">
          <span className="logo">treqe</span>
        </Link>
        <div className="header-right">
          <Link to="/blog" className="blog-link">
            <i className="fas fa-book-open" /> Blog
          </Link>
        </div>
      </div>

      {/* ═══ HERO ═══ */}
      <section className="hero">
        <div className="hero-label">Intercambio circular</div>
        <h1>
          <strong>Trueque circular:</strong>
          <br />
          das a uno,
          <br />
          recibes de otro
        </h1>
        <p className="sub">
          <em>Sin dinero.</em> O con dinero. Como tú decidas.
        </p>
      </section>

      {/* ═══ EXCHANGE CARD ═══ */}
      <section className="exchange-section">
        <div className="exchange-card">
          <div className="exchange-label">Así funciona</div>
          <div className="exchange-flow">
            <div className="exchange-item">
              <div className="exchange-icon">📦</div>
              <div className="exchange-item-label">Tú das</div>
              <div className="exchange-item-name">un artículo que no usas</div>
            </div>
            <div className="exchange-arrow" />
            <div className="exchange-item">
              <div className="exchange-icon">🔄</div>
              <div className="exchange-item-label">El círculo</div>
              <div className="exchange-item-name">conecta a 3 personas</div>
            </div>
            <div className="exchange-arrow" />
            <div className="exchange-item">
              <div className="exchange-icon">📦</div>
              <div className="exchange-item-label">Tú recibes</div>
              <div className="exchange-item-name">lo que necesitas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3 STEPS ═══ */}
      <section className="steps-section">
        <div className="section-label">En 3 pasos</div>
        <div className="step">
          <div className="step-num">01</div>
          <div className="step-content">
            <h3>Publica lo que ya no usas</h3>
            <p>Sube fotos, ponle precio. Si aceptas trueque, también.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-num">02</div>
          <div className="step-content">
            <h3>Elige lo que quieres</h3>
            <p>Compra directamente o encuentra tu círculo de intercambio.</p>
          </div>
        </div>
        <div className="step">
          <div className="step-num">03</div>
          <div className="step-content">
            <h3>Recibe e intercambia</h3>
            <p>Coordinamos el envío. Tú solo esperas tu nuevo artículo.</p>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="cta-section">
        <h2>Empieza a intercambiar</h2>
        <p>Sin comisiones abusivas. Solo trueque circular inteligente.</p>
        <Link to="/registro" className="cta-btn">
          Crear cuenta gratis
        </Link>
      </section>

      {/* ═══ FOOTER LEGAL ═══ */}
      <footer className="footer">
        <div className="footer-links">
          <Link to="/legal/aviso">Aviso legal</Link>
          <Link to="/legal/privacidad">Privacidad</Link>
          <Link to="/legal/terminos">Términos</Link>
          <Link to="/legal/cookies">Cookies</Link>
          <Link to="/legal/pagos">Pagos</Link>
          <Link to="/legal/envios">Envíos</Link>
        </div>
        <div className="footer-copy">© 2026 Treqe</div>
      </footer>
    </>
  );
}

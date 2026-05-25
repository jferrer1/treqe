import { Link } from "react-router-dom";

export function CookiesPage() {
  return (
    <>
      <div className="header">
 <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
 <span className="page-title">Cookies</span>
 <div className="header-right">
 <button className="dark-toggle"><i className="fas fa-moon"></i></button>
 </div>
 </div>

 <div className="container">
 <h1>Política de Cookies</h1>
 <div className="meta">Última actualización: 12 de mayo de 2026</div>

 <p>Esta política explica qué son las cookies, cómo las usamos en treqe y cómo puedes gestionarlas.</p>

 <h2>1. ¿Qué son las cookies?</h2>
 <p>Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas una web. Permiten que la web recuerde tus preferencias y comportamiento.</p>

 <h2>2. Cookies que utilizamos</h2>
 <table>
 <tr><th>Tipo</th><th>Nombre</th><th>Finalidad</th><th>Duración</th></tr>
 <tr><td>Técnica (esencial)</td><td>MIB_session</td><td>Mantener tu sesión iniciada</td><td>Sesión</td></tr>
 <tr><td>Técnica (esencial)</td><td>csrf_token</td><td>Proteger contra ataques CSRF</td><td>Sesión</td></tr>
 <tr><td>Preferencias</td><td>MIB_prefs</td><td>Recordar tus preferencias de interfaz</td><td>1 año</td></tr>
 <tr><td>Analítica</td><td>_ga, _ga_*</td><td>Google Analytics (tráfico y uso)</td><td>2 años</td></tr>
 <tr><td>Analítica</td><td>_gid</td><td>Google Analytics (sesión)</td><td>24h</td></tr>
 </table>

 <h2>3. Cookies de Terceros</h2>
 <p>Además de las cookies propias, utilizamos cookies de:</p>
 <ul>
 <li><strong>Google Analytics:</strong> para analizar el tráfico y mejorar la plataforma</li>
 <li><strong>Stripe:</strong> para procesar pagos de forma segura</li>
 <li><strong>Cloudflare:</strong> para seguridad y rendimiento</li>
 </ul>

 <h2>4. Gestión de Cookies</h2>
 <p>Puedes gestionar las cookies desde:</p>
 <ul>
 <li>El banner de cookies que aparece al entrar en la web</li>
 <li>La configuración de tu navegador (Chrome, Firefox, Safari)</li>
 <li>Herramientas como <a href="https://tools.google.com/dlpage/gaoptout" target="_blank">Google Analytics Opt-out</a></li>
 </ul>
 <p>Si bloqueas las cookies esenciales, algunas funcionalidades de treqe pueden no funcionar correctamente.</p>

 <h2>5. Consentimiento</h2>
 <p>Al hacer clic en "Aceptar" en el banner de cookies, consientes el uso de todas las cookies descritas. Puedes retirar tu consentimiento en cualquier momento desde la configuración de tu navegador.</p>

 <p style={{ marginTop: '40px', fontSize: '.8rem', color: '#888' }}>Esta página es informativa y no constituye asesoramiento legal. Consulte con un profesional para adaptarla a su situación específica.</p>
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

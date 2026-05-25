import { Link } from "react-router-dom";


export function PrivacyPage() {
  return (
    <>
      <div className="header">
    <Link  to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
    <span className="page-title">Privacidad</span>
    <div className="header-right">
      <button className="dark-toggle" ><i className="fas fa-moon"></i></button>
    </div>
  </div>

  <div className="container">
    <h1>Política de Privacidad</h1>
    <div className="meta">Última actualización: 12 de mayo de 2026</div>

    <p>En treqe nos tomamos muy en serio tu privacidad. Esta política explica qué datos recogemos, por qué los necesitamos y qué derechos tienes sobre ellos, de acuerdo con el Reglamento General de Protección de Datos (RGPD) de la Unión Europea.</p>

    <h2>1. Responsable del Tratamiento</h2>
    <p><strong>Identidad:</strong> [Nombre del titular]<br />
    <strong>Contacto:</strong> privacy@treqe.es</p>

    <h2>2. Datos que Recogemos</h2>
    <p><strong>Datos que nos proporcionas voluntariamente:</strong></p>
    <ul>
      <li>Nombre de usuario, correo electrónico y contraseña (registro)</li>
      <li>Foto de perfil y datos de perfil público (opcional)</li>
      <li>Dirección de envío (necesaria para las transacciones)</li>
      <li>Artículos que publicas, sus fotos y descripciones</li>
      <li>Valoraciones y reseñas de otros usuarios</li>
    </ul>
    <p><strong>Datos recogidos automáticamente:</strong></p>
    <ul>
      <li>Dirección IP, tipo de navegador, sistema operativo</li>
      <li>Páginas visitadas y acciones dentro de la plataforma</li>
      <li>Cookies funcionales y analíticas (ver Política de Cookies)</li>
    </ul>

    <h2>3. Finalidad del Tratamiento</h2>
    <p>Tus datos se utilizan para:</p>
    <ul>
      <li>Gestionar tu cuenta y permitirte usar la plataforma</li>
      <li>Facilitar los intercambios y compraventas entre usuarios</li>
      <li>Procesar pagos y gestionar el escrow</li>
      <li>Enviarte notificaciones relacionadas con tu actividad</li>
      <li>Mejorar la plataforma y prevenir fraudes</li>
      <li>Cumplir con obligaciones legales (fiscales, contables)</li>
    </ul>

    <h2>4. Legitimación</h2>
    <p>La base legal para el tratamiento de tus datos es:</p>
    <ul>
      <li>La ejecución del contrato de uso de la plataforma</li>
      <li>Tu consentimiento explícito (para cookies no esenciales)</li>
      <li>El interés legítimo (mejora del servicio, prevención de fraude)</li>
      <li>Obligaciones legales (facturación, prevención de blanqueo)</li>
    </ul>

    <h2>5. Cesión de Datos</h2>
    <p>No cedemos tus datos personales a terceros, excepto:</p>
    <ul>
      <li>Al usuario con el que realizas un intercambio (dirección de envío)</li>
      <li>Proveedores de pago (Stripe) para procesar transacciones</li>
      <li>Transportistas para la gestión de envíos</li>
      <li>Autoridades legales cuando sea requerido por ley</li>
    </ul>

    <h2>6. Conservación</h2>
    <p>Conservamos tus datos mientras mantengas tu cuenta activa. Una vez eliminada la cuenta, los datos se conservarán bloqueados durante los plazos legales (generalmente 5 años por obligaciones fiscales) y posteriormente se eliminarán.</p>

    <h2>7. Tus Derechos</h2>
    <p>Puedes ejercer en cualquier momento tus derechos de:</p>
    <ul>
      <li><strong>Acceso:</strong> saber qué datos tenemos tuyos</li>
      <li><strong>Rectificación:</strong> corregir datos inexactos</li>
      <li><strong>Supresión:</strong> solicitar la eliminación de tus datos</li>
      <li><strong>Limitación:</strong> restringir el tratamiento</li>
      <li><strong>Portabilidad:</strong> recibir tus datos en formato digital</li>
      <li><strong>Oposición:</strong> oponerte al tratamiento para ciertos fines</li>
    </ul>
    <p>Para ejercer tus derechos, escribe a <strong>privacy@treqe.es</strong>. También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD).</p>

    <p style={{ marginTop: '40px', fontSize: '.8rem', color: '#888' }}>Esta página es informativa y no constituye asesoramiento legal. Consulte con un profesional para adaptarla a su situación específica.</p>
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

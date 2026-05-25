import { Link } from "react-router-dom";


export function TermsPage() {
  return (
    <>
      <div className="header">
    <Link  to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
    <span className="page-title">Términos</span>
    <div className="header-right">
      <button className="dark-toggle" ><i className="fas fa-moon"></i></button>
    </div>
  </div>

  <div className="container">
    <h1>Términos y Condiciones</h1>
    <div className="meta">Última actualización: 12 de mayo de 2026</div>

    <h2>1. Aceptación</h2>
    <p>Al registrarte y usar treqe aceptas estos términos. Si no estás de acuerdo, no uses la plataforma.</p>

    <h2>2. Descripción del Servicio</h2>
    <p>treqe es una plataforma que conecta a personas para intercambiar objetos de segunda mano. Ofrece dos modalidades:</p>
    <ul>
      <li><strong>Compra directa:</strong> pagas un precio fijo por un artículo</li>
      <li><strong>Intercambio circular:</strong> ofreces tus artículos a cambio de otros, con o sin compensación económica</li>
    </ul>
    <p>treqe actúa como intermediario tecnológico. No participa en la negociación, no posee los artículos y no actúa como vendedor ni comprador.</p>

    <h2>3. Requisitos del Usuario</h2>
    <ul>
      <li>Ser mayor de 18 años o tener autorización de un tutor legal</li>
      <li>Proporcionar datos veraces durante el registro</li>
      <li>No utilizar la plataforma para actividades ilegales</li>
      <li>Mantener la confidencialidad de tu cuenta</li>
    </ul>

    <h2>4. Publicación de Artículos</h2>
    <ul>
      <li>Los artículos deben ser reales, existentes y descritos con precisión</li>
      <li>No se permiten artículos ilegales, peligrosos o prohibidos (armas, drogas, animales, etc.)</li>
      <li>Las fotos deben ser reales del artículo, no imágenes de catálogo</li>
      <li>treqe se reserva el derecho de eliminar artículos que incumplan estas normas</li>
    </ul>

    <h2>5. Proceso de Intercambio Circular</h2>
    <p>El intercambio circular funciona de la siguiente manera:</p>
    <ol style={{ marginBottom: '14px', paddingLeft: '20px', fontSize: '.92rem', color: '#444' }}>
      <li style={{ marginBottom: '8px' }}>Un usuario expresa interés por un artículo y ofrece algo a cambio</li>
      <li style={{ marginBottom: '8px' }}>El algoritmo busca un círculo de intercambio (A→B→C→A)</li>
      <li style={{ marginBottom: '8px' }}>Todos los participantes reciben la propuesta y tienen 24h para aceptar</li>
      <li style={{ marginBottom: '8px' }}>Si todos aceptan, se procede al envío coordinado</li>
      <li style={{ marginBottom: '8px' }}>Si alguien rechaza o expira, el match se cancela y los artículos vuelven al pool</li>
    </ol>

    <h2>6. Escrow y Pagos</h2>
    <p>Cuando un intercambio implica compensación económica, el importe se retiene mediante escrow hasta que todos los participantes confirmen la recepción de los artículos. Esto garantiza que nadie resulte perjudicado.</p>

    <h2>7. Comisiones</h2>
    <p>treqe cobra una comisión por cada transacción completada. El porcentaje se indicará de forma transparente antes de confirmar cualquier operación. Actualmente, durante la fase de prototipo, no se aplican comisiones.</p>

    <h2>8. Conducta del Usuario</h2>
    <ul>
      <li>No está permitido el acoso, fraude o manipulación del sistema</li>
      <li>Los usuarios deben cumplir los plazos de envío acordados</li>
      <li>El sistema de reputación refleja la confianza de la comunidad</li>
    </ul>

    <h2>9. Limitación de Responsabilidad</h2>
    <p>treqe no se hace responsable de:</p>
    <ul>
      <li>El estado real de los artículos intercambiados</li>
      <li>El incumplimiento de los acuerdos entre usuarios</li>
      <li>Daños derivados del uso de la plataforma</li>
      <li>La pérdida o deterioro de artículos durante el envío</li>
    </ul>

    <h2>10. Modificaciones</h2>
    <p>treqe se reserva el derecho de modificar estos términos. Los usuarios serán notificados de cambios sustanciales con al menos 30 días de antelación.</p>

    <h2>11. Baja del Servicio</h2>
    <p>Puedes eliminar tu cuenta en cualquier momento desde los ajustes de perfil. Los intercambios en curso deberán completarse antes de la eliminación.</p>

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

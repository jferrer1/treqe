import { Link } from "react-router-dom";


export function LegalNoticePage() {
  return (
    <>
      <div className="header">
    <Link  to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
    <span className="page-title">Aviso Legal</span>
    <div className="header-right">
      <button className="dark-toggle" ><i className="fas fa-moon"></i></button>
    </div>
  </div>

  <div className="container">
    <h1>Aviso Legal</h1>
    <div className="meta">Última actualización: 12 de mayo de 2026</div>

    <h2>1. Datos del Responsable</h2>
    <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa:</p>
    <p><strong>Denominación:</strong> treqe (proyecto en fase de desarrollo)<br />
    <strong>Titular:</strong> [Nombre del titular]<br />
    <strong>NIF/CIF:</strong> [NIF del titular]<br />
    <strong>Domicilio:</strong> [Dirección del titular]<br />
    <strong>Correo electrónico:</strong> legal@treqe.es</p>

    <h2>2. Propiedad Intelectual e Industrial</h2>
    <p>Todos los contenidos de esta web (textos, imágenes, logos, diseño, código fuente) son propiedad de treqe o se utilizan con licencia de sus titulares. Queda prohibida la reproducción total o parcial sin autorización expresa.</p>
    <p>El nombre "Treqe", su logotipo y el eslogan "Intercambio en cadena" son marcas en proceso de registro.</p>

    <h2>3. Finalidad de la Plataforma</h2>
    <p>treqe es un marketplace de segunda mano que facilita el intercambio de objetos entre usuarios mediante:</p>
    <ul>
      <li>Compraventa directa (como Wallapop o Vinted)</li>
      <li>Intercambio circular (trueque múltiple asistido por algoritmo)</li>
    </ul>
    <p>treqe actúa como intermediario tecnológico y no participa en las transacciones entre usuarios, salvo en la retención de fondos (escrow) para garantizar los intercambios.</p>

    <h2>4. Exención de Responsabilidad</h2>
    <p>treqe no se responsabiliza de:</p>
    <ul>
      <li>El estado real de los objetos intercambiados entre usuarios</li>
      <li>El cumplimiento de los acuerdos entre las partes</li>
      <li>Los daños derivados del uso incorrecto de la plataforma</li>
      <li>La veracidad de los datos proporcionados por los usuarios</li>
    </ul>

    <h2>5. Ley Aplicable y Jurisdicción</h2>
    <p>Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales de [ciudad del titular], renunciando a cualquier otro fuero que pudiera corresponderles.</p>

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

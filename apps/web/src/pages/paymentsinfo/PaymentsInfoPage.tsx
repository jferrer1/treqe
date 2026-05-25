import { Link } from "react-router-dom";

export function PaymentsInfoPage() {
  return (
    <>
      <div className="header">
 <Link to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
 <span className="page-title">Pagos y Escrow</span>
 <div className="header-right">
 <button className="dark-toggle"><i className="fas fa-moon"></i></button>
 </div>
 </div>

 <div className="container">
 <h1>Pagos, Escrow &amp; Comisiones</h1>
 <div className="meta">Prototipo — Cómo funciona el dinero en treqe</div>

 <div className="card">
 <div className="card-icon green"><i className="fas fa-shield-alt"></i></div>
 <h2 style={{ marginTop: '0' }}>Escrow: tu dinero está protegido</h2>
 <p>Cuando un intercambio implica compensación económica (por ejemplo, tu artículo vale 400€ y el que quieres vale 500€, pagas 100€ de diferencia), treqe <strong>retiene ese importe</strong> hasta que todos los participantes confirmen haber recibido sus artículos.</p>
 <p><strong>Cómo funciona:</strong></p>
 <ul>
 <li>① El importe se cobra en el momento de aceptar el match</li>
 <li>② treqe lo retiene en una cuenta segregada (no lo usa)</li>
 <li>③ Cuando todos confirman recepción, se libera al vendedor</li>
 <li>④ Si algo sale mal, el dinero se devuelve al pagador</li>
 </ul>
 </div>

 <div className="card">
 <div className="card-icon orange"><i className="fas fa-credit-card"></i></div>
 <h2 style={{ marginTop: '0' }}>Métodos de pago aceptados</h2>
 <ul>
 <li><strong>Tarjeta de crédito/débito</strong> (Visa, Mastercard) — procesado por Stripe</li>
 <li><strong>Bizum</strong> — para compras directas de menos de 1.000€</li>
 <li><strong>PayPal</strong> — disponible para compras directas e intercambios</li>
 <li><strong>Monedero treqe</strong> — saldo acumulado de intercambios anteriores</li>
 </ul>
 <p style={{ marginTop: '10px', fontSize: '.82rem', color: '#888' }}>Todos los pagos se procesan a través de Stripe. treqe no almacena datos bancarios.</p>
 </div>

 <div className="card">
 <div className="card-icon blue"><i className="fas fa-percent"></i></div>
 <h2 style={{ marginTop: '0' }}>Comisiones</h2>
 <p><strong>Compra directa:</strong> 5% del precio de venta (pagado por el vendedor)</p>
 <p><strong>Intercambio circular:</strong> 5% sobre la diferencia económica (repartido entre los participantes)</p>
 <p><strong>Sin comisión</strong> por publicar artículos ni por recibir ofertas.</p>
 <p style={{ marginTop: '10px', fontSize: '.82rem', color: '#888', background: '#1C1915', padding: '12px', borderRadius: '10px' }}>
 <i className="fas fa-info-circle" style={{ color: 'var(--accent)' }}></i> 
 Durante la fase de prototipo no se aplican comisiones reales.
 </p>
 </div>

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

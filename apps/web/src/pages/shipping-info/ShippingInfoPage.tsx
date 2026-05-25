import { Link } from "react-router-dom";


export function ShippingInfoPage() {
  return (
    <>
      <div className="header">
    <Link  to="/" className="back-link"><i className="fas fa-arrow-left"></i> Volver</Link>
    <span className="page-title">Envíos</span>
    <div className="header-right">
      <button className="dark-toggle" ><i className="fas fa-moon"></i></button>
    </div>
  </div>

  <div className="container">
    <h1>Costes de Envío</h1>
    <div className="meta">Prototipo — Cómo funcionan los envíos en treqe</div>

    <div className="card">
      <h2 style={{ marginTop: '0' }}>¿Quién paga el envío?</h2>
      <p><strong>En compra directa:</strong> El comprador paga el envío (como en Wallapop). El precio del artículo no incluye transporte.</p>
      <p><strong>En intercambio circular:</strong> Cada participante <strong>paga el envío de su propio artículo</strong> al siguiente en la cadena. Es decir, tú pagas por enviar tu artículo a quien le toque recibirlo, y otra persona paga por enviarte el tuyo.</p>
    </div>

    <div className="card">
      <h2 style={{ marginTop: '0' }}>Tarifas orientativas (España peninsular)</h2>
      <table>
        <tr><th>Tipo</th><th>Peso</th><th>Coste</th><th>Transportista</th></tr>
        <tr><td>Paquetería pequeña</td><td>Hasta 2 kg</td><td>4,95€</td><td>Correos / MRW</td></tr>
        <tr><td>Paquetería mediana</td><td>2-10 kg</td><td>6,95€</td><td>Correos / MRW</td></tr>
        <tr><td>Paquetería grande</td><td>10-30 kg</td><td>9,95€</td><td>MRW / SEUR</td></tr>
        <tr><td>Voluminoso (bicis, muebles)</td><td>+30 kg</td><td>14,95€</td><td>SEUR / Tipsa</td></tr>
      </table>
      <p style={{ fontSize: '.82rem', color: '#888' }}>Las tarifas pueden variar según destino (Islas, Europa). El cálculo exacto se muestra antes de confirmar el intercambio.</p>
    </div>

    <div className="card">
      <h2 style={{ marginTop: '0' }}>Protege tu envío</h2>
      <p>Si algo sale mal, no pierdes tu dinero. El seguro cubre:</p>
      <ul>
        <li><strong>Si el artículo no llega</strong> -> te devolvemos el importe íntegro</li>
        <li><strong>Si llega roto</strong> -> te devolvemos el importe (con fotos)</li>
        <li><strong>Si no es lo que pediste</strong> -> te devolvemos el importe</li>
      </ul>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
        <div style={{ background: 'transparent', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '.85rem', fontWeight: '700', color: '#1C1915', marginBottom: '4px' }}>Compra directa</div>
          <div style={{ fontSize: '.75rem', color: '#666', lineHeight: '1.5' }}>Añade seguro por <strong>1,99€</strong> al comprar. Cubre hasta el valor del artículo. Tú decides si lo añades o no.</div>
        </div>
        <div style={{ background: 'transparent', borderRadius: '14px', padding: '16px' }}>
          <div style={{ fontSize: '.85rem', fontWeight: '700', color: '#1C1915', marginBottom: '4px' }}>Intercambio</div>
          <div style={{ fontSize: '.75rem', color: '#666', lineHeight: '1.5' }}>El seguro ya está incluido en el envío. Todos los intercambios están protegidos automáticamente.</div>
        </div>
      </div>
      <p style={{ marginTop: '12px', fontSize: '.78rem', color: '#888' }}><i className="fas fa-shield-alt" style={{ color: '#1C1915' }}></i> Los seguros son gestionados por Correos, MRW y SEUR. treqe no es una aseguradora.</p>
    </div>

    <div className="card">
      <h2 style={{ marginTop: '0' }}>Transportistas disponibles</h2>
      <ul>
        <li><strong>Correos</strong> — Paquetería estándar (2-5 días laborables)</li>
        <li><strong>MRW</strong> — Mensajería rápida (24-48h)</li>
        <li><strong>SEUR</strong> — Paquetería urgente y voluminosos</li>
        <li><strong>Tipsa</strong> — Muebles y objetos grandes</li>
      </ul>
      <p style={{ marginTop: '10px', fontSize: '.82rem', color: '#888', background: '#1C1915', padding: '12px', borderRadius: '10px' }}>
        <i className="fas fa-info-circle" style={{ color: 'var(--accent)' }}></i> 
        treqe genera una etiqueta de envío con descuento que puedes usar con cualquiera de estos transportistas.
      </p>
    </div>

    <div className="card">
      <h2 style={{ marginTop: '0' }}>Proceso de envío en intercambio circular</h2>
      <ol style={{ paddingLeft: '20px', fontSize: '.92rem', color: '#444' }}>
        <li style={{ marginBottom: '8px' }}>Todos aceptan el match → se muestran las direcciones</li>
        <li style={{ marginBottom: '8px' }}>Cada uno empaca su artículo y genera la etiqueta</li>
        <li style={{ marginBottom: '8px' }}>Entrega al transportista (recogida en domicilio opcional)</li>
        <li style={{ marginBottom: '8px' }}>Tracking en tiempo real desde Mis Trueques</li>
        <li style={{ marginBottom: '8px' }}>Confirmación de recepción → liberación del escrow</li>
      </ol>
    </div>

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

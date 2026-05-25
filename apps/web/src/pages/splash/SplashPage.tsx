import { Link } from "react-router-dom";


export function SplashPage() {
  return (
    <>
      <div className="splash">

  <div className="top-bar">
    <img src="../../assets/treqe-logo-mib.png" alt="treqe" />
  </div>

  <div className="slides-wrap" id="wrap">
    <div className="slides-track" id="track">

      
      <div className="slide">
        <div className="slide-eyebrow">Intercambio circular</div>
        <h1><strong>Trueque circular:</strong><br />das a uno,<br />recibes de otro.</h1>
        <p>El intercambio que no necesita coincidir.</p>
      </div>

      
      <div className="slide">
        <div className="slide-eyebrow">En 3 pasos</div>
        <h1>Publica.<br />Elige.<br /><em>Recibe.</em></h1>
        <p>Tú solo tienes que publicar y elegir. Nosotros encontramos el trueque perfecto.</p>
        <div className="slide-grid">
          <div className="cell filled"></div><div className="cell filled"></div><div className="cell filled"></div><div className="cell filled"></div><div className="cell filled"></div><div className="cell filled"></div><div className="cell filled"></div>
          <div className="cell"></div><div className="cell"></div><div className="cell highlight"></div><div className="cell highlight"></div><div className="cell"></div><div className="cell"></div><div className="cell"></div>
        </div>
      </div>

      
      <div className="slide">
        <div className="slide-eyebrow">Empieza ahora</div>
        <h1>Dale una<br />segunda vida<br /><em>a tus cosas.</em></h1>
        <p>Únete a la comunidad de intercambio.</p>
        <Link  to="/registro" className="slide-cta-link">Crear cuenta <i className="fas fa-arrow-right" style={{ fontSize: '0.55rem' }}></i></Link>
      </div>

    </div>
  </div>

  <div className="bottom-bar">
    <div className="dots" id="dots">
      <div className="dot active"></div>
      <div className="dot"></div>
      <div className="dot"></div>
    </div>
    <Link  to="/catalogo" className="skip">Saltar</Link>
  </div>

</div>
    </>
  );
}

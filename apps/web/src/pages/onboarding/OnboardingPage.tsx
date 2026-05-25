import { Link } from "react-router-dom";

export function OnboardingPage() {
  return (
    <>
      <div className="onboarding">
 <div className="top-bar"><Link to="/catalogo" className="skip-link">Saltar</Link></div>

 <div className="slides-wrap" id="wrap">
 <div className="slides-track" id="track">

 <div className="slide">
 <div className="slide-eyebrow">Bienvenido a treqe</div>
 <div className="slide-icon">⟳</div>
 <h2>Trueque circular:<br /><em>das a uno, recibes de otro.</em></h2>
 <p>No necesitas encontrar a alguien que quiera exactamente lo tuyo. La comunidad cierra el círculo por ti.</p>
 </div>

 <div className="slide">
 <div className="slide-eyebrow">Cómo funciona</div>
 <div className="slide-icon">📦</div>
 <h2>Publica lo que<br />ya no usas.<br /><em>Elige lo que quieres.</em></h2>
 <p>El algoritmo encuentra el círculo perfecto. Con o sin dinero, tú decides.</p>
 </div>

 <div className="slide">
 <div className="slide-eyebrow">Empieza ahora</div>
 <div className="slide-icon">🚀</div>
 <h2>Dale una segunda<br />vida a tus cosas.<br /><em>Únete gratis.</em></h2>
 <p>Crea tu cuenta en segundos y empieza a intercambiar.</p>
 <Link to="/registro" className="cta-btn">Crear cuenta <i className="fas fa-arrow-right"></i></Link>
 </div>
 </div>
 </div>

 <div className="dots" id="dots">
 <div className="dot active"></div><div className="dot"></div><div className="dot"></div>
 </div>
</div>
    </>
  );
}

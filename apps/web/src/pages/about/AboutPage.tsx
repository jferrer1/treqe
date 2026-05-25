import { Link } from "react-router-dom";


export function AboutPage() {
  return (
    <>
      <div className="treqe-header">
  <div className="treqe-header__left">
    <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
    <span className="treqe-header__title">Sobre treqe</span>
  </div>
  <div className="treqe-header__right"></div>
</div>
<div className="container">

<h2>Sobre treqe</h2>
<p>treqe es un marketplace de intercambio circular que conecta a personas para intercambiar objetos sin necesidad de dinero.</p>
<div className="card">
  <div className="card__body">
    <h3>Version</h3>
    <p>0.1.0 · Build 2026.05</p>
  </div>
</div>
<div className="card">
  <div className="card__body">
    <h3>Mision</h3>
    <p>Dar una segunda vida a los objetos mediante el intercambio comunitario, reduciendo el consumo y creando conexiones entre personas.</p>
  </div>
</div>
<div className="card">
  <div className="card__body">
    <h3>Contacto</h3>
    <p>hola@treqe.es</p>
  </div>
</div>

</div>
    </>
  );
}

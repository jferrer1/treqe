import { Link } from "react-router-dom";


export function PayMethodsPage() {
  return (
    <>
      <div className="treqe-header">
  <div className="treqe-header__left">
    <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
    <span className="treqe-header__title">Metodos de pago</span>
  </div>
  <div className="treqe-header__right"></div>
</div>
<div className="container">

<h2>Metodos de pago</h2>
<p>Gestiona tus tarjetas y metodos de pago para compras y garantias.</p>
<div className="card">
  <i className="fab fa-cc-visa"></i>
  <div className="card__body">
    <h3>Visa terminada en 4242</h3>
    <p>Predeterminada</p>
  </div>
  <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
</div>
<div className="card">
  <i className="fab fa-paypal"></i>
  <div className="card__body">
    <h3>PayPal</h3>
    <p>pepe@email.com</p>
  </div>
  <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
</div>
<button type="button" className="btn" style={{ background: 'transparent', color: 'var(--text)', borderColor: 'var(--border-strong)', marginTop: '8px' }}>
  <i className="fas fa-plus"></i> Anadir metodo
</button>

</div>
    </>
  );
}

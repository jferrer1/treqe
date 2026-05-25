import { Link } from "react-router-dom";


export function AddressPage() {
  return (
    <>
      <div className="treqe-header">
  <div className="treqe-header__left">
    <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
    <span className="treqe-header__title">Direccion de envio</span>
  </div>
  <div className="treqe-header__right"></div>
</div>
<div className="container">

<h2>Direccion de envio</h2>
<p>Guarda tu direccion habitual para agilizar los envios en tus intercambios.</p>
<form>
  <div className="form-group">
    <label>Calle y numero</label>
    <input type="text" placeholder="Calle Mayor, 42" value="Calle Mayor, 42" />
  </div>
  <div className="form-group">
    <label>Piso / Puerta</label>
    <input type="text" placeholder="2o B" value="2o B" />
  </div>
  <div className="form-group">
    <label>Codigo postal</label>
    <input type="text" placeholder="28001" value="28001" />
  </div>
  <div className="form-group">
    <label>Ciudad</label>
    <input type="text" placeholder="Madrid" value="Madrid" />
  </div>
  <div className="form-group">
    <label>Provincia</label>
    <select><option>Madrid</option><option>Barcelona</option><option>Valencia</option></select>
  </div>
  <button type="button" className="btn"><i className="fas fa-save"></i> Guardar direccion</button>
</form>

</div>
    </>
  );
}

export function DeleteAccountPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Eliminar cuenta</span>
 </div>
 <div className="treqe-header__right"></div>
</div>
<div className="container">

<h2>Eliminar cuenta</h2>
<p>Al eliminar tu cuenta se borraran permanentemente todos tus datos, articulos publicados, valoraciones e historial de intercambios. Esta accion no se puede deshacer.</p>
<div className="card" style={{ borderColor: '#c0392b' }}>
 <i className="fas fa-exclamation-triangle" style={{ color: '#c0392b' }}></i>
 <div className="card__body">
 <h3 style={{ color: '#c0392b' }}>Accion irreversible</h3>
 <p>Perderas el acceso a todos tus treqes activos y tu scoring acumulado.</p>
 </div>
</div>
<form>
 <div className="form-group">
 <label>Contrasena actual</label>
 <input type="password" placeholder="Introduce tu contrasena" />
 </div>
 <button type="button" className="btn" style={{ background: '#c0392b', borderColor: '#c0392b' }}>Eliminar cuenta permanentemente</button>
</form>

</div>
    </>
  );
}

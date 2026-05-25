export function ContactPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Contactar soporte</span>
 </div>
 <div className="treqe-header__right"></div>
</div>
<div className="container">

<h2>Contactar soporte</h2>
<p>Escribenos y te responderemos en menos de 24 horas.</p>
<form>
 <div className="form-group">
 <label>Asunto</label>
 <select>
 <option>Problema con un envio</option>
 <option>Problema con un pago</option>
 <option>Disputa</option>
 <option>Verificacion de identidad</option>
 <option>Otro</option>
 </select>
 </div>
 <div className="form-group">
 <label>Mensaje</label>
 <textarea rows={5} placeholder="Describe tu problema..."></textarea>
 </div>
 <button type="button" className="btn"><i className="fas fa-paper-plane"></i> Enviar mensaje</button>
</form>

</div>
    </>
  );
}

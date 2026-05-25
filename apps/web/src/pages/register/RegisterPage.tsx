import { Link } from "react-router-dom";

export function RegisterPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Registro</span>
 </div>
 <div className="treqe-header__right"></div>
</div>

<div className="container">
 <h2>Crear cuenta</h2>
 <p className="sub">Únete a la comunidad de intercambio circular.</p>

 <button className="btn btn-google">
 <i className="fab fa-google"></i> Continuar con Google
 </button>

 <button className="btn btn-google" style={{ marginTop: '10px' }}>
 <i className="fab fa-apple"></i> Continuar con Apple
 </button>

 <div className="divider">o con email</div>

 <form>
 <div className="form-group">
 <label>Nombre</label>
 <input type="text" placeholder="Tu nombre" required />
 </div>
 <div className="form-group">
 <label>Email</label>
 <input type="email" placeholder="tu@email.com" required />
 </div>
 <div className="form-group">
 <label>Contraseña</label>
 <input type="password" placeholder="Mínimo 8 caracteres" required minLength={8} />
 </div>
 <div className="checkbox-group">
 <input type="checkbox" id="terms" required />
 <label htmlFor="terms">Acepto los <Link to="/legal/terminos">términos</Link> y la <Link to="/legal/privacidad">política de privacidad</Link></label>
 </div>
 <button type="submit" className="btn">Crear cuenta <i className="fas fa-arrow-right"></i></button>
 </form>

 <div className="footer-link">
 ¿Ya tienes cuenta? <Link to="/registro">Iniciar sesión</Link>
 </div>
</div>
    </>
  );
}

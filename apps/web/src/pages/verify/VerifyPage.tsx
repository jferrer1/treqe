import { Link } from "react-router-dom";

export function VerifyPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Verificar identidad</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>

 <div className="page">
 <div className="verify-hero">
 <div className="verify-icon"><i className="fas fa-shield-alt"></i></div>
 <div className="verify-hero__title">Verifica tu identidad</div>
 <div className="verify-hero__text">La verificacion aumenta tu reputacion y la confianza de otros usuarios en Treqe</div>
 <div className="verify-hero__badge"><i className="fas fa-star"></i> +15 al scoring al verificar</div>
 </div>

 
 <div className="progress-wrap">
 <div className="progress-label">
 <span>Progreso de verificacion</span>
 <span className="progress-label__count">2 de 3 completados</span>
 </div>
 <div className="progress-track">
 <div className="progress-fill"></div>
 </div>
 <div className="progress-steps">
 <span className="step-dot done"><i className="fas fa-check-circle"></i> DNI</span>
 <span className="step-dot done"><i className="fas fa-check-circle"></i> Telefono</span>
 <span className="step-dot active"><i className="fas fa-circle"></i> Selfie</span>
 </div>
 </div>

 
 <div className="verify-card">
 <div className="verify-card__row">
 <div className="verify-card__icon"><i className="fas fa-id-card"></i></div>
 <div className="verify-card__body">
 <div className="verify-card__title">DNI o documento oficial</div>
 <div className="verify-card__text">Sube una foto de tu documento. Solo se usara para verificacion, nunca se mostrara publicamente.</div>
 <div className="verify-card__status completed"><i className="fas fa-check-circle"></i> Completado</div>
 
 <div className="privacy-link">
 <i className="fas fa-shield-halved"></i> ¿Por que lo pedimos? · Como protegemos tus datos
 </div>
 </div>
 </div>
 </div>

 
 <div className="verify-card">
 <div className="verify-card__row">
 <div className="verify-card__icon"><i className="fas fa-phone"></i></div>
 <div className="verify-card__body">
 <div className="verify-card__title">Numero de telefono</div>
 <div className="verify-card__text">Verifica tu numero de telefono mediante SMS.</div>
 <div className="verify-card__status completed"><i className="fas fa-check-circle"></i> Completado</div>
 </div>
 </div>
 </div>

 
 <div className="verify-card">
 <div className="verify-card__row">
 <div className="verify-card__icon"><i className="fas fa-camera"></i></div>
 <div className="verify-card__body">
 <div className="verify-card__title">Selfie de verificacion</div>
 <div className="verify-card__text">Hazte una foto mostrando tu cara. La IA la comparara con tu documento.</div>
 <div className="verify-card__status pending"><i className="fas fa-clock"></i> Pendiente</div>
 <button className="verify-card__action">
 <i className="fas fa-camera"></i> Iniciar verificacion
 </button>
 </div>
 </div>
 </div>

 <button className="action-btn action-btn--primary">
 <i className="fas fa-arrow-right"></i> Completar verificacion
 </button>
 </div>

 <nav className="bottom-nav">
 <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
 <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>Treqes</span></Link>
 <Link to="/subir" className="nav-item nav-add"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
 <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
 <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
 </nav>




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

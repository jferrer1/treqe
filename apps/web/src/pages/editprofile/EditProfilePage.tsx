import { Link } from "react-router-dom";

export function EditProfilePage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Editar perfil</span>
 </div>
 <div className="treqe-header__right">
 </div>
 </div>

 <div className="page">
 <div className="avatar-section">
 <div className="avatar-circle" id="avatarCircle">
 <span id="avatarLetter">T</span>
 <div className="avatar-circle__overlay"><i className="fas fa-camera"></i></div>
 </div>
 <button className="avatar-change"><i className="fas fa-camera" style={{ marginRight: '4px' }}></i> Cambiar foto</button>
 </div>

 <div className="form-group">
 <label className="form-group__label">Nombre</label>
 <input className="form-input" type="text" value="Tu Nombre" id="nameInput" maxLength={50} />
 </div>

 <div className="form-group">
 <label className="form-group__label">Nombre de usuario</label>
 <div className="username-wrap">
 <input className="form-input username-input" type="text" value="@usuario" id="usernameInput" maxLength={30} autoComplete="off" autoCorrect="off" spellCheck="false" />
 <span className="username-status" id="usernameStatus"></span>
 </div>
 <div className="form-hint">Es publico y aparecera en tu perfil</div>
 </div>

 <div className="form-group">
 <label className="form-group__label">Biografia</label>
 <textarea className="form-textarea" id="bioInput" maxLength={300} placeholder="Cuenta algo sobre ti y lo que buscas en Treqe...">Apasionado de la musica y la tecnologia. Busco intercambios justos y sin complicaciones.</textarea>
 <div className="form-hint"><span id="bioCount">63</span>/300</div>
 </div>

 <div className="form-section">
 <div className="form-section__title"><i className="fas fa-map-marker-alt" style={{ color: 'var(--accent)', marginRight: '6px' }}></i>Ubicacion</div>
 <div className="form-group">
 <label className="form-group__label">Ciudad</label>
 <input className="form-input" type="text" value="Barcelona" id="cityInput" />
 </div>
 </div>

 <div className="form-section">
 <div className="form-section__title"><i className="fas fa-link" style={{ color: 'var(--accent)', marginRight: '6px' }}></i>Redes sociales</div>
 <div className="form-group">
 <label className="form-group__label">Instagram</label>
 <input className="form-input" type="text" value="" placeholder="@usuario" id="instagramInput" />
 </div>
 </div>
 </div>

 
 <div className="save-bar" id="saveBar">
 <button className="save-bar__btn" id="saveBtn">
 <i className="fas fa-check"></i> Guardar cambios
 </button>
 <button className="save-bar__preview" aria-label="Vista previa publica" title="Ver como me ven otros">
 <i className="fas fa-eye"></i>
 </button>
 </div>

 
 <div className="preview-overlay" id="previewOverlay">
 <div className="preview-sheet">
 <div className="preview-handle"></div>
 <div className="preview-header">
 <span className="preview-header__title"><i className="fas fa-eye" style={{ color: 'var(--accent)', marginRight: '6px' }}></i>Vista previa publica</span>
 <button className="preview-close"><i className="fas fa-xmark"></i></button>
 </div>

 <div className="preview-card">
 <div className="preview-card__top">
 <div className="preview-card__avatar" id="previewAvatarLetter">T</div>
 <div className="preview-card__info">
 <div className="preview-card__name" id="previewName">Tu Nombre</div>
 <div className="preview-card__username" id="previewUsername">@usuario</div>
 <span className="preview-badge"><i className="fas fa-check-circle"></i> Miembro de Treqe</span>
 </div>
 </div>
 <div className="preview-card__bio" id="previewBio">Apasionado de la musica y la tecnologia. Busco intercambios justos y sin complicaciones.</div>
 <div className="preview-card__meta">
 <span><i className="fas fa-map-marker-alt"></i> <span id="previewCity">Barcelona</span></span>
 <span><i className="fas fa-star"></i> <span id="previewRating">4.8</span> (<span id="previewReviews">12</span>)</span>
 <span><i className="fas fa-exchange-alt"></i> <span id="previewTrades">24</span> treqes</span>
 </div>
 <div className="preview-card__social" id="previewSocial">
 <a href="#" aria-label="Instagram" rel="noopener"><i className="fab fa-instagram"></i></a>
 </div>
 </div>

 <div className="preview-footer">
 <i className="fas fa-globe" style={{ marginRight: '4px' }}></i>
 Asi ven tu perfil los demas usuarios de Treqe
 </div>
 </div>
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

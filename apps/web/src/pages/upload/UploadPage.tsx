import { Link } from "react-router-dom";

export function UploadPage() {
  return (
    <>
      <div className="treqe-header">
 <div className="treqe-header__left">
 <button className="treqe-header__back" aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
 <span className="treqe-header__title">Subir articulo</span>
 </div>
 <div className="treqe-header__right">
 <button className="treqe-header__help" aria-label="Ayuda"><i className="fas fa-question-circle"></i></button>
 
 </div>
 </div>

 
 <form className="form-wrap" id="submitForm">

 
 <div className="photo-section">
 <div className="section-label"><i className="fas fa-camera"></i> Fotos <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: '0' }}>(min. 1, max. 8)</span></div>
 <div className="photo-grid" id="photoGrid">
 <div className="photo-slot primary" id="slot0">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-camera"></i>
 <span>Principal</span>
 </div>
 </div>
 <div className="photo-slot" id="slot1">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot2">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot3">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot4">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot5">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot6">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="photo-slot" id="slot7">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 </div>
 </div>

 
 <div className="video-section">
 <div className="section-label"><i className="fas fa-video"></i> Videos <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: '0' }}>(opcional, max. 4)</span></div>
 <div className="video-grid" id="videoGrid">
 <div className="video-slot" id="video0">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="video-slot" id="video1">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="video-slot" id="video2">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 <div className="video-slot" id="video3">
 <div className="placeholder-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
 <i className="fas fa-plus"></i>
 <span>Añadir</span>
 </div>
 </div>
 </div>
 </div>

 <div className="form-group">
 <label htmlFor="title">Título del artículo</label>
 <input type="text" id="title" placeholder="Ej. Fender Stratocaster Player Series" required />
 </div>

 
 <div className="form-group">
 <label htmlFor="mainCat">Categoría</label>
 <div className="category-row">
 <div className="select-wrap">
 <select id="mainCat" required>
 <option value="" disabled selected>Categoría</option>
 <option value="electronica">Electrónica</option>
 <option value="moda">Moda</option>
 <option value="deporte">Deporte</option>
 <option value="musica">Música</option>
 <option value="libros">Libros</option>
 <option value="videojuegos">Videojuegos</option>
 <option value="fotografia">Fotografía</option>
 <option value="hogar">Hogar</option>
 <option value="juguetes">Juguetes</option>
 <option value="coleccionismo">Coleccionismo</option>
 </select>
 </div>
 <div className="select-wrap">
 <select id="subCat" required>
 <option value="" disabled selected>Subcategoría</option>
 </select>
 </div>
 </div>
 </div>

 
 <div className="form-group">
 <label>Estado</label>
 <div className="condition-row" id="conditionRow">
 <div className="condition-option" data-value="nuevo">
 <i className="fas fa-tag"></i>
 Nuevo
 </div>
 <div className="condition-option selected" data-value="como-nuevo">
 <i className="fas fa-star"></i>
 Como nuevo
 </div>
 <div className="condition-option" data-value="bueno">
 <i className="fas fa-check"></i>
 Bueno
 </div>
 <div className="condition-option" data-value="aceptable">
 <i className="fas fa-undo"></i>
 Aceptable
 </div>
 </div>
 </div>

 
 <div className="form-group">
 <label htmlFor="price">Precio <span className="optional">(tú fijas el valor)</span></label>
 <div className="price-wrap" style={{ position: 'relative' }}>
 <span className="currency-symbol">€</span>
 <input type="number" id="price" placeholder="0" min="1" step={1} required />
 </div>
 </div>

 
 <div className="form-group">
 <label htmlFor="desc">Descripción <span className="optional">(opcional)</span></label>
 <textarea id="desc" placeholder="Describe el estado, año, accesorios incluidos..."></textarea>
 </div>

 
 <div className="form-group">
 <label>Datos para el envío</label>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
 <div>
 <label style={{ fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.5rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-sub)', marginBottom: '4px', display: 'block' }}>Peso</label>
 <div style={{ display: 'flex', alignItems: 'center', maxWidth: '140px', padding: '0 4px 0 0', border: '1px solid #E5E0D8', borderRadius: '2px', background: '#FFFFFF' }}>
 <input type="number" id="weight" placeholder="0" min="0" step="0.1" style={{ padding: '10px 8px', flex: '1', border: 'none', outline: 'none', background: 'transparent', fontFamily: '\'IBM Plex Sans\',sans-serif', fontSize: '.85rem', color: 'var(--text)', textAlign: 'right' }} />
 <span style={{ paddingRight: '12px', fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.65rem', color: 'var(--text-sub)', fontWeight: '500' }}>kg</span>
 </div>
 </div>
 <div>
 <label style={{ fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.5rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--text-sub)', marginBottom: '4px', display: 'block' }}>Dimensiones</label>
 <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
 <input type="number" id="dimL" placeholder="Largo" min="0" step={1} style={{ flex: '1', padding: '10px 4px', border: '1px solid #E5E0D8', borderRadius: '2px', fontFamily: '\'IBM Plex Sans\',sans-serif', fontSize: '.75rem', textAlign: 'center', outline: 'none', background: 'transparent' }} />
 <span style={{ color: 'var(--text-dim)', fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.65rem' }}>×</span>
 <input type="number" id="dimW" placeholder="Ancho" min="0" step={1} style={{ flex: '1', padding: '10px 4px', border: '1px solid #E5E0D8', borderRadius: '2px', fontFamily: '\'IBM Plex Sans\',sans-serif', fontSize: '.75rem', textAlign: 'center', outline: 'none', background: 'transparent' }} />
 <span style={{ color: 'var(--text-dim)', fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.65rem' }}>×</span>
 <input type="number" id="dimH" placeholder="Alto" min="0" step={1} style={{ flex: '1', padding: '10px 4px', border: '1px solid #E5E0D8', borderRadius: '2px', fontFamily: '\'IBM Plex Sans\',sans-serif', fontSize: '.75rem', textAlign: 'center', outline: 'none', background: 'transparent' }} />
 <span style={{ fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.65rem', color: 'var(--text-dim)', fontWeight: '500', paddingLeft: '4px' }}>cm</span>
 </div>
 </div>
 </div>
 </div>

 
 <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
 <button type="button" className="submit-btn" style={{ flex: '1' }}>
 <i className="fas fa-eye"></i> Vista previa
 </button>
 <button type="submit" className="submit-btn" id="submitBtn" style={{ flex: '2' }}>
 <i className="fas fa-cloud-upload-alt"></i> Publicar
 </button>
 </div>

 </form>

 
 <div className="preview-modal" id="previewModal">
 <div className="preview-content">
 <div className="preview-header">
 <button className="preview-back"><i className="fas fa-arrow-left"></i></button>
 <span className="preview-title">Vista previa</span>
 <span></span>
 </div>
 <div className="preview-body">
 <div className="preview-image" id="previewImage" style={{ background: '#2D2D2D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
 <i className="fas fa-guitar" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.2)' }}></i>
 </div>
 <div className="preview-info">
 <div className="preview-price" id="previewPrice">€0</div>
 <h3 className="preview-name" id="previewName">Título del artículo</h3>
 <div className="preview-meta">
 <span id="previewCondition">Como nuevo</span> · <span id="previewCategory">Categoría</span>
 </div>
 <p className="preview-desc" id="previewDesc">Descripción del artículo...</p>
 </div>
 </div>
 <div className="preview-actions">
 <button className="preview-btn">Editar</button>
 <button className="preview-btn preview-btn--primary"><i className="fas fa-check"></i> Publicar</button>
 </div>
 </div>
 </div>

 
 <div className="success-overlay" id="successOverlay">
 <div className="check"><i className="fas fa-check"></i></div>
 <h2>Artículo publicado</h2>
 <p>Ya está disponible en el catálogo</p>
 <button style={{ marginTop: '12px', padding: '12px 24px', fontFamily: '\'IBM Plex Mono\',monospace', fontSize: '.6rem', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '.1em', background: '#1C1915', color: '#F9F7F2', border: '1px solid #1C1915', borderRadius: '2px', cursor: 'pointer' }}>
 <i className="fas fa-search"></i> Ver en catálogo
 </button>
 </div>

 
 <nav className="bottom-nav">
 <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
 <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
 <Link to="/subir" className="nav-item nav-add active"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
 <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
 <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
 </nav>

 

 
 <div className="help-modal-overlay" id="helpModal">
 <div className="help-modal">
 <div className="help-modal__header">
 <span className="help-modal__title">Subir artículo</span>
 <button className="help-modal__close"><i className="fas fa-times"></i></button>
 </div>
 <div className="help-modal__body">
 <div className="help-step">
 <div className="help-step__num">1</div>
 <div className="help-step__text"><strong>Haz fotos</strong> del artículo que quieres intercambiar. Sube hasta 8 imágenes y hasta 4 vídeos cortos.</div>
 </div>
 <div className="help-step">
 <div className="help-step__num">2</div>
 <div className="help-step__text"><strong>Describe tu artículo</strong> con título, categoría, estado y precio. Cuanta más información, más posibilidades de match.</div>
 </div>
 <div className="help-step">
 <div className="help-step__num">3</div>
 <div className="help-step__text"><strong>Publícalo</strong>. Tu artículo se convierte en tu moneda de cambio: úsalo para conseguir lo que quieras mediante intercambio.</div>
 </div>
 </div>
 </div>
 </div>
    </>
  );
}

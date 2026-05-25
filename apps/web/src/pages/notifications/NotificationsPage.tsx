import { Link } from "react-router-dom";


export function NotificationsPage() {
  return (
    <>
      <div className="treqe-header">
    <div className="treqe-header__left">
      <button className="treqe-header__back"  aria-label="Atras"><i className="fas fa-chevron-left"></i></button>
      <span className="treqe-header__title">Avisos</span>
    </div>
    <div className="treqe-header__right">
      
    </div>
  </div>


<div className="notif-list">

  <div className="notif-header">
    <span className="notif-header__badge"><i className="fas fa-circle"></i> 9 avisos</span>
    <span className="notif-header__date">hoy</span>
  </div>

  
  <div className="notif-item notif-item--highlight">
    <div className="notif-item__body">
      <div className="notif-item__title">Solicitud de trueque enviada</div>
      <div className="notif-item__text">Has solicitado un trueque por iPhone 15 Pro. Te notificaremos cuando sea posible hacer el intercambio.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Ahora · <span className="status status--pending">Pendiente</span></div>
    </div>
    <button className="notif-item__btn" >Ver</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Carlos quiere tu Fender Stratocaster</div>
      <div className="notif-item__text">Ha ofrecido su MacBook Air M3 + 300€. El algoritmo busca completar el círculo. Te avisaremos cuando haya match.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 10 min · <span className="status">En espera</span></div>
    </div>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">El iPhone 15 Pro que guardaste bajó de precio</div>
      <div className="notif-item__text">Ahora cuesta 820€ (antes 890€). Sigue disponible para compra directa o intercambio.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 2 h</div>
    </div>
    <button className="notif-item__btn" >Ver</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Match #TRX-7841 cancelado</div>
      <div className="notif-item__text">Bruno rechazó el intercambio. Tu Casco Shoei NXR2 vuelve a estar disponible para nuevos matches.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 1 h · <span className="status status--done">Artículo liberado</span></div>
    </div>
    <button className="notif-item__btn" >Ver</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Nuevo artículo: Nintendo Switch OLED</div>
      <div className="notif-item__text">Coincide con tu búsqueda guardada "consolas". Ya puedes pedirlo por 280€ o solicitar trueque.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 3 h</div>
    </div>
    <button className="notif-item__btn" >Ver</button>
  </div>

  
  <div className="notif-item notif-item--highlight">
    <div className="notif-item__body">
      <div className="notif-item__title">¡Match encontrado! #TRX-7892</div>
      <div className="notif-item__text">Círculo de 3 personas listo. Tu G-SHOCK Mudmaster → AirPods Max. Tienes 24h para aceptar.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 5 h · <span className="status status--pending">Quedan 19h 23min</span></div>
    </div>
    <button className="notif-item__btn" >Aceptar</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Recuerda enviar tu artículo</div>
      <div className="notif-item__text">Match #TRX-7845 activo. Tienes 48h para enviar tu Trek Marlin 7. El comprador ya ha pagado.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 6 h · <span className="status status--pending">Quedan 42h</span></div>
    </div>
    <button className="notif-item__btn" >Enviar</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Valora tu experiencia</div>
      <div className="notif-item__text">Has recibido la PlayStation 5 de María. Ayuda a la comunidad valorando el intercambio.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Hace 8 h</div>
    </div>
    <button className="notif-item__btn" >Valorar</button>
  </div>

  
  <div className="notif-item">
    <div className="notif-item__body">
      <div className="notif-item__title">Bienvenido a treqe</div>
      <div className="notif-item__text">Tu perfil está verificado. Ya puedes publicar artículos y empezar a intercambiar con la comunidad.</div>
      <div className="notif-item__meta"><i className="far fa-clock"></i> Ayer</div>
    </div>
  </div>

</div>


<div className="footer">&copy; 2026 treqe</div>


<nav className="bottom-nav">
  <Link  to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
  <Link  to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
  <Link  to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
  <Link  to="/avisos" className="nav-item active"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
  <Link  to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
</nav>




</html>
    </>
  );
}

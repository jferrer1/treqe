export function rewriteMibLinks(html: string): string {
  const map: Record<string,string> = {
    "../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",
    "../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v5-onboarding/":"/onboarding",
    "../v8-ajustes/":"/ajustes","../v9-splash/":"/splash","../v10-registro/":"/registro",
    "../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes","../v13-blog/":"/blog","../v13-blog/index.html":"/blog","/blogindex.html":"/blog","../blogindex.html":"/blog",
    "../v13-favoritos/":"/favoritos","../v14-editar-perfil/":"/perfil/editar",
    "../v15-verificar-identidad/":"/perfil/verificar","../v16-portada/":"/",
    "../v17-mis-solicitudes/":"/mis-solicitudes","../v17-aviso-legal/":"/legal/aviso",
    "../v18-privacidad/":"/legal/privacidad","../v19-terminos/":"/legal/terminos",
    "../v20-cookies/":"/legal/cookies","../v21-pagos-escrow/":"/legal/pagos",
    "../v22-envios-costes/":"/legal/envios","../v23-pago/":"/pago/demo/demo",
    "../v24-disputa/":"/disputa/demo/demo","../v25-direccion-envio/":"/perfil/direccion",
    "../v26-metodos-pago/":"/perfil/pagos","../v27-faq/":"/faq",
    "../v28-contactar/":"/contactar","../v29-eliminar-cuenta/":"/perfil/eliminar",
    "../v30-sobre-treqe/":"/sobre"
  };
  for (const [mib, spa] of Object.entries(map)) {
    html = html.split(mib).join(spa);
  }
  return html;
}

import { useEffect, useState } from "react";

export function CatalogPage() {
  const [html, setHtml] = useState("");
  useEffect(() => { fetch("/catalogo.html").then(r => r.text()).then(setHtml); }, []);
  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"sans-serif",color:"#999"}}>Cargando catálogo...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

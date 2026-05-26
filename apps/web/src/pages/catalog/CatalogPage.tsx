import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product } from "@/lib/api";

const BG_COLORS = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A","#1A1A3A","#3A3A2A","#1A2A1A","#2D1A2A","#3A3A3A","#2A1A1A","#1A2A2A","#2D2A3A","#3A2D1A","#1A1A1A","#2A3D2A","#3A1A3A","#1A3D3A","#2D2A1A","#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A"];

function condLabel(c: string) {
  const m: Record<string,string> = { like_new: "Como nuevo", good: "Buen estado", new: "Nuevo", fair: "Aceptable" };
  return m[c] || c;
}

export function CatalogPage() {
  const [html, setHtml] = useState("");

  // Load the MIB HTML template (without products)
  useEffect(() => {
    fetch("/catalogo.html").then(r => r.text()).then(raw => {
      // Extract just the <style> + body without the script
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const style = sm ? `<style>${sm[1]}</style>` : "";
      let body = bm ? bm[1] : "";
      // Remove loading script
      body = body.replace(/<script[\s\S]*?<\/script>/g, "");
      body = body.replace(/\s+on\w+="[^"]*"/g, "");
      // Remove hardcoded product cards (keep only catalog div structure)
      body = body.replace(/<div class="catalog"[\s\S]*?<div id="pagingSentinel"/, '<div class="catalog" id="catalog"><div id="pagingSentinel"');
      setHtml(style + body);
    });
  }, []);

  // Load real products from API
  const { data } = useQuery({
    queryKey: ["catalog-products"],
    queryFn: () => api.get<{ items: Product[]; total: number }>("/api/products/?limit=70"),
  });

  // Inject products into DOM after render
  useEffect(() => {
    if (!data?.items?.length) return;
    const catalog = document.getElementById("catalog");
    if (!catalog) return;
    catalog.innerHTML = data.items.map((p, i) => {
      const bg = BG_COLORS[i % BG_COLORS.length];
      const title = `${p.title} · ${condLabel(p.condition)}`;
      return `<div class="item-card" onclick="window.location.href='/articulo/${p.id}'">
        <div class="item-card__image" style="background:${bg}">
        <button class="like-btn" onclick="event.stopPropagation();this.classList.toggle('liked')"><i class="far fa-heart"></i></button>
        <i class="fas fa-box placeholder-icon white"></i>
        <span class="price-tag">€${p.price}</span>
        <button class="trade-btn" onclick="event.stopPropagation();window.location.href='/subir?offer_for=${p.id}'"><i class="fas fa-exchange-alt"></i></button>
        </div>
        <div class="item-card__info"><div class="item-card__title">${title}</div></div>
      </div>`;
    }).join("");
    const count = document.getElementById("articleCount");
    if (count) count.textContent = `${data.items.length} artículos`;
  }, [data]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"sans-serif",color:"#999"}}>Cargando catálogo...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

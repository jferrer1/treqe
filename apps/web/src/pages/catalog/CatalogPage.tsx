import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Product {
  id: string; title: string; price: number; emoji: string;
  condition?: string; images?: string[];
}

const BG = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A",
  "#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A",
  "#2A2A1A","#2A3A1A","#3A1A2A","#1A1A3A","#3A3A2A"];

const cl = (c: string) => ({ like_new:"Como nuevo",good:"Buen estado",new:"Nuevo",fair:"Aceptable" } as Record<string,string>)[c] || c;

export function CatalogPage() {
  const [html, setHtml] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/mib/v1-catalogo.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Re-add back button
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/products/?limit=70");
        setProducts((res.items || res || []).slice(0, 70));
      } catch { /* no API */ }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!html || !loaded) return;
    // Update counter
    const counter = document.querySelector(".section-title span");
    if (counter) counter.textContent = `${products.length} art\u00EDculos`;
    // Grid
    const grid = document.querySelector(".catalog");
    if (!grid) return;
    if (products.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;text-align:center;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">
        <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.3"></i>
        No hay art\u00EDculos todav\u00EDa
      </div>`;
    } else {
      grid.innerHTML = products.map((p, i) => `
        <a href="/articulo/${p.id}" class="item-card">
          <div class="item-card__image" style="background:${BG[i % BG.length]}">
            <button class="like-btn" onclick="event.preventDefault();event.stopPropagation()"><i class="far fa-heart"></i></button>
            <i class="fas fa-box placeholder-icon white"></i>
            <span class="price-tag">&euro;${p.price}</span>
            <button class="trade-btn" onclick="event.preventDefault();event.stopPropagation()"><i class="fas fa-exchange-alt"></i></button>
          </div>
          <div class="item-card__info">
            <div class="item-card__title">${p.title} &middot; ${cl(p.condition || "")}</div>
          </div>
        </a>
      `).join("");
    }
  }, [html, loaded, products]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

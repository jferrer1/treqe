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

// Pure DOM sort — no React state
function sortDOM(type: string) {
  const grid = document.querySelector(".catalog");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(".item-card"));
  if (type === "price-asc") cards.sort((a, b) => getPrice(a) - getPrice(b));
  else if (type === "price-desc") cards.sort((a, b) => getPrice(b) - getPrice(a));
  else if (type === "name") cards.sort((a, b) => getTitle(a).localeCompare(getTitle(b)));
  cards.forEach(c => grid.appendChild(c));
}
function getPrice(el: Element): number {
  const t = el.querySelector(".price-tag")?.textContent || "0";
  return parseFloat(t.replace(/[^0-9,.]/g, "").replace(",", ".")) || 0;
}
function getTitle(el: Element): string {
  return el.querySelector(".item-card__title")?.textContent || "";
}

function applyFilterDOM() {
  const sel = (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "";
  const cards = document.querySelectorAll(".item-card");
  cards.forEach((c: any) => { c.style.display = sel && c.dataset.category !== sel ? "none" : "" });
  // Show/hide chip
  const ex = document.getElementById("filter-chip");
  if (ex) ex.remove();
  if (sel) {
    const tb = document.querySelector(".toolbar");
    if (tb) {
      const ch = document.createElement("div");
      ch.id = "filter-chip";
      ch.style.cssText = "display:inline-flex;align-items:center;gap:6px;padding:4px 10px;margin:4px 8px;background:var(--text);color:var(--bg);font-family:var(--font-mono);font-size:.5rem;text-transform:uppercase;letter-spacing:.06em";
      const onclickX = `this.parentElement.remove();document.querySelectorAll('.item-card').forEach(c=>c.style.display='');var s=document.getElementById('categorySelect');if(s)s.value='';`;
      ch.innerHTML = `${sel} <span style="cursor:pointer;margin-left:2px" onclick="${onclickX}">\u00D7</span>`;
      tb.after(ch);
    }
  }
  document.getElementById("filterModal")?.classList.remove("visible");
}

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
      // Add back filter button + modal close (AFTER strip)
      b = b.replace(/class="tool-btn"/, 'class="tool-btn" onclick="document.getElementById(\'filterModal\').classList.add(\'visible\')"');
      b = b.replace('id="filterModal"', 'id="filterModal" onclick="if(event.target===this)this.classList.remove(\'visible\')"');
      // Make close X button in modal work
      b = b.replace(/<button[^>]*><i class="fas fa-times"><\/i><\/button>/g, '<button onclick="document.getElementById(\'filterModal\').classList.remove(\'visible\')"><i class="fas fa-times"></i></button>');
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Rewrite MIB links to SPA routes
      const routeMap: Record<string,string> = {
        "../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",
        "../v3-subir/":"/subir","../v4-perfil/":"/perfil",
        "../v8-ajustes/":"/ajustes","../v11-notificaciones/":"/avisos",
        "../v12-mis-matches/":"/treqes","../v13-blog/":"/blog",
        "../v13-favoritos/":"/favoritos"
      };
      for (const [mib, spa] of Object.entries(routeMap)) {
        b = b.split(mib).join(spa);
      }
      // Pre-replace hardcoded MIB values to prevent flash
      b = b.replace(/>70 art[^<]*</, ">0 art\u00EDculos<");
      b = b.replace(/<div id="pagingSentinel">[^<]*<\/div>/, '<div id="products-placeholder"></div>');
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

  // Wire sort + filter using direct DOM manipulation
  useEffect(() => {
    if (!html) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Sort dropdown toggle
      const sortBtn = target.closest(".sort-wrapper .tool-btn");
      if (sortBtn) {
        e.stopPropagation();
        const dd = document.getElementById("sortDropdown");
        if (dd) dd.style.display = dd.style.display === "block" ? "none" : "block";
        return;
      }
      // Sort option click — DOM sort
      const sortOpt = target.closest(".sort-option");
      if (sortOpt) {
        e.stopPropagation();
        document.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active"));
        sortOpt.classList.add("active");
        const sb = (sortOpt as HTMLElement).dataset.sort;
        if (sb) sortDOM(sb);
        document.getElementById("sortDropdown")!.style.display = "none";
        return;
      }
      // Apply filters
      const btn = target.closest("button");
      if (btn) {
        const txt = (btn as HTMLElement).textContent || "";
        if (txt.includes("plicar") || txt.includes("Aplicar")) {
          e.stopPropagation();
          applyFilterDOM();
          return;
        }
      }
      // Close sort dropdown on outside click
      if (!target.closest(".sort-wrapper")) {
        const dd = document.getElementById("sortDropdown");
        if (dd) dd.style.display = "none";
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [html]);

  // Inject product data
  useEffect(() => {
    if (!html || !loaded) return;
    let att = 0;
    const iv = setInterval(() => {
      const counter = document.querySelector(".section-title span");
      const grid = document.querySelector(".catalog");
      if (!counter && !grid && att < 15) { att++; return; }
      clearInterval(iv);
      if (counter) counter.textContent = `${products.length} art\u00EDculos`;
      if (grid) {
        if (products.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;text-align:center;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">
            <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:12px;opacity:.3"></i>
            No hay art\u00EDculos todav\u00EDa
          </div>`;
        } else {
          grid.innerHTML = products.map((p, i) => `
            <a href="/articulo/${p.id}" class="item-card" data-category="${(p as any).category || ""}">
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
      }
      att++;
    }, 200);
    return () => clearInterval(iv);
  }, [html, loaded, products]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import "@/lib/search";

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
  const activePrice = document.querySelector(".filter-quick-btn.active") as HTMLElement | null;
  const activeCond = document.querySelector("#filterModal .filter-chip.active") as HTMLElement | null;
  const cards = document.querySelectorAll(".item-card");
  
  let minPrice = 0, maxPrice = Infinity;
  if (activePrice) {
    const txt = activePrice.textContent?.trim() || '';
    if (txt.startsWith('Hasta')) { minPrice = 0; maxPrice = parseFloat(txt.replace(/[^0-9]/g,'')) || 50; }
    else if (txt.startsWith('+')) { minPrice = parseFloat(txt.replace(/[^0-9]/g,'')) || 500; maxPrice = Infinity; }
    else { const parts = txt.split('-').map(s => parseFloat(s.replace(/[^0-9]/g,'')) || 0); minPrice = parts[0] || 0; maxPrice = parts[1] || Infinity; }
  }
  const condFilter = activeCond?.dataset.condition || "";
  
  cards.forEach((c: any) => {
    const cat = c.dataset.category || "";
    const price = getPrice(c);
    const cond = c.dataset.condition || "";
    const catMatch = !sel || cat === sel;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const condMatch = !condFilter || condFilter === "any" || cond === condFilter;
    c.style.display = catMatch && priceMatch && condMatch ? "" : "none";
  });
  // Show/hide chips
  const chipsDiv = document.getElementById("active-filters");
  if (chipsDiv) chipsDiv.remove();
  const activeFilters: string[] = [];
  if (sel) activeFilters.push(sel);
  const priceLabel = activePrice?.textContent?.trim();
  if (priceLabel) activeFilters.push(priceLabel);
  const condLabel = activeCond?.textContent?.trim();
  if (condLabel && condLabel !== "Cualquiera") activeFilters.push(condLabel);
  
  if (activeFilters.length > 0) {
    const tb = document.querySelector(".toolbar");
    if (tb) {
      const container = document.createElement("div");
      container.id = "active-filters";
      container.style.cssText = "display:block;width:100%;padding:8px 0 4px;flex-wrap:wrap25;flex-wrap:wrap25;align-items:center";
      activeFilters.forEach(label => {
        const ch = document.createElement("div");
        ch.style.cssText = "display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:var(--text);color:var(--bg);font-family:var(--font-mono);font-size:.5rem;text-transform:uppercase;letter-spacing:.06em";
        ch.innerHTML = `${label} <span style="cursor:pointer;margin-left:2px">\u00D7</span>`;
        (ch.querySelector("span") as HTMLElement).addEventListener("click", () => {
          const cards = document.querySelectorAll(".item-card");
          cards.forEach((c: any) => { c.style.display = "" });
          ch.remove();
          const remaining = document.querySelectorAll("#active-filters > div");
          if (remaining.length === 0) {
            container.remove();
            (document.getElementById("categorySelect") as HTMLSelectElement).value = "";
            document.querySelectorAll(".filter-quick-btn").forEach((b: any) => b.classList.remove("active"));
            document.querySelectorAll("#filterModal .filter-chip").forEach((b: any) => b.classList.remove("active"));
            document.querySelector("#filterModal .filter-chip[data-condition=any]")?.classList.add("active");
          }
        });
        container.appendChild(ch);
      });
      const sectionTitle = document.querySelector(".toolbar");
      if (sectionTitle) { sectionTitle.after(container);
      const updateChipPos = () => {
        const grid = document.querySelector(".catalog");
        if (grid) {
          const gs = window.getComputedStyle(grid);
          container.style.paddingLeft = (grid.getBoundingClientRect().left + parseFloat(gs.paddingLeft || "0")) + "px";
        }
      };
      updateChipPos();
      window.addEventListener("resize", updateChipPos);
    }
      else { const tb = document.querySelector(".toolbar"); if (tb) { tb.after(container); tb.after(container); } }
    }
  }
  document.getElementById("filterModal")?.classList.remove("visible");
}

// MIB subcategory mapping
const SUBCATEGORIES: Record<string,string[]> = {
  electronica: ["Móviles","Portátiles","Tablets","Cámaras","Audio","Consolas","Accesorios","TV y Proyectores","Smartwatches","Componentes PC","Periféricos"],
  moda: ["Ropa hombre","Ropa mujer","Zapatos","Bolsos","Relojes","Joyería","Vintage","Accesorios","Belleza"],
  deporte: ["Bicicletas","Fitness","Running","Natación","Fútbol","Padel","Camping","Montaña y Ski","Baloncesto","Golf","Yoga","Pesas","Patines"],
  musica: ["Guitarras","Baterías","Teclados","Vinilos","Equipos DJ","Instrumentos viento","Micrófonos","Partituras"],
  hogar: ["Muebles","Decoración","Electrodomésticos","Jardín","Bricolaje","Lámparas","Cocina","Baño","Textiles","Mascotas","Calefacción"],
  libros: ["Novelas","Cómics","Académicos","Infantil","Idiomas","Arte","Revistas","Ensayo"],
  motor: ["Coches","Motos","Recambios coche","Recambios moto","GPS","Herramientas","Neumáticos","Accesorios"],
  inmuebles: ["Pisos","Casas","Garajes","Locales","Terrenos","Oficinas","Habitaciones"],
  bicicletas: ["Bicis montaña","Bicis carretera","Bicis eléctricas","Cascos","Componentes","Accesorios","Ropa ciclismo"],
  electrodomesticos: ["Cocina","Lavandería","Climatización","Pequeño electro","Aspiradoras","Recambios"],
  bebes: ["Ropa bebé","Juguetes","Carritos","Sillas coche","Cunas","Alimentación","Seguridad","Maternidad"],
  coleccionismo: ["Antigüedades","Monedas","Sellos","Cromos","Figuras","Pósters","Postales"],
  construccion: ["Puertas","Ventanas","Suelos","Pintura","Ferretería","Andamios","Electricidad","Baños"],
  industria: ["Agricultura","Maquinaria","Herramientas","Recambios","Tractores"],
  empleo: ["Ofertas empleo","Busco empleo"],
  servicios: ["Clases","Limpieza","Mudanzas","Reparaciones","Canguros","Terapias","Fontanería","Electricista"],
  otros: ["Varios"]
};

export function CatalogPage() {
  const [html, setHtml] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/mib/v1-catalogo.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Add back filter button + modal close (AFTER strip)
      b = b.replace(/class="tool-btn"/, 'class="tool-btn" onclick="document.getElementById(\'filterModal\').classList.add(\'visible\')"');
      // Add data-min/max to price quick buttons
      b = b.replace(/onclick="setPriceRange\(0, 50[^)]*\)"/, 'data-min="0" data-max="50"');
      b = b.replace(/onclick="setPriceRange\(50, 200[^)]*\)"/, 'data-min="50" data-max="200"');
      b = b.replace(/onclick="setPriceRange\(200, 500[^)]*\)"/, 'data-min="200" data-max="500"');
      b = b.replace(/onclick="setPriceRange\(500[^)]*\)"/, 'data-min="500" data-max=""');
      b = b.replace('id="filterModal"', 'id="filterModal" onclick="if(event.target===this)this.classList.remove(\'visible\')"');
      // Make close X button in modal work
      // Only fix filter modal X button, not search-close
      b = b.replace(/(<div class="filter-modal__header">[^<]*)<button[^>]*><i class="fas fa-times"><\/i><\/button>/, '$1<button onclick="document.getElementById(\'filterModal\').classList.remove(\'visible\')"><i class="fas fa-times"></i></button>');
      // Wire search X button
      b = b.replace(/class="search-close"/g, 'class="search-close" onclick="event.stopPropagation();document.getElementById(\'searchExpand\').classList.remove(\'open\')"');
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Rewrite MIB links to SPA routes
      const routeMap: Record<string,string> = {
        "../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",
        "../v3-subir/":"/subir","../v4-perfil/":"/perfil",
        "../v8-ajustes/":"/ajustes","../v11-notificaciones/":"/avisos",
        "../v12-mis-matches/":"/treqes","../v13-blog/":"/blog","../v13-blog/index.html":"/blog","../blogindex.html":"/blog",
        "../v13-favoritos/":"/favoritos"
      };
      for (const [mib, spa] of Object.entries(routeMap)) {
        b = b.split(mib).join(spa);
      b = b.replace(/href="[^"]*blog[^"]*"/g, 'href="/blog"');
      b = b.replace("</style>", "</style>");
      }
      // Pre-replace hardcoded MIB values to prevent flash
      b = b.replace(/>70 art[^<]*</, ">0 art\u00EDculos<");
      b = b.replace(/<div id="pagingSentinel">[^<]*<\/div>/, '<div id="products-placeholder"></div>');
      s = s.replace("</style>", ".item-card{display:flex;flex-direction:column;height:100%}.item-card__info{flex:1;background:var(--bg)}</style>");
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
      // Search toggle
      if (target.closest("#searchIcon") || target.closest("#searchIcon *")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }
      // Search input
      if (target.closest("#searchInput")) { const v = (document.getElementById("searchInput") as HTMLInputElement).value.toLowerCase().trim(); document.querySelectorAll(".item-card").forEach((c: any) => { const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase(); c.style.display = !v || t.includes(v) ? "" : "none"; }); return; }
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
      // Quick price buttons in filter
      const priceBtn = target.closest(".filter-quick-btn");
      if (priceBtn) {
        e.stopPropagation();
        document.querySelectorAll(".filter-quick-btn").forEach((b: any) => b.classList.remove("active"));
        priceBtn.classList.add("active");
        return;
      }
      // Condition chips in filter
      const condChip = target.closest(".filter-chip");
      if (condChip && !condChip.closest("#filter-chip")) {
        e.stopPropagation();
        document.querySelectorAll("#filterModal .filter-chip").forEach((b: any) => b.classList.remove("active"));
        condChip.classList.add("active");
        return;
      }
      // Category select — show subcategories
      if ((target as HTMLElement).id === "categorySelect") {
        const subGroup = document.getElementById("subcategoryGroup");
        const subSelect = document.getElementById("subcategorySelect") as HTMLSelectElement;
        const val = (target as HTMLSelectElement).value;
        if (subGroup && subSelect && SUBCATEGORIES[val]) {
          subGroup.style.display = "block";
          subSelect.innerHTML = '<option value="">Todas</option>' + SUBCATEGORIES[val].map(s => `<option value="${s.toLowerCase().replace(/ /g,"-")}">${s}</option>`).join("");
        } else if (subGroup) {
          subGroup.style.display = "none";
        }
        return;
      }
      if (!target.closest(".sort-wrapper")) {
        const dd = document.getElementById("sortDropdown");
        if (dd) dd.style.display = "none";
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [html]);

  // Wire search
  useEffect(() => {
    if (!html) return;
    // Inject search CSS
    const style = document.createElement("style");
    style.textContent = `.search-expand{position:fixed!important;top:24px!important;right:16px!important;display:none!important;align-items:center;background:var(--bg);border:1px solid var(--border);z-index:9999;padding:0 8px;height:38px}.search-expand.open{display:flex!important}.search-expand input{border:none;font-family:inherit;font-size:.8rem;width:160px;background:transparent}`;
    document.body.appendChild(style);
    let tries = 0;
    const iv = setInterval(() => {
      const icon = document.getElementById("searchIcon");
      const input = document.getElementById("searchInput") as HTMLInputElement | null;
      if ((icon || input) && tries < 20) {
        clearInterval(iv);
        if (icon) {
          // Set expand position inline
          const expand = document.getElementById("searchExpand");
          if (expand) expand.style.cssText = "position:fixed;top:24px;right:16px;height:38px;display:none;align-items:center;background:var(--bg);border:1px solid var(--border);z-index:9999;padding:0 8px";
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const expand = document.getElementById("searchExpand");
            if (expand) { expand.classList.toggle("open"); if (expand.classList.contains("open")) input?.focus(); }
          });
        }
        if (input) {
          input.addEventListener("input", () => { (window as any).treqeSearch(input.value); });
        }
        // Wire X close button
        const closeBtn = document.querySelector(".search-close");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.getElementById("searchExpand")?.classList.remove("open");
          });
        }
      }
      tries++;
    }, 200);
    return () => clearInterval(iv);
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
            <a href="/articulo/${p.id}" class="item-card" data-category="${(p as any).category || ""}" data-condition="${p.condition || ""}">
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

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import "@/lib/search";

interface Product {
  id: string; title: string; price: number; emoji: string;
  condition?: string; images?: string[]; photos?: string[];
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
  
  const selLower = sel.toLowerCase();
  cards.forEach((c: any) => {
    const cat = (c.dataset.category || "").toLowerCase();
    const price = getPrice(c);
    const cond = c.dataset.condition || "";
    const catMatch = !selLower || cat === selLower;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const condMatch = !condFilter || condFilter === "any" || cond === condFilter;
    c.style.setProperty("display", catMatch && priceMatch && condMatch ? "" : "none", "important");
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

const BASE = import.meta.env.BASE_URL;

export function CatalogPage() {
  const [html, setHtml] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const initialRenderDone = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const htmlPushed = useRef(false);

  useEffect(() => {
    fetch(`${BASE}mib/v1-catalogo.html`).then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Wire filter button + modal close
      b = b.replace(/class="tool-btn"/, 'class="tool-btn" onclick="document.getElementById(\'filterModal\').classList.add(\'visible\')"');
      b = b.replace('id="filterModal"', 'id="filterModal" onclick="if(event.target===this)this.classList.remove(\'visible\')"');
      // Make close X button in modal work
      // Only fix filter modal X button, not search-close
      b = b.replace(/(<div class="filter-modal__header">[^<]*)<button[^>]*><i class="fas fa-times"><\/i><\/button>/, '$1<button onclick="document.getElementById(\'filterModal\').classList.remove(\'visible\')"><i class="fas fa-times"></i></button>');
      // Wire search X button
      b = b.replace(/class="search-close"/g, 'class="search-close" onclick="event.stopPropagation();document.getElementById(\'searchExpand\').classList.remove(\'open\')"');
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, `src="${BASE}treqe-logo.png"`);
      b = b.replace(/src="\/treqe-logo\.png"/g, `src="${BASE}treqe-logo.png"`);
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
      s = s.replace("</style>", ".item-card{display:flex;flex-direction:column;height:100%}.item-card__info{flex:1;background:var(--bg)}.search-expand{top:59%;right:45px!important}.trade-btn.offered i{color:#E74C3C!important}</style>");
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/products/?limit=70");
        setProducts((res.items || res || []).slice(0, 10));
        (window as any).__treqeOffset = 10;
        (window as any).__treqeTotal = res.total || 0;
        (window as any).__treqeLoading = false;
        // Fetch user's offers to highlight offered products
        try { const offers: any = await api.get("/api/offers/mine"); (window as any).__treqeOfferedIds = new Set((offers.items||[]).map((o:any)=>o.product_id_wants)); } catch { (window as any).__treqeOfferedIds = new Set(); }
        // Global highlight function
        (window as any).highlightOffered = () => {
          const offered = (window as any).__treqeOfferedIds as Set<string>;
          if (!offered || offered.size === 0) return;
          document.querySelectorAll('.trade-btn').forEach((btn: any) => {
            const card = btn.closest('.item-card');
            if (!card) return;
            const href = card.getAttribute('href') || '';
            const pid = href.split('/').pop() || '';
            if (offered.has(pid)) btn.classList.add('offered');
          });
        };
      } catch { /* no API */ }
      setLoaded(true);
    })();
  }, []);

  // Wire sort + filter using direct DOM manipulation
  useEffect(() => {
    if (!html) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Search toggle (handled by wire search useEffect, keep only toggle logic)
      if (target.closest("#searchIcon") || target.closest("#searchIcon *")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }
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
    // Clean stale inline styles from previous code
    const expand = document.getElementById("searchExpand");
    if (expand) expand.removeAttribute("style");
    let tries = 0;
    const iv = setInterval(() => {
      const icon = document.getElementById("searchIcon");
      const input = document.getElementById("searchInput") as HTMLInputElement | null;
      if ((icon || input) && tries < 20) {
        clearInterval(iv);
        // Clean stale inline styles
        const expand = document.getElementById("searchExpand");
        if (expand) { expand.style.cssText = ""; }
        if (icon) {
          icon.addEventListener("click", (e) => {
            e.stopPropagation();
            const expand = document.getElementById("searchExpand");
            if (expand) {
              expand.classList.toggle("open");
              if (expand.classList.contains("open")) input?.focus();
            }
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

  // Inject product data — only full render once, scroll appends via DOM
  useEffect(() => {
    if (!html || !loaded || initialRenderDone.current) return;
    let att = 0;
    const iv = setInterval(() => {
      const counter = document.querySelector(".section-title span");
      const grid = document.querySelector(".catalog");
      if (!counter && !grid && att < 15) { att++; return; }
      clearInterval(iv);
      const total = (window as any).__treqeTotal || products.length;
      if (counter) counter.textContent = `${total} art\u00EDculos`;
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
        initialRenderDone.current = true;
        // Highlight products already offered on
        setTimeout(() => (window as any).highlightOffered?.(), 100);
      }
      att++;
    }, 200);
    return () => clearInterval(iv);
  }, [html, loaded]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if ((window as any).__treqeLoading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        (window as any).__treqeLoading = true;
        const offset = (window as any).__treqeOffset || 0;
        const total = (window as any).__treqeTotal || 0;
        if (offset >= total) return;
        api.get(`/api/products/?limit=10&offset=${offset}`).then((res: any) => {
          const newItems = (res.items || res || []);
          if (newItems.length === 0) return;
          (window as any).__treqeOffset = offset + newItems.length;
          setProducts((prev: Product[]) => {
            const updated = [...prev, ...newItems];
            const grid = document.querySelector(".catalog");
            if (grid) {
              const existing = grid.querySelectorAll(".item-card").length;
              const html = newItems.map((p: Product, i: number) => {
                const idx = existing + i;
                const img = p.photos?.[0] || p.images?.[0];
                return `<a href="/articulo/${p.id}" class="item-card" data-category="${(p as any).category || ""}" data-condition="${p.condition || ""}">
                  <div class="item-card__image" style="background:${BG[idx % BG.length]}">
                    <button class="like-btn" onclick="event.preventDefault();event.stopPropagation()"><i class="far fa-heart"></i></button>
                    ${img ? `<img src="${img}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />` : `<i class="fas fa-box placeholder-icon white"></i>`}
                    <span class="price-tag">&euro;${String(p.price).replace(".", ",")}</span>
                    <button class="trade-btn" onclick="event.preventDefault();event.stopPropagation()"><i class="fas fa-exchange-alt"></i></button>
                  </div>
                  <div class="item-card__info">
                    <div class="item-card__title">${p.title} &middot; ${cl(p.condition || "")}</div>
                  </div>
                </a>`;
              }).join("");
              grid.insertAdjacentHTML("beforeend", html);
              // Re-apply active sort if any
              const activeSort = document.querySelector(".sort-option.active") as HTMLElement | null;
              if (activeSort?.dataset.sort) sortDOM(activeSort.dataset.sort);
              // Re-apply search filter if active
              const si = document.getElementById("searchInput") as HTMLInputElement | null;
              if (si?.value && (window as any).treqeSearch) (window as any).treqeSearch(si.value);
              // Highlight offered products too
              setTimeout(() => (window as any).highlightOffered?.(), 50);
            }
            return updated;
          });
          (window as any).__treqeLoading = false;
        }).catch(() => { (window as any).__treqeLoading = false; });
      }
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Push HTML to DOM once via ref — never reset by React re-renders
  useEffect(() => {
    if (containerRef.current && html && !htmlPushed.current) {
      containerRef.current.innerHTML = html;
      htmlPushed.current = true;
    }
  }, [html]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div ref={containerRef} />;
}

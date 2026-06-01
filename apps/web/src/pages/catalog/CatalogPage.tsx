import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface Product {
  id: string; title: string; price: number; emoji: string;
  condition?: string; images?: string[]; photos?: string[];
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
      // Add back filter button + modal close (AFTER strip)
      b = b.replace(/class="tool-btn"/, 'class="tool-btn" onclick="document.getElementById(\'filterModal\').classList.add(\'visible\')"');
      b = b.replace('id="filterModal"', 'id="filterModal" onclick="if(event.target===this)this.classList.remove(\'visible\')"');
      // Make close X button in modal work
      b = b.replace(/<button[^>]*><i class="fas fa-times"><\/i><\/button>/g, '<button onclick="document.getElementById(\'filterModal\').classList.remove(\'visible\')"><i class="fas fa-times"></i></button>');
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      b = rewriteMibLinks(b);
      // Pre-replace hardcoded MIB values to prevent flash
      b = b.replace(/>70 art[^<]*</, ">0 art\u00EDculos<");
      b = b.replace(/<div id="pagingSentinel">[^<]*<\/div>/, '<div id="products-placeholder"></div>');
      // Add back sort dropdown toggle (AFTER strip)
      b = b.replace(/<div class="sort-wrapper">/, '<div class="sort-wrapper" style="position:relative">');
      b = b.replace(/class="sort-dropdown" id="sortDropdown"/, 'class="sort-dropdown" id="sortDropdown" style="display:none"');
      // Wire sort dropdown via event delegation in JS
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

  // Wire interactive elements after DOM is ready
  useEffect(() => {
    if (!html) return;
    // Sort dropdown toggle
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      const sortBtn = target.closest(".sort-wrapper .tool-btn");
      if (sortBtn) {
        e.stopPropagation();
        const dropdown = document.getElementById("sortDropdown");
        if (dropdown) {
          dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        }
        return;
      }
      const sortOption = target.closest(".sort-option");
      if (sortOption) {
        e.stopPropagation();
        document.querySelectorAll(".sort-option").forEach(o => o.classList.remove("active"));
        sortOption.classList.add("active");
        const sortBy = (sortOption as HTMLElement).dataset.sort;
        if (sortBy) sortAndRender(sortBy);
        document.getElementById("sortDropdown")!.style.display = "none";
        return;
      }
      // Close filter modal on Apply
      const applyBtn = target.closest("button");
      const text2 = (applyBtn as HTMLElement)?.textContent || "";
      if (text2.includes("plicar") || text2.includes("Aplicar")) {
        e.stopPropagation();
        document.getElementById("filterModal")?.classList.remove("visible");
        return;
      }
      // Close dropdown when clicking outside
      if (!target.closest(".sort-wrapper")) {
        const dd = document.getElementById("sortDropdown");
        if (dd) dd.style.display = "none";
      }
    });
  }, [html]);

  // Sort products and re-render
  const sortAndRender = (type: string) => {
    const sorted = [...products];
    if (type === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (type === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else if (type === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
    // relevance = default order
    setProducts(sorted);
  };

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
          grid.innerHTML = products.map((p, i) => {
            const imgUrl = p.photos?.[0] || p.images?.[0] || "";
            return `
            <a href="/articulo/${p.id}" class="item-card">
              <div class="item-card__image" style="background:${BG[i % BG.length]}">
                <button class="like-btn" onclick="event.preventDefault();event.stopPropagation();var i=this.querySelector('i');var liked=i.classList.contains('fas');if(liked){i.classList.remove('fas');i.classList.add('far');this.classList.remove('liked')}else{i.classList.remove('far');i.classList.add('fas');this.classList.add('liked')}"><i class="far fa-heart"></i></button>
                ${imgUrl 
                  ? `<img src="${imgUrl}" style="position:absolute;inset:0;width:100%25;height:100%25;object-fit:cover" />`
                  : `<i class="fas fa-box placeholder-icon white"></i>`
                }
                <span class="price-tag">&euro;${String(p.price).replace(".", ",")}</span>
                <button class="trade-btn" onclick="event.preventDefault();event.stopPropagation();window.location.href=this.closest('a').getAttribute('href')+'?trade=open'"><i class="fas fa-exchange-alt"></i></button>
              </div>
              <div class="item-card__info">
                <div class="item-card__title">${p.title} &middot; ${cl(p.condition || "")}</div>
              </div>
            </a>
          `}).join("");
        }
      }
      att++;
    }, 200);
    return () => clearInterval(iv);
  }, [html, loaded, products]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

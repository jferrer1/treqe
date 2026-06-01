import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface ProductDetail {
  id: string; title: string; description: string | null;
  price: number; category: string; condition: string;
  photos: string[]; status: string; created_at: string;
  user_id?: string; owner?: { name: string; location?: string; reputation?: number };
}

const CONDITIONS: Record<string, string> = {
  new: "Nuevo", like_new: "Como nuevo", good: "Buen estado", fair: "Aceptable"
};

const BG = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A"];
function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); }

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const hasToken = !!localStorage.getItem("treqe-token");

  // Load MIB HTML
  useEffect(() => {
    fetch("/mib/v2-detalle.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      b = rewriteMibLinks(b);
      setHtml(s + b);
    });
  }, []);

  // Fetch product
  useEffect(() => {
    if (!id || id === "demo") return;
    (async () => {
      try {
        const p: any = await api.get(`/api/products/${id}`);
        setProduct(p);
      } catch { /* keep MIB demo */ }
    })();
  }, [id]);

  // Inject data into DOM
  useEffect(() => {
    if (!html || !product) return;
    let att = 0;
    const iv = setInterval(() => {
      const titleEl = document.querySelector(".product-title, h1");
      if (!titleEl && att < 15) { att++; return; }
      clearInterval(iv);

      // Replace the hardcoded gallery slides with product photos
      if (product.photos?.length) {
        const slidesContainer = document.getElementById("gallerySlides");
        const dotsContainer = document.querySelector(".gallery-dots");
        const thumbsContainer = document.querySelector(".gallery-thumbs");
        
        if (slidesContainer) {
          let current = 0;
          const photos = product.photos;
          
          const goToSlide = (n: number) => {
            slidesContainer.querySelectorAll(".gallery-slide").forEach((s, i) => s.classList.toggle("active", i === n));
            dotsContainer?.querySelectorAll("span").forEach((d, i) => d.classList.toggle("active", i === n));
            thumbsContainer?.querySelectorAll(".gallery-thumb").forEach((t, i) => t.classList.toggle("active", i === n));
            current = n;
          };

          // Build slides
          slidesContainer.innerHTML = photos.map((p, i) => 
            `<div class="gallery-slide${i === 0 ? " active" : ""}" style="background:${BG[hash(String(i)) % BG.length]}">
              <img src="${p}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />
            </div>`
          ).join("");

          // Build dots
          if (dotsContainer) {
            dotsContainer.innerHTML = photos.map((_, i) => 
              `<span class="${i === 0 ? "active" : ""}" style="cursor:pointer;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,0.35);display:inline-block;margin:0 3px;transition:all .3s"></span>`
            ).join("");
            dotsContainer.querySelectorAll("span").forEach((d, i) => d.addEventListener("click", () => goToSlide(i)));
          }

          // Build thumbs
          if (thumbsContainer) {
            thumbsContainer.innerHTML = photos.map((p, i) =>
              `<div class="gallery-thumb${i === 0 ? " active" : ""}" style="cursor:pointer;width:48px;height:48px;border:1px solid var(--border);flex-shrink:0">
                <img src="${p}" style="width:100%;height:100%;object-fit:cover" />
                <span class="thumb-label" style="position:absolute;bottom:1px;right:4px;font-family:var(--font-mono);font-size:.5rem;color:var(--text-dim)">${i + 1}</span>
              </div>`
            ).join("");
            thumbsContainer.querySelectorAll(".gallery-thumb").forEach((t, i) => t.addEventListener("click", () => goToSlide(i)));
          }

          // Add left/right arrows
          const gallery = document.getElementById("gallery");
          if (gallery) {
            gallery.style.position = "relative";
            // Left arrow
            const left = document.createElement("button");
            left.innerHTML = '<i class="fas fa-chevron-left"></i>';
            left.style.cssText = "position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem;color:#1C1915";
            left.addEventListener("click", (e) => { e.stopPropagation(); goToSlide((current - 1 + photos.length) % photos.length); });
            // Right arrow
            const right = document.createElement("button");
            right.innerHTML = '<i class="fas fa-chevron-right"></i>';
            right.style.cssText = "position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.8rem;color:#1C1915";
            right.addEventListener("click", (e) => { e.stopPropagation(); goToSlide((current + 1) % photos.length); });
            gallery.appendChild(left);
            gallery.appendChild(right);

            // Swipe support
            let startX = 0;
            gallery.addEventListener("touchstart", (e) => { startX = (e as TouchEvent).touches[0].clientX; });
            gallery.addEventListener("touchend", (e) => {
              const diff = startX - (e as TouchEvent).changedTouches[0].clientX;
              if (Math.abs(diff) > 50) goToSlide((current + (diff > 0 ? 1 : -1) + photos.length) % photos.length);
            });
          }
        }
      }
      // Also update other product info
      const titleTextEl = document.querySelector(".product-title, h1");
      if (titleTextEl) titleTextEl.textContent = product.title;
      // Price
      const priceEl = document.querySelector(".product-price, [class*='price']");
      if (priceEl) priceEl.innerHTML = `\u20AC${String(product.price).replace(".", ",")}`;
      // Condition
      const condEl = document.querySelector("[class*='condition'], .product-condition");
      if (condEl) condEl.textContent = CONDITIONS[product.condition] || product.condition;
      // Description
      const descEl = document.querySelector(".product-description, [class*='description']");
      if (descEl && product.description) descEl.textContent = product.description;
      // Photos
      if (product.photos?.length) {
        const imgContainer = document.querySelector("[class*='image'], .product-image, .detail-image") as HTMLElement;
        if (imgContainer) {
          imgContainer.innerHTML = `<img src="${product.photos[0]}" style="width:100%;height:100%;object-fit:cover" />`;
        }
      }
      // Seller
      const sellerEl = document.querySelector("[class*='seller'], [class*='owner'], [class*='user']");
      if (sellerEl && product.owner?.name) {
        sellerEl.textContent = product.owner.name;
      }
    }, 200);
    return () => clearInterval(iv);
  }, [html, product]);

  // Wire buy/trade buttons
  useEffect(() => {
    if (!html) return;
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const text = btn.textContent || "";
      if (text.includes("COMPRAR") || text.includes("Comprar") || text.includes("comprar") ||
          text.includes("INTERCAMBIO") || text.includes("Intercambio") || text.includes("intercambiar") ||
          text.includes("Quiero") || text.includes("OFERTA")) {
        e.preventDefault(); e.stopPropagation();
        if (!hasToken) { navigate("/login"); return; }
        // Future: open purchase/trade flow
        alert(`Funcionalidad de ${text.includes("COMPRAR") || text.includes("comprar") ? "compra" : "intercambio"} en desarrollo`);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [html, hasToken, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";
import { TradeModal } from "@/components/match/TradeModal";
import { PurchaseModal } from "@/components/payment/PurchaseModal";

const BASE = import.meta.env.BASE_URL;

interface ProductDetail {
  id: string; title: string; description: string | null;
  price: number; category: string; condition: string;
  photos: string[]; status: string; weight: number | null;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => {
    (async () => {
      let productData: ProductDetail | null = null;
      if (id && id !== "demo") {
        try { productData = await api.get(`/api/products/${id}`); } catch {}
      }
      setProduct(productData);
      const raw = await fetch(`${BASE}mib/v2-detalle.html`).then(r => r.text());
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let style = sm ? `<style>${sm[1]}</style>` : "";
      let body = bm ? bm[1] : "";

      const photos = productData?.photos?.length ? productData.photos : [];

      // Clean scripts and onclicks
      body = body.replace(/<script[\s\S]*?<\/script>/g, "");
      body = body.replace(/\s+on\w+="[^"]*"/g, "");

      // Replace gallery — always use new gallery (with placeholders if no photos)
      const gs = body.indexOf('<div class="gallery" id="gallery">');
      const info = body.indexOf('<div class="item-info"');
      if (gs >= 0 && info > gs) {
        body = body.substring(0, gs) + buildGallery(photos) + body.substring(info);
      }

      // Back button
      body = body.replace(/(<button class="back-btn")/, '$1 onclick="window.location.hash=&apos;#/catalogo&apos;"');

      // Product data
      if (productData) {
        body = body.replace(/€[0-9,.]+/g, `\u20AC${String(productData.price).replace(".", ",")}`);
        body = body.replace(/Fender Stratocaster/g, productData.title);
      }

      body = rewriteMibLinks(body);
      // Always fix gallery: no scrollbars
      style += `<style>
.gallery{overflow:hidden!important;cursor:default!important}
.gallery-slides{overflow:hidden!important}
.gallery::-webkit-scrollbar,.gallery-slides::-webkit-scrollbar{display:none}
.gallery-thumbs::-webkit-scrollbar{display:none}
.gallery-thumbs{-ms-overflow-style:none;scrollbar-width:none}
</style>`;
      // Ensure back arrow is always visible (template may hide it on desktop)
      style += "<style>.detail-header{display:flex!important}</style>";
      setHtml(style + body);
    })();
  }, [id]);

  // Register gallery navigation functions on window (innerHTML scripts don't execute)
  useEffect(() => {
    (window as any).goToSlide = (i: number) => {
      const g = document.getElementById('gallery');
      if (!g) return;
      g.dataset.slide = String(i);
      g.querySelectorAll('.gallery-slide').forEach((s: any, n: number) => s.classList.toggle('active', n === i));
      g.querySelectorAll('.gallery-dot').forEach((d: any, n: number) => d.classList.toggle('active', n === i));
      document.querySelectorAll('.gallery-thumb').forEach((t: any, n: number) => t.classList.toggle('active', n === i));
    };
    (window as any).openGalleryModal = (i: number) => {
      const m = document.getElementById('galleryModal');
      if (!m) return;
      m.style.display = 'flex';
      m.dataset.slide = String(i);
      m.querySelectorAll('.gallery-modal-slide').forEach((s: any, n: number) => s.classList.toggle('active', n === i));
      m.querySelectorAll('.gallery-modal-thumb').forEach((t: any, n: number) => t.classList.toggle('active', n === i));
      document.body.style.overflow = 'hidden';
    };
    (window as any).closeGalleryModal = (e?: MouseEvent) => {
      if (e && e.target !== document.getElementById('galleryModal')) return;
      const m = document.getElementById('galleryModal');
      if (m) { m.style.display = 'none'; }
      document.body.style.overflow = '';
    };
    (window as any).goToModalSlide = (i: number) => {
      const m = document.getElementById('galleryModal');
      if (!m) return;
      m.dataset.slide = String(i);
      m.querySelectorAll('.gallery-modal-slide').forEach((s: any, n: number) => s.classList.toggle('active', n === i));
      m.querySelectorAll('.gallery-modal-thumb').forEach((t: any, n: number) => t.classList.toggle('active', n === i));
    };
    (window as any).modalPrev = () => {
      const m = document.getElementById('galleryModal');
      if (!m) return;
      const i = parseInt(m.dataset.slide || '0');
      const slides = m.querySelectorAll('.gallery-modal-slide');
      const next = (i - 1 + slides.length) % slides.length;
      (window as any).goToModalSlide(next);
    };
    (window as any).modalNext = () => {
      const m = document.getElementById('galleryModal');
      if (!m) return;
      const i = parseInt(m.dataset.slide || '0');
      const slides = m.querySelectorAll('.gallery-modal-slide');
      const next = (i + 1) % slides.length;
      (window as any).goToModalSlide(next);
    };
  }, []);

  // Auth guard + trade/compra handler
  useEffect(() => {
    if (!html) return;
    if (window.location.search.includes('trade=open')) {
      setTimeout(() => {
        const btn = Array.from(document.querySelectorAll('button')).find(b => /trueque|intercambio|solicitar/i.test(b.textContent||''));
        if (btn) { btn.scrollIntoView({behavior:'smooth',block:'center'}); btn.click(); }
      }, 1000);
    }
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const text = btn.textContent || "";
      if (/Comprar|COMPRAR|comprar|Solicitar|Trueque|TRUECASE|trueque|Intercambio|intercambio|INTERCAMBIO|consulta/.test(text)) {
        e.preventDefault(); e.stopPropagation();
        if (!hasToken) { navigate("/login"); return; }
        if (/consulta/i.test(text)) {
          alert("Consulta enviada (demo)");
          return;
        }
        // Trade → show trade modal
        if (/trueque|intercambio|solicitar/i.test(text)) {
          document.querySelector('.gallery-trade')?.classList.toggle('requested');
          setTradeOpen(true);
          return;
        }
        // Purchase → show purchase modal
        setPurchaseOpen(true);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [html, hasToken, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return (
    <>
      {tradeOpen && (
        <TradeModal
          wantedProductId={id || ""}
          wantedTitle={product?.title || "este artículo"}
          wantedPrice={product?.price || 0}
          onClose={() => {
            setTradeOpen(false);
            document.querySelector('.gallery-trade')?.classList.remove('requested');
          }}
        />
      )}
      {purchaseOpen && (
        <PurchaseModal
          productTitle={product?.title || "este artículo"}
          productPrice={product?.price || 0}
          productId={id || ""}
          productWeight={product?.weight ?? null}
          onClose={() => setPurchaseOpen(false)}
        />
      )}
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}

function buildGallery(photos: string[]): string {
  const n = photos.length || 6; // 6 placeholder slides if no photos
  const placeholders = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A"];
  const icons = ["fa-guitar","fa-music","fa-play-circle","fa-camera","fa-headphones","fa-gamepad"];

  const slides = Array.from({length: n}, (_, i) => {
    if (photos[i]) {
      return `<div class="gallery-slide${i === 0 ? " active" : ""}" onclick="openGalleryModal(${i})">
        <img src="${photos[i]}" style="width:100%;height:100%;object-fit:contain;display:block" />
      </div>`;
    }
    return `<div class="gallery-slide${i === 0 ? " active" : ""}" onclick="openGalleryModal(${i})" style="background:${placeholders[i % 6]};display:flex;align-items:center;justify-content:center">
      <i class="fas ${icons[i % 6]}" style="font-size:4rem;color:rgba(255,255,255,.15)"></i>
    </div>`;
  }).join("");

  const dots = Array.from({length: n}, (_, i) =>
    `<span class="gallery-dot${i === 0 ? " active" : ""}" onclick="goToSlide(${i})"></span>`
  ).join("");

  const thumbs = Array.from({length: n}, (_, i) => {
    const img = photos[i] ? `<img src="${photos[i]}" style="width:100%;height:100%;object-fit:cover" />` : `<div style="width:100%;height:100%;background:${placeholders[i % 6]};display:flex;align-items:center;justify-content:center"><i class="fas ${icons[i % 6]}" style="font-size:.7rem;color:rgba(255,255,255,.3)"></i></div>`;
    return `<div class="gallery-thumb${i === 0 ? " active" : ""}" onclick="goToSlide(${i})" style="cursor:pointer;width:56px;height:56px;border:2px solid var(--border);flex-shrink:0;border-radius:4px;overflow:hidden">
      ${img}
    </div>`;
  }).join("");

  // Modal slides for fullscreen viewer
  const modalSlides = Array.from({length: n}, (_, i) => {
    const content = photos[i]
      ? `<img src="${photos[i]}" style="max-width:100%;max-height:100%;object-fit:contain" />`
      : `<div style="display:flex;align-items:center;justify-content:center;width:70vw;height:60vh;background:${placeholders[i % 6]};border-radius:4px"><i class="fas ${icons[i % 6]}" style="font-size:5rem;color:rgba(255,255,255,.15)"></i></div>`;
    return `<div class="gallery-modal-slide${i === 0 ? " active" : ""}" style="position:absolute;inset:80px 48px 120px;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;pointer-events:none">
      ${content}
    </div>`;
  }).join("");

  const modalThumbs = Array.from({length: n}, (_, i) => {
    const img = photos[i] ? `<img src="${photos[i]}" style="width:100%;height:100%;object-fit:cover" />` : `<div style="width:100%;height:100%;background:${placeholders[i % 6]}"></div>`;
    return `<div class="gallery-modal-thumb${i === 0 ? " active" : ""}" onclick="goToModalSlide(${i})" style="cursor:pointer;width:48px;height:48px;border:2px solid rgba(255,255,255,.25);flex-shrink:0;border-radius:4px;overflow:hidden">
      ${img}
    </div>`;
  }).join("");

  return `<style>
body{overflow-y:auto!important;overscroll-behavior:auto!important}
.gallery-slide{position:absolute;inset:0;opacity:0;transition:opacity .3s;cursor:zoom-in}
.gallery-slide.active{opacity:1}
.gallery-dot{cursor:pointer;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);display:inline-block;margin:0 3px;transition:all .3s}
.gallery-dot.active{width:18px;background:#FFF}
.gallery-thumb.active{border-color:#1C1915!important}
.gallery-wish.liked{color:#E74C3C!important}
.gallery-trade.requested{background:#1C1915!important;color:#F9F7F2!important;border-color:#1C1915!important}
.gallery-wish{width:40px;height:40px;background:rgba(255,255,255,0.9);border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer;color:var(--text-dim)}
.gallery-modal-slide.active{opacity:1;pointer-events:auto}
.gallery-modal-thumb.active{border-color:#FFF!important}
@media(min-width:1024px){.detail-header{display:flex!important}.detail-layout{display:block!important}.gallery{max-width:500px;margin:0 auto}}
/* Hide scrollbars on thumb strip */
.gallery-thumbs::-webkit-scrollbar{display:none}
.gallery-thumbs{-ms-overflow-style:none;scrollbar-width:none}
</style>

<div style="max-width:500px;margin:0 auto">
<div class="gallery" id="gallery" style="position:relative;overflow:hidden;aspect-ratio:1;background:#111;border-radius:2px">
  <div class="gallery-slides" id="gallerySlides" style="position:relative;width:100%;height:100%">${slides}</div>
  <div class="gallery-dots" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10">${dots}</div>
  <button class="gallery-wish" onclick="var i=this.querySelector('i');var liked=i.classList.contains('fas');if(liked){i.classList.remove('fas');i.classList.add('far');this.classList.remove('liked')}else{i.classList.remove('far');i.classList.add('fas');this.classList.add('liked')}" style="position:absolute;bottom:12px;right:12px;z-index:10"><i class="far fa-heart"></i></button>
  <button class="gallery-trade" onclick="this.classList.toggle('requested');var btn=Array.from(document.querySelectorAll('button')).find(function(b){return /trueque|intercambio|solicitar/i.test(b.textContent)});if(btn){btn.scrollIntoView({behavior:'smooth',block:'center'});btn.click()}" style="position:absolute;bottom:12px;left:12px;z-index:10;width:40px;height:40px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.3);color:#FFF;display:flex;align-items:center;justify-content:center;font-size:.85rem;cursor:pointer"><i class="fas fa-exchange-alt"></i></button>
  <button type="button" onclick="var i=parseInt(document.getElementById('gallery').dataset.slide||0);i=(i-1+${n})%${n};goToSlide(i)" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:20;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15)"><i class="fas fa-chevron-left" style="font-size:1rem"></i></button>
  <button type="button" onclick="var i=parseInt(document.getElementById('gallery').dataset.slide||0);i=(i+1)%${n};goToSlide(i)" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:20;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.9);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15)"><i class="fas fa-chevron-right" style="font-size:1rem"></i></button>
</div>
<div style="display:flex;gap:8px;padding:10px 0;overflow-x:auto" class="gallery-thumbs">${thumbs}</div>
</div>

<!-- Fullscreen modal -->
<div id="galleryModal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,.95);z-index:999;flex-direction:column" onclick="closeGalleryModal(event)">
  <button onclick="closeGalleryModal()" style="position:absolute;top:16px;right:16px;z-index:1000;width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#FFF;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.2rem"><i class="fas fa-times"></i></button>
  <button onclick="modalPrev();event.stopPropagation()" style="position:absolute;left:8px;top:50%;transform:translateY(-50%);z-index:1000;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#FFF;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3rem"><i class="fas fa-chevron-left"></i></button>
  <button onclick="modalNext();event.stopPropagation()" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);z-index:1000;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.15);border:none;color:#FFF;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:1.3rem"><i class="fas fa-chevron-right"></i></button>
  ${modalSlides}
  <div style="position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:1000;overflow-x:auto;max-width:90vw;padding:0 8px" class="gallery-modal-thumbs">${modalThumbs}</div>
</div>
<script>
window.goToSlide=function(i){var g=document.getElementById('gallery');g.dataset.slide=i;g.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});g.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===i)});document.querySelectorAll('.gallery-thumb').forEach(function(t,n){t.classList.toggle('active',n===i)})};
window.openGalleryModal=function(i){var m=document.getElementById('galleryModal');m.style.display='flex';m.dataset.slide=i;m.querySelectorAll('.gallery-modal-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});m.querySelectorAll('.gallery-modal-thumb').forEach(function(t,n){t.classList.toggle('active',n===i)});document.body.style.overflow='hidden'};
window.closeGalleryModal=function(e){if(e&&e.target!==document.getElementById('galleryModal'))return;var m=document.getElementById('galleryModal');m.style.display='none';document.body.style.overflow=''};
window.goToModalSlide=function(i){var m=document.getElementById('galleryModal');m.dataset.slide=i;m.querySelectorAll('.gallery-modal-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});m.querySelectorAll('.gallery-modal-thumb').forEach(function(t,n){t.classList.toggle('active',n===i)})};
window.modalPrev=function(){var m=document.getElementById('galleryModal');var i=parseInt(m.dataset.slide||0);i=(i-1+${n})%${n};goToModalSlide(i)};
window.modalNext=function(){var m=document.getElementById('galleryModal');var i=parseInt(m.dataset.slide||0);i=(i+1)%${n};goToModalSlide(i)};
</script>`;
}

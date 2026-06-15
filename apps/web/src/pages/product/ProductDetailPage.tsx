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

      // Replace gallery + wish/trade buttons
      if (photos.length > 0) {
        const gs = body.indexOf('<div class="gallery" id="gallery">');
        const info = body.indexOf('<div class="item-info"');
        if (gs >= 0 && info > gs) {
          body = body.substring(0, gs) + buildGallery(photos) + body.substring(info);
        }
      }

      // Back button
      body = body.replace(/(<button class="back-btn")/, '$1 onclick="window.location.hash=&apos;#/catalogo&apos;"');

      // Product data
      if (productData) {
        body = body.replace(/€[0-9,.]+/g, `\u20AC${String(productData.price).replace(".", ",")}`);
        body = body.replace(/Fender Stratocaster/g, productData.title);
      }

      body = rewriteMibLinks(body);
      // Ensure back arrow is always visible (template may hide it on desktop)
      style += "<style>.detail-header{display:flex!important}</style>";
      setHtml(style + body);
    })();
  }, [id]);

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
  const slides = photos.map((p, i) =>
    `<div class="gallery-slide${i === 0 ? " active" : ""}">
      <img src="${p}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />
    </div>`
  ).join("");

  const dots = photos.map((_, i) =>
    `<span class="gallery-dot${i === 0 ? " active" : ""}" onclick="var g=document.getElementById('gallery');g.dataset.slide=${i};g.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===${i})});this.parentElement.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===${i})});document.querySelectorAll('.gallery-thumb').forEach(function(t,n){t.classList.toggle('active',n===${i})})"></span>`
  ).join("");

  const thumbs = photos.map((p, i) =>
    `<div class="gallery-thumb${i === 0 ? " active" : ""}" onclick="var g=document.getElementById('gallery');g.dataset.slide=${i};g.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===${i})});document.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===${i})});document.querySelectorAll('.gallery-thumb').forEach(function(t,n){t.classList.toggle('active',n===${i})})" style="cursor:pointer;width:48px;height:48px;border:1px solid var(--border);flex-shrink:0">
      <img src="${p}" style="width:100%;height:100%;object-fit:cover" />
    </div>`
  ).join("");

  return `<style>body{overflow-y:auto!important;overscroll-behavior:auto!important}.gallery-slide{position:absolute;inset:0;opacity:0;transition:opacity .3s}.gallery-slide.active{opacity:1}.gallery-dot{cursor:pointer;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);display:inline-block;margin:0 3px;transition:all .3s}.gallery-dot.active{width:18px;background:#FFF}.gallery-thumb.active{border-color:#1C1915!important}.gallery-wish.liked{color:#E74C3C!important}.gallery-trade.requested{background:#1C1915!important;color:#F9F7F2!important;border-color:#1C1915!important}.gallery-wish{width:40px;height:40px;background:rgba(255,255,255,0.9);border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer;color:var(--text-dim)}@media(min-width:1024px){.detail-header{display:flex!important}.detail-layout{display:block!important}.gallery{max-width:500px;margin:0 auto}}</style><div style="max-width:500px;margin:0 auto"><div class="gallery" id="gallery" style="position:relative;overflow:hidden;aspect-ratio:1">
    <div class="gallery-slides" id="gallerySlides" style="position:relative;width:100%;height:100%;overflow:hidden">${slides}</div>
    <div class="gallery-dots" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10">${dots}</div>
    <button class="gallery-wish" onclick="var i=this.querySelector('i');var liked=i.classList.contains('fas');if(liked){i.classList.remove('fas');i.classList.add('far');this.classList.remove('liked')}else{i.classList.remove('far');i.classList.add('fas');this.classList.add('liked')}" style="position:absolute;bottom:12px;right:12px;z-index:10"><i class="far fa-heart"></i></button>
    <button class="gallery-trade" onclick="this.classList.toggle('requested');var btn=Array.from(document.querySelectorAll('button')).find(function(b){return /trueque|intercambio|solicitar/i.test(b.textContent)});if(btn){btn.scrollIntoView({behavior:'smooth',block:'center'});btn.click()}" style="position:absolute;bottom:12px;left:12px;z-index:10;width:40px;height:40px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.3);color:#FFF;display:flex;align-items:center;justify-content:center;font-size:.85rem;cursor:pointer"><i class="fas fa-exchange-alt"></i></button>
    <button type="button" onclick="var i=parseInt(this.parentElement.dataset.slide||0);i=(i-1+${photos.length})%${photos.length};this.parentElement.dataset.slide=i;this.parentElement.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});this.parentElement.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===i)});var t=document.querySelectorAll('.gallery-thumb');t.forEach(function(x,n){x.classList.toggle('active',n===i)});event.stopPropagation()" style="position:absolute;left:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer"><i class="fas fa-chevron-left"></i></button>
    <button type="button" onclick="var i=parseInt(this.parentElement.dataset.slide||0);i=(i+1)%${photos.length};this.parentElement.dataset.slide=i;this.parentElement.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});this.parentElement.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===i)});var t=document.querySelectorAll('.gallery-thumb');t.forEach(function(x,n){x.classList.toggle('active',n===i)});event.stopPropagation()" style="position:absolute;right:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer"><i class="fas fa-chevron-right"></i></button>
  </div>
  <div style="display:flex;gap:6px;padding:8px 16px;overflow-x:auto;background:var(--bg)" class="gallery-thumbs">${thumbs}</div>
  </div>`;
}

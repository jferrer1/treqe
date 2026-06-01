import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface ProductDetail {
  id: string; title: string; description: string | null;
  price: number; category: string; condition: string;
  photos: string[]; status: string;
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => {
    (async () => {
      let product: ProductDetail | null = null;
      if (id && id !== "demo") {
        try { product = await api.get(`/api/products/${id}`); } catch {}
      }
      const raw = await fetch("/mib/v2-detalle.html").then(r => r.text());
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const style = sm ? `<style>${sm[1]}</style>` : "";
      let body = bm ? bm[1] : "";

      const photos = product?.photos?.length ? product.photos : [];

      // Clean scripts and onclicks
      body = body.replace(/<script[\s\S]*?<\/script>/g, "");
      body = body.replace(/\s+on\w+="[^"]*"/g, "");

      // Replace gallery + wish/trade buttons (everything before item-info)
      if (photos.length > 0) {
        const gs = body.indexOf('<div class="gallery" id="gallery">');
        const info = body.indexOf('<div class="item-info"');
        if (gs >= 0 && info > gs) {
          body = body.substring(0, gs) + buildGallery(photos) + body.substring(info);
        }
      }

      // Back button — navigate to catalog
      body = body.replace(/(<button class="back-btn")/, '$1 onclick="window.location.href=&quot;/catalogo&quot;"');

      // Product data
      if (product) {
        body = body.replace(/€[0-9,.]+/g, `\u20AC${String(product.price).replace(".", ",")}`);
        body = body.replace(/Fender Stratocaster/g, product.title);
      }

      body = rewriteMibLinks(body);
      setHtml(style + body);
    })();
  }, [id]);

  // Auth guard
  useEffect(() => {
    if (!html) return;
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const text = btn.textContent || "";
      if (/COMPRAR|comprar|INTERCAMBIO|intercambiar|TRUEQUE|trueque/.test(text)) {
        e.preventDefault(); e.stopPropagation();
        if (!hasToken) { navigate("/login"); return; }
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [html, hasToken, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function buildGallery(photos: string[]): string {
  const slides = photos.map((p, i) =>
    `<div class="gallery-slide${i === 0 ? " active" : ""}">
      <img src="${p}" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" />
    </div>`
  ).join("");

  const dots = photos.map((_, i) =>
    `<span class="gallery-dot${i === 0 ? " active" : ""}" onclick="TreG.goTo(${i})"></span>`
  ).join("");

  const thumbs = photos.map((p, i) =>
    `<div class="gallery-thumb${i === 0 ? " active" : ""}" onclick="TreG.goTo(${i})">
      <img src="${p}" style="width:100%;height:100%;object-fit:cover" />
    </div>`
  ).join("");

  return `<style>.gallery-slide{position:absolute;inset:0;opacity:0;transition:opacity .3s}.gallery-slide.active{opacity:1}.gallery-dot{cursor:pointer;width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35);display:inline-block;margin:0 3px;transition:all .3s}.gallery-dot.active{width:18px;background:#FFF}.gallery-thumb.active{border-color:#1C1915!important}@media(min-width:1024px){.detail-header{display:flex!important}}</style><div class="gallery" id="gallery" style="position:relative;overflow:hidden;aspect-ratio:1">
    <div class="gallery-slides" id="gallerySlides" style="position:relative;width:100%;height:100%;overflow:hidden">${slides}</div>
    <div class="gallery-dots" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10">${dots}</div>
    <button class="gallery-wish" style="position:absolute;bottom:12px;right:12px;z-index:10;width:40px;height:40px;background:rgba(255,255,255,0.9);border:1px solid var(--border);color:var(--text-dim);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer"><i class="far fa-heart"></i></button>
    <button class="gallery-trade" style="position:absolute;bottom:12px;left:12px;z-index:10;width:40px;height:40px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.3);color:#FFF;display:flex;align-items:center;justify-content:center;font-size:.85rem;cursor:pointer"><i class="fas fa-exchange-alt"></i></button>
    <button type="button" onclick="var i=parseInt(this.parentElement.dataset.slide||0);i=(i-1+${photos.length})%${photos.length};this.parentElement.dataset.slide=i;this.parentElement.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});this.parentElement.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===i)});var t=this.parentElement.querySelectorAll('.gallery-thumb');t.forEach(function(x,n){x.classList.toggle('active',n===i)});event.stopPropagation()" style="position:absolute;left:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer"><i class="fas fa-chevron-left"></i></button>
    <button type="button" onclick="var i=parseInt(this.parentElement.dataset.slide||0);i=(i+1)%${photos.length};this.parentElement.dataset.slide=i;this.parentElement.querySelectorAll('.gallery-slide').forEach(function(s,n){s.classList.toggle('active',n===i)});this.parentElement.querySelectorAll('.gallery-dot').forEach(function(d,n){d.classList.toggle('active',n===i)});var t=this.parentElement.querySelectorAll('.gallery-thumb');t.forEach(function(x,n){x.classList.toggle('active',n===i)});event.stopPropagation()" style="position:absolute;right:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer"><i class="fas fa-chevron-right"></i></button>
    <div class="gallery-thumbs" style="display:flex;gap:6px;padding:8px 16px;overflow-x:auto;margin-top:4px">${thumbs}</div>
  </div>`;
}

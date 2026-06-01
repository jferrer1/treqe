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

      // Replace gallery — include wish + trade buttons
      if (photos.length > 0) {
        const gs = body.indexOf('<div class="gallery" id="gallery">');
        const after = body.indexOf('<button class="gallery-trade"');
        const info = body.indexOf('<div class="item-info"');
        const end = (after > gs ? after : 99999) < (info > gs ? info : 99999) ? after : info;
        if (gs >= 0 && end > gs) {
          body = body.substring(0, gs) + buildGallery(photos) + body.substring(end);
        }
      }

      // Back button
      body = body.replace(/(<button class="back-btn")/, '$1 onclick="window.history.back()"');

      // Product data
      if (product) {
        body = body.replace(/€[0-9,.]+/g, `\u20AC${String(product.price).replace(".", ",")}`);
        body = body.replace(/Fender Stratocaster/g, product.title);
      }

      body = rewriteMibLinks(body);
      setHtml(style + body);
    })();
  }, [id]);

  // Gallery controller on window
  useEffect(() => {
    if (!html) return;
    (window as any).TreG = {
      current: 0,
      goTo(n: number) {
        (window as any).TreG.current = n;
        document.querySelectorAll(".gallery-slide").forEach((s: any, i: number) => s.classList.toggle("active", i === n));
        document.querySelectorAll(".gallery-dot").forEach((d: any, i: number) => d.classList.toggle("active", i === n));
        document.querySelectorAll(".gallery-thumb").forEach((t: any, i: number) => {
          t.classList.toggle("active", i === n);
          try { t.scrollIntoView({ inline: "nearest", behavior: "smooth" }); } catch {}
        });
      }
    };
  }, [html]);

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

  return `<div class="gallery" id="gallery" style="position:relative;overflow:hidden">
    <div class="gallery-slides" id="gallerySlides" style="position:relative;overflow:hidden">${slides}</div>
    <div class="gallery-dots" style="position:absolute;bottom:14px;left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:10">${dots}</div>
    <button class="gallery-wish" id="wishBtn" style="position:absolute;bottom:12px;right:12px;z-index:10;width:40px;height:40px;background:rgba(255,255,255,0.9);border:1px solid var(--border);color:var(--text-dim);display:flex;align-items:center;justify-content:center;font-size:1rem;cursor:pointer"><i class="far fa-heart"></i></button>
    <button class="gallery-trade" id="tradeBtn" style="position:absolute;bottom:12px;left:12px;z-index:10;width:40px;height:40px;background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.3);color:#FFF;display:flex;align-items:center;justify-content:center;font-size:.85rem;cursor:pointer"><i class="fas fa-exchange-alt"></i></button>
    <button type="button" onclick="event.stopPropagation();TreG.goTo((TreG.current-1+${photos.length})%${photos.length})" style="position:absolute;left:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center"><i class="fas fa-chevron-left"></i></button>
    <button type="button" onclick="event.stopPropagation();TreG.goTo((TreG.current+1)%${photos.length})" style="position:absolute;right:8px;top:40%;transform:translateY(-50%);z-index:20;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.85);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center"><i class="fas fa-chevron-right"></i></button>
    <div class="gallery-thumbs" style="display:flex;gap:6px;padding:8px 16px;overflow-x:auto">${thumbs}</div>
  </div>`;
}

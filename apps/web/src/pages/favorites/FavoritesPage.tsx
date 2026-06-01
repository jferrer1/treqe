import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface FavoriteItem {
  id: string; title: string; price: number; photos?: string[];
  condition?: string;
}

const BG = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A"];

export function FavoritesPage() {
  const [html, setHtml] = useState("");
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => {
    fetch("/mib/v13-favoritos.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.location.href=&quot;/catalogo&quot;" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Replace MIB hardcoded items with placeholder
      const listStart = b.indexOf('<div class="my-items"');
      const bottomStart = b.indexOf('<nav class="bottom-nav"');
      if (listStart >= 0 && bottomStart > listStart) {
        b = b.substring(0, listStart) + '<div class="my-items" id="fav-items"></div>\n' + b.substring(bottomStart);
      }
      b = rewriteMibLinks(b);
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    if (!hasToken) return;
    (async () => {
      try {
        const res: any = await api.get("/api/favorites/");
        setItems(res.items || res || []);
      } catch {}
    })();
  }, [hasToken]);

  useEffect(() => {
    if (!html) return;
    let att = 0;
    const iv = setInterval(() => {
      const grid = document.getElementById("fav-items");
      if (!grid && att < 15) { att++; return; }
      clearInterval(iv);
      if (!grid) return;
      if (items.length === 0) {
        grid.innerHTML = `<div style="text-align:center;padding:60px 20px;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">
          <i class="fas fa-heart-broken" style="font-size:2rem;display:block;margin-bottom:16px;opacity:.3"></i>
          No tienes favoritos todavia
        </div>`;
      } else {
        grid.outerHTML = `<div class="my-items" id="fav-items">${items.map((p, i) => `
          <a href="/articulo/${p.id}" class="my-item">
            <div class="my-item__image my-item__image--liked" style="background:linear-gradient(135deg,${BG[i%6]},${BG[(i+1)%6]})!important">
              ${p.photos?.[0] ? `<img src="${p.photos[0]}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" />` : `<i class="fas fa-heart" style="color:rgba(255,255,255,0.3)"></i>`}
              <div class="my-item__overlay">${p.title}</div>
            </div>
            <div class="my-item__info">
              <div class="my-item__title">${p.title}</div>
              <div class="my-item__price">\u20AC${String(p.price).replace(".", ",")}</div>
            </div>
          </a>
        `).join("")}</div>`;
      }
    }, 200);
    return () => clearInterval(iv);
  }, [html, items]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  if (!hasToken) {
    const ctaHtml = html.replace(
      /<div class="my-items"[\s\S]*?(?=<nav class="bottom-nav")/,
      `<div class="my-items" style="text-align:center;padding:60px 20px">
        <div style="font-size:2rem;margin-bottom:12px;color:var(--text-dim)"><i class="fas fa-heart"></i></div>
        <h2 style="font-family:var(--font-sans);font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus favoritos te esperan</h2>
        <p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesion para ver tus articulos guardados</p>
        <button onclick="window.location.href='/login'" style="font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase">Iniciar sesion</button>
      </div>`
    );
    return <div dangerouslySetInnerHTML={{__html: ctaHtml}} />;
  }
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

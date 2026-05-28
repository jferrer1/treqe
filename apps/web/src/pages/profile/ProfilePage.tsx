import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

interface UserProfile {
  id: string; email: string; name: string;
  score: number; swaps: number; products: number; months: number;
  verified: boolean;
}

interface Product {
  id: string; title: string; price: number; emoji: string; color: string;
  status: "active" | "pending" | "accepted" | "rejected";
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuthStore();
  const [html, setHtml] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch MIB HTML
  useEffect(() => {
    fetch("/mib/v4-perfil.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      setHtml(s + b);
    });
  }, []);

  // Fetch user data
  useEffect(() => {
    if (!user || !html) return;
    (async () => {
      try {
        const p: any = await api.get("/api/users/me");
        const my: any = await api.get("/api/products/mine");
        const fav: any = await api.get("/api/favorites");
        setProfile({
          id: p.id, email: p.email, name: p.name || p.email.split("@")[0],
          score: p.score || 50, swaps: p.swaps_completed || 0,
          products: p.products_count || 0, months: p.months_active || 1,
          verified: p.verified || false
        });
        setMyProducts((my.products || my || []).slice(0, 6).map((x: any) => ({
          id: x.id, title: x.title, price: x.price, emoji: x.emoji || "📦",
          color: randomColor(x.id), status: x.status || "active"
        })));
        setLikedProducts((fav.products || fav || []).slice(0, 3).map((x: any) => ({
          id: x.id, title: x.title, price: x.price, emoji: x.emoji || "❤️",
          color: randomColor(x.id), status: "active"
        })));
      } catch { /* use defaults */ }
      setDataLoading(false);
    })();
  }, [user, html]);

  // Inject data into DOM + wire nav
  useEffect(() => {
    if (!html) return;
    const t = setTimeout(() => {
      // Auth links
      document.querySelectorAll(".profile-action, .profile-actions button").forEach(el => {
        el.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          if (!user) { navigate("/login"); return; }
          const text = (el as HTMLElement).textContent || "";
          if (text.includes("Editar")) navigate("/perfil/editar");
          if (text.includes("Verificar")) navigate("/perfil/verificar");
        });
      });

      // Nav buttons in section headers
      document.querySelectorAll(".section__action, .section__header button").forEach(el => {
        el.addEventListener("click", (e) => {
          e.preventDefault(); e.stopPropagation();
          if (!user) { navigate("/login"); return; }
          const text = (el as HTMLElement).textContent || "";
          if (text.includes("Ver todo") || text.includes("Ver todas")) navigate("/favoritos");
          if (text.includes("Añadir")) navigate("/subir");
        });
      });

      // Scoring modal buttons
      const scoringCard = document.querySelector(".scoring-card");
      const scoringInfoBtn = scoringCard?.querySelector("button");
      const scoringOverlay = document.getElementById("scoringModal");
      scoringInfoBtn?.addEventListener("click", (e) => { e.stopPropagation(); scoringOverlay?.classList.add("visible"); });
      scoringOverlay?.addEventListener("click", (e) => {
        if (e.target === scoringOverlay || (e.target as HTMLElement).classList.contains("scoring-modal__close")) scoringOverlay.classList.remove("visible");
      });
    }, 300);

    // Inject profile data into the DOM
    if (!dataLoading && profile) {
      const t2 = setTimeout(() => {
        // Score
        const scoreEl = document.querySelector(".scoring-card__score");
        if (scoreEl) scoreEl.innerHTML = `${profile.score} <small>/ 100</small>`;
        const fill = document.getElementById("scoreFill");
        if (fill) fill.style.width = `${profile.score}%`;
        // Stats
        const stats = document.querySelectorAll(".stat-card__number");
        if (stats[0]) stats[0].textContent = String(profile.swaps);
        if (stats[1]) stats[1].textContent = String(profile.products);
        if (stats[2]) stats[2].textContent = String(profile.months);
        // My products
        const mySection = Array.from(document.querySelectorAll(".section")).find(s => s.querySelector(".section__title")?.textContent?.includes("art") || s.querySelector(".section__title")?.textContent?.includes("Mis"));
        if (mySection && myProducts.length) injectProducts(mySection.querySelector(".my-items")!, myProducts);
        // Liked products
        const likedSection = Array.from(document.querySelectorAll(".section")).find(s => s.querySelector(".section__title")?.textContent?.includes("gustan"));
        if (likedSection && likedProducts.length) injectProducts(likedSection.querySelector(".my-items")!, likedProducts, true);
      }, 400);
      return () => clearTimeout(t2);
    }
    return () => clearTimeout(t);
  }, [html, user, profile, dataLoading, navigate]);

  // Loading / no-auth states
  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  if (!authLoading && !user) {
    return (
      <div style={{maxWidth:420, margin:"60px auto", padding:32, textAlign:"center", fontFamily:"var(--font-sans)"}}>
        <div style={{fontSize:"3rem",marginBottom:16}}>👤</div>
        <h2 style={{fontSize:"1.3rem",fontWeight:600,marginBottom:8}}>Tu perfil te espera</h2>
        <p style={{color:"#8A8580",fontSize:"0.85rem",marginBottom:24,lineHeight:1.5}}>Regístrate o inicia sesión para ver tu perfil, scoring y artículos.</p>
        <button onClick={() => navigate("/login")} style={{fontFamily:"var(--font-mono)",fontSize:"0.75rem",fontWeight:600,padding:"12px 32px",background:"#1C1915",color:"#F9F7F2",border:"none",cursor:"pointer"}}>Iniciar sesión</button>
        <button onClick={() => navigate("/registro")} style={{display:"block",margin:"12px auto 0",background:"none",border:"none",fontFamily:"var(--font-mono)",fontSize:"0.65rem",color:"#8A8580",cursor:"pointer",textDecoration:"underline"}}>Crear cuenta</button>
      </div>
    );
  }

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

const GRADIENTS = ["#1A3A2A,#2A5A3A","#2D2D2D,#4D4D4D","#3A2A1A,#5A3A2A","#1A2A3A,#2A3A5A","#2A1A2A,#4A2A4A","#3A3A1A,#5A5A2A"];
function randomColor(seed: string) { let h=0; for(let i=0;i<seed.length;i++) h=((h<<5)-h)+seed.charCodeAt(i); return GRADIENTS[Math.abs(h)%GRADIENTS.length]; }

function injectProducts(container: Element, products: Product[], asLiked = false) {
  container.innerHTML = products.map(p => `
    <div class="my-item" onclick="window.parent.location.href='/articulo/${p.id}'">
      <div class="${asLiked ? "my-item__image my-item__image--liked" : "my-item__image"}" style="${asLiked ? `background:linear-gradient(135deg,${p.color})!important` : ""}">
        <span class="my-item__emoji">${p.emoji}</span>
        ${asLiked ? `<div class="my-item__overlay">${p.title}</div>` : `<i class="fas fa-box"></i>`}
      </div>
      <div class="my-item__info">
        <div class="my-item__title">${p.title}</div>
        <div class="my-item__price">€${p.price}</div>
      </div>
      ${!asLiked ? `<span class="my-item__status ${p.status}">${statusLabel(p.status)}</span>` : ""}
    </div>
  `).join("");
}

function statusLabel(s: string): string {
  const m: Record<string,string> = { active: "Activo", pending: "Cambio", accepted: "Aceptado", rejected: "Rechazado" };
  return m[s] || s;
}

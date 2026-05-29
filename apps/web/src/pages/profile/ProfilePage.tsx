import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface Product {
  id: string; title: string; price: number; emoji: string; color: string;
  status: "active" | "pending" | "accepted" | "rejected";
}

interface UserProfile {
  id: string; email: string; name: string;
  score: number; swaps: number; products: number; months: number;
  verified: boolean;
}

const GRADIENTS = ["#1A3A2A,#2A5A3A","#2D2D2D,#4D4D4D","#3A2A1A,#5A3A2A","#1A2A3A,#2A3A5A","#2A1A2A,#4A2A4A","#3A3A1A,#5A5A2A"];

function randomColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h) + seed.charCodeAt(i);
  return GRADIENTS[Math.abs(h) % GRADIENTS.length];
}

function statusLabel(s: string): string {
  const m: Record<string, string> = { active: "Activo", pending: "Cambio", accepted: "Aceptado", rejected: "Rechazado" };
  return m[s] || s;
}

function renderProduct(p: Product, asLiked = false): string {
  return `<div class="my-item" onclick="window.location.href='/articulo/${p.id}'">
    <div class="${asLiked ? "my-item__image my-item__image--liked" : "my-item__image"}" style="${asLiked ? `background:linear-gradient(135deg,${p.color})!important` : ""}">
      <span class="my-item__emoji">${p.emoji}</span>
      ${asLiked ? `<div class="my-item__overlay">${p.title}</div>` : `<i class="fas fa-box"></i>`}
    </div>
    <div class="my-item__info">
      <div class="my-item__title">${p.title}</div>
      <div class="my-item__price">\u20AC${p.price}</div>
    </div>
    ${!asLiked ? `<span class="my-item__status ${p.status}">${statusLabel(p.status)}</span>` : ""}
  </div>`;
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [html, setHtml] = useState("");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [wired, setWired] = useState(false);

  // Fetch MIB HTML
  useEffect(() => {
    fetch("/mib/v4-perfil.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      // Replace specific MIB navigations BEFORE strip
      b = b.replace(/onclick="goToEditProfile\(\)"/g, 'data-nav="perfil/editar"');
      b = b.replace(/onclick="goToVerify\(\)"/g, 'data-nav="perfil/verificar"');
      b = b.replace(/onclick="goToUpload\(\)"/g, 'data-nav="subir"');
      b = b.replace(/onclick="goToFavorites\(\)"/g, 'data-nav="favoritos"');
      b = b.replace(/onclick="goToSettings\(\)"/g, 'data-nav="ajustes"');
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Re-add back button
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      // Restore dark mode toggle (stripped above)
      b = b.replace(/(<button class="dm-toggle")>Dark<\/button>/, '$1 onclick="document.body.classList.toggle(&quot;dark&quot;);localStorage.setItem(&quot;treqe-darkmode&quot;,document.body.classList.contains(&quot;dark&quot;))">Dark</button>');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      b = rewriteMibLinks(b);

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
          id: p.id, email: p.email, name: p.name || p.email?.split("@")[0] || "Usuario",
          score: p.score || 50, swaps: p.swaps_completed || 0,
          products: p.products_count || 0, months: p.months_active || 1,
          verified: p.verified || false
        });
        setMyProducts((my.products || my || []).slice(0, 6).map((x: any) => ({
          id: x.id, title: x.title, price: x.price, emoji: x.emoji || "\uD83D\uDCE6",
          color: randomColor(String(x.id)), status: x.status || "active"
        })));
        setLikedProducts((fav.products || fav || []).slice(0, 3).map((x: any) => ({
          id: x.id, title: x.title, price: x.price, emoji: x.emoji || "\u2764\uFE0F",
          color: randomColor(String(x.id)), status: "active"
        })));
      } catch { /* use defaults */ }
      setDataLoading(false);
    })();
  }, [user, html]);

  // Wire event handlers once HTML is in the DOM
  useEffect(() => {
    if (!html || wired) return;
    const check = () => {
      const btn = document.querySelector(".profile-action");
      if (!btn) { setTimeout(check, 200); return; }
      wireHandlers();
      setWired(true);
    };
    check();
  }, [html, wired]);

  // Inject real data into DOM
  useEffect(() => {
    if (!wired || dataLoading || !profile) return;
    const check = () => {
      const scoreEl = document.querySelector(".scoring-card__score");
      if (!scoreEl) { setTimeout(check, 200); return; }
      scoreEl.innerHTML = `${profile.score} <small>/ 100</small>`;
      const fill = document.getElementById("scoreFill");
      if (fill) fill.style.width = `${profile.score}%`;
      const stats = document.querySelectorAll(".stat-card__number");
      if (stats[0]) stats[0].textContent = String(profile.swaps);
      if (stats[1]) stats[1].textContent = String(profile.products);
      if (stats[2]) stats[2].textContent = String(profile.months);
      // Products
      const sections = document.querySelectorAll(".section");
      sections.forEach(sec => {
        const title = sec.querySelector(".section__title")?.textContent || "";
        const grid = sec.querySelector(".my-items") as HTMLElement;
        if (!grid) return;
        if (title.includes("Mis") || title.includes("art")) {
          if (myProducts.length) grid.innerHTML = myProducts.map(p => renderProduct(p)).join("");
        }
        if (title.includes("gustan")) {
          if (likedProducts.length) grid.innerHTML = likedProducts.map(p => renderProduct(p, true)).join("");
        }
      });
    };
    check();
  }, [wired, profile, dataLoading, myProducts, likedProducts]);

  function wireHandlers() {
    // Global click handler for data-nav buttons
    document.addEventListener("click", (e) => {
      const target = (e.target as HTMLElement).closest("[data-nav]") as HTMLElement | null;
      if (!target) return;
      e.preventDefault(); e.stopPropagation();
      const user = useAuthStore.getState().user;
      const token = localStorage.getItem("treqe-token");
      if (!user && !token) { navigate("/login"); return; }
      navigate("/" + target.dataset.nav);
    });

    // View-all / Add buttons in section headers
    document.querySelectorAll(".section__action, .section__header button").forEach(el => {
      (el as HTMLElement).addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const user = useAuthStore.getState().user;
        const token = localStorage.getItem("treqe-token");
        if (!user && !token) { navigate("/login"); return; }
        const text = (el as HTMLElement).textContent || "";
        if (text.includes("Ver todo") || text.includes("Ver todas")) navigate("/favoritos");
        if (text.includes("\u00F1adir") || text.includes("A\u00F1adir")) navigate("/subir");
      });
    });

    const scoringInfoBtn = document.querySelector(".scoring-card button");
    const scoringOverlay = document.getElementById("scoringModal");
    scoringInfoBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      scoringOverlay?.classList.add("visible");
    });
    scoringOverlay?.addEventListener("click", (e) => {
      const t = e.target as HTMLElement;
      if (e.target === scoringOverlay || t.classList.contains("scoring-modal__close") || t.closest(".scoring-modal__close")) {
        scoringOverlay.classList.remove("visible");
      }
    });
  }

  const hasToken = !!localStorage.getItem("treqe-token");

  // Loading
  if (!html) return <div style={{ padding: 60, textAlign: "center", fontFamily: "var(--font-sans)" }}>Cargando...</div>;

  // No auth — inject CTA into MIB HTML, keeping header + bottom nav
  if (!hasToken) {
    const ctaBlock = `<div class="profile-wrap" style="text-align:center;padding:40px 24px">
      <div style="font-size:2.2rem;margin-bottom:16px;color:var(--text-dim)"><i class="fas fa-user-circle"></i></div>
      <h2 style="font-family:var(--font-sans);font-size:1.15rem;font-weight:500;color:var(--text);margin-bottom:8px">Tu perfil te espera</h2>
      <p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:28px;line-height:1.5;text-transform:uppercase;letter-spacing:.08em">Reg\u00EDstrate o inicia sesi\u00F3n<br>para ver tu perfil, scoring y art\u00EDculos.</p>
      <button onclick="window.location.href='/login'" style="display:block;width:100%;max-width:320px;margin:0 auto 10px;font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:12px 24px;background:var(--text);color:var(--bg);border:1px solid var(--text);cursor:pointer;letter-spacing:.1em;text-transform:uppercase">Iniciar sesi\u00F3n <i class="fas fa-arrow-right" style="margin-left:6px"></i></button>
      <button onclick="window.location.href='/registro'" style="display:block;width:100%;max-width:320px;margin:0 auto;background:var(--bg);border:1px solid var(--border);font-family:var(--font-mono);font-size:.55rem;font-weight:400;color:var(--text-dim);cursor:pointer;padding:10px 24px;letter-spacing:.08em;text-transform:uppercase">Crear cuenta</button>
    </div>`;
    const profileStart = html.indexOf('<div class="profile-wrap">');
    const bottomNavStart = html.indexOf('<!-- ===== BOTTOM');
    let styledHtml = html;
    if (profileStart >= 0 && bottomNavStart > profileStart) {
      styledHtml = html.substring(0, profileStart) + ctaBlock + html.substring(bottomNavStart);
    }
    // Remove the gear icon (no session = no settings) but keep dark toggle
    styledHtml = styledHtml.replace(/<a[^>]*>[^<]*<i class="fas fa-cog"><\/i><\/a>/g, '');
    return <div dangerouslySetInnerHTML={{ __html: styledHtml }} />;
  }

  return (
    <>
      {hasToken && (
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 16px",background:"#F9F7F2",borderBottom:"1px solid #E5E0D8",fontFamily:"var(--font-mono)",fontSize:"0.65rem",position:"sticky",top:0,zIndex:60}}>
          <span style={{color:"#8A8580"}}>{user?.email || user?.name || "Sesión activa"}</span>
          <button onClick={() => { useAuthStore.getState().logout(); window.location.reload(); }} style={{background:"none",border:"1px solid #E74C3C",color:"#E74C3C",padding:"4px 12px",cursor:"pointer",fontFamily:"var(--font-mono)",fontSize:"0.6rem"}}>Salir</button>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}

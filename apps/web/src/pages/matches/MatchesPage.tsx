import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { api } from "@/lib/api";

interface Match {
  id: string; match_id: string;
  status: "active" | "pending" | "in_progress" | "completed" | "cancelled";
  my_item: { id: string; title: string; price: number; emoji?: string };
  other_item: { id: string; title: string; price: number; emoji?: string };
  other_user: { name: string; location?: string };
  timer_end?: string; type?: string;
}

const STATUS_LABEL: Record<string, string> = {
  active: "Match encontrado", pending: "Pendiente", in_progress: "En curso",
  completed: "Completado", cancelled: "Cancelado"
};
const STATUS_CLASS: Record<string, string> = {
  active: "active-status", pending: "pending-status", in_progress: "active-status",
  completed: "completed-status", cancelled: "cancelled-status"
};

export function MatchesPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [html, setHtml] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [tab, setTab] = useState("active");

  const hasToken = !!localStorage.getItem("treqe-token");

  // Load MIB HTML
  useEffect(() => {
    fetch("/mib/v12-mis-matches.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Remove hardcoded MIB cards — we'll inject real ones
      b = b.replace(/<!-- ===== ACTIVES[\s\S]*?(?=<!-- ===== BOTTOM)/, "<!-- matches-go-here -->\n");
      // Dark toggle
      b = b.replace(/(<button class="dm-toggle")>Dark<\/button>/, '$1 onclick="document.body.classList.toggle(&quot;dark&quot;);localStorage.setItem(&quot;treqe-darkmode&quot;,document.body.classList.contains(&quot;dark&quot;))">Dark</button>');
      setHtml(s + b);
    });
  }, []);

  // Fetch matches
  useEffect(() => {
    if (!hasToken) return;
    (async () => {
      try {
        const res: any = await api.get("/api/matches/");
        setMatches(res.matches || res || []);
      } catch { /* use empty */ }
    })();
  }, [hasToken]);

  // Inject matches into DOM
  useEffect(() => {
    if (!html) return;
    const check = () => {
      const placeholder = document.getElementById("matches-container") || document.querySelector(".match-section");
      if (!placeholder && matches.length === 0) return;
      if (!placeholder) { setTimeout(check, 300); return; }
      const active = matches.filter(m => m.status === "active");
      const pending = matches.filter(m => m.status === "pending");
      const inProgress = matches.filter(m => m.status === "in_progress");
      const completed = matches.filter(m => m.status === "completed");
      updateCounts(active.length, pending.length, inProgress.length, completed.length);
      renderTab(active.length + pending.length + inProgress.length + completed.length === 0);
      renderMatches(tab === "active" ? active : tab === "pending" ? pending : tab === "in_progress" ? inProgress : completed);
    };
    check();
  }, [html, matches, tab]);

  // Wire tabs + buttons
  useEffect(() => {
    if (!html) return;
    const iv = setInterval(() => {
      const tabs = document.querySelectorAll(".tab");
      if (!tabs.length) return;
      clearInterval(iv);
      tabs.forEach((t, i) => {
        t.addEventListener("click", () => {
          tabs.forEach(x => x.classList.remove("active"));
          t.classList.add("active");
          const keys = ["active", "pending", "in_progress", "completed"];
          setTab(keys[i] || "active");
        });
      });
      // Accept/Reject/Cancel buttons via delegation
      document.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement).closest("[data-action]") as HTMLElement | null;
        if (!btn) return;
        e.preventDefault(); e.stopPropagation();
        if (!user) { navigate("/login"); return; }
        const action = btn.dataset.action!;
        const matchId = btn.dataset.matchId!;
        api.post(`/api/matches/${matchId}/${action}`).then(() => {
          setMatches(prev => prev.map(m => m.id === matchId || m.match_id === matchId ? { ...m, status: action === "accept" ? "in_progress" : "cancelled" } : m));
        }).catch(console.error);
      });
    }, 200);
    return () => clearInterval(iv);
  }, [html]);

  function updateCounts(a: number, p: number, ip: number, c: number) {
    const counts = document.querySelectorAll(".count");
    if (counts[0]) counts[0].textContent = String(a);
    if (counts[1]) counts[1].textContent = String(p);
    if (counts[2]) counts[2].textContent = String(ip);
    if (counts[3]) counts[3].textContent = String(c);
  }

  function renderTab(empty: boolean) {
    const sections = document.querySelectorAll(".match-section");
    sections.forEach(s => {
      s.innerHTML = empty
        ? `<div style="text-align:center;padding:60px 20px;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">
            <i class="fas fa-exchange-alt" style="font-size:2rem;display:block;margin-bottom:16px;opacity:.3"></i>
            No hay treqes todav\u00EDa<br><br>
            <button onclick="window.location.href='/catalogo'" style="font-family:var(--font-mono);font-size:.55rem;padding:8px 20px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.08em;text-transform:uppercase">Explorar cat\u00E1logo</button>
          </div>`
        : "";
    });
  }

  const EM = ["🎸","📱","🎮","📷","⌚","🎧","🚲","💻","📚","🎯","🖥️","🎹"];

  function renderMatches(list: Match[]) {
    if (!list.length) return;
    const section = document.querySelector(".match-section");
    if (!section) return;
    section.innerHTML = list.map(m => {
      const myEmoji = m.my_item?.emoji || EM[Math.abs(hash(m.my_item?.id || "0")) % EM.length];
      const otherEmoji = m.other_item?.emoji || EM[Math.abs(hash(m.other_item?.id || "1")) % EM.length];
      const status = m.status === "in_progress" ? "in_progress" : m.status;
      const bg1 = bgColor(m.my_item?.id || "0");
      const bg2 = bgColor(m.other_item?.id || "1");
      return `<div class="match-card" style="border-left:3px solid var(--text)">
        <div class="match-card__header">
          <span class="match-card__id">#TRX-${(m.match_id || m.id || "---").slice(-6)}</span>
          <div style="display:flex;align-items:center;gap:6px">
            <span class="match-card__status ${STATUS_CLASS[status] || "pending-status"}">${STATUS_LABEL[status] || status}</span>
          </div>
        </div>
        <div class="item-compare">
          <div class="item-compare__item">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:44px;height:44px;background:${bg1};border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.2rem">${myEmoji}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.78rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.my_item?.title || "Mi art\u00EDculo"}</div>
                <div style="font-family:var(--font-mono);font-size:.48rem;color:var(--text-dim)">${m.my_item?.price ? "\u20AC"+m.my_item.price : ""}</div>
              </div>
            </div>
          </div>
          <div class="item-compare__arrow"><i class="fas fa-exchange-alt"></i></div>
          <div class="item-compare__item">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:44px;height:44px;background:${bg2};border:1px solid var(--border);border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:1.2rem">${otherEmoji}</div>
              <div style="flex:1;min-width:0">
                <div style="font-size:.78rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${m.other_item?.title || "Otro art\u00EDculo"}</div>
                <div style="font-family:var(--font-mono);font-size:.48rem;color:var(--text-dim)">${m.other_user?.name || ""}${m.other_user?.location ? " \u00B7 " + m.other_user.location : ""}${m.other_item?.price ? " \u00B7 \u20AC" + m.other_item.price : ""}</div>
              </div>
            </div>
          </div>
        </div>
        ${m.status === "active" ? `<div class="action-buttons">
          <button class="action-btn action-btn--primary" data-action="accept" data-match-id="${m.id || m.match_id}">Aceptar</button>
          <button class="action-btn action-btn--secondary" data-action="reject" data-match-id="${m.id || m.match_id}">Rechazar</button>
        </div>` : m.status === "in_progress" ? `<div class="progress-bar-wrap"><span><i class="fas fa-truck"></i> Intercambio en curso</span></div>` : ""}
      </div>`;
    }).join("");
  }

  // No auth
  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  if (!hasToken) {
    return <div dangerouslySetInnerHTML={{__html: html.replace(/<!-- matches-go-here -->[\s\S]*?(?=<!-- ===== BOTTOM)/, `<div class="match-section" style="text-align:center;padding:60px 20px">
      <div style="font-size:2rem;margin-bottom:12px;color:var(--text-dim)"><i class="fas fa-exchange-alt"></i></div>
      <h2 style="font-family:var(--font-sans);font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus treqes te esperan</h2>
      <p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesi\u00F3n para ver tus intercambios</p>
      <button onclick="window.location.href='/login'" style="font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase">Iniciar sesi\u00F3n</button>
      <button onclick="window.location.href='/registro'" style="display:block;margin:10px auto 0;background:none;border:1px solid var(--border);font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);cursor:pointer;padding:8px 20px;letter-spacing:.08em;text-transform:uppercase">Crear cuenta</button>
    </div>`) }} />;
  }

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

function hash(s: string): number { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i); return Math.abs(h); }
function bgColor(id: string): string {
  const colors = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#2A1A1A"];
  return colors[hash(id) % colors.length];
}

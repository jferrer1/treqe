import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface Notification {
  id: string; type: string; message: string; read: boolean;
  created_at: string; link?: string;
}

export function NotificationsPage() {
  const [html, setHtml] = useState("");
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const hasToken = !!localStorage.getItem("treqe-token");

  useEffect(() => {
    fetch("/mib/v11-notificaciones.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Remove hardcoded MIB notifs
      const notifStart = b.indexOf('<div class="notif-list">');
      const bottomStart = b.indexOf('<nav class="bottom-nav">');
      if (notifStart >= 0 && bottomStart > notifStart) {
        b = b.substring(0, notifStart) + '<div class="notif-list" id="notif-list"></div>\n' + b.substring(bottomStart);
      }
      // Hide badge dot by default
      b = b.replace(/<span class="nav-badge"><\/span>/g, '<span class="nav-badge" style="display:none"></span>');
      b = rewriteMibLinks(b);
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    if (!hasToken) return;
    (async () => {
      try {
        const res: any = await api.get("/api/notifications/");
        setNotifs(res.items || res || []);
      } catch {}
    })();
  }, [hasToken]);

  useEffect(() => {
    if (!html) return;
    let att = 0;
    const iv = setInterval(() => {
      const list = document.getElementById("notif-list");
      if (!list && att < 15) { att++; return; }
      clearInterval(iv);
      if (!list) return;
      // Update header title to show count
      const headerTitle = document.querySelector(".treqe-header__title");
      if (headerTitle) headerTitle.textContent = notifs.length > 0 ? `Avisos (${notifs.length})` : "Avisos";
      // Show/hide badge based on unread
      const badge = document.querySelector(".nav-badge");
      if (badge) (badge as HTMLElement).style.display = notifs.filter(n => !n.read).length > 0 ? "" : "none";
      if (notifs.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:60px 20px;font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em">
          <i class="fas fa-bell-slash" style="font-size:2rem;display:block;margin-bottom:16px;opacity:.3"></i>
          No tienes notificaciones
        </div>`;
      } else {
        const ICONS: Record<string, string> = {
          match: "fa-exchange-alt", offer: "fa-handshake", purchase: "fa-shopping-cart",
          review: "fa-star", system: "fa-info-circle", default: "fa-bell"
        };
        list.innerHTML = notifs.map(n => `
          <div class="notif-item${n.read ? "" : " unread"}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;background:var(--surface);border:1px solid var(--border);margin-bottom:4px;cursor:pointer">
            <div style="width:36px;height:36px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:.85rem;flex-shrink:0;color:${n.read ? 'var(--text-dim)' : 'var(--text)'}">
              <i class="fas ${ICONS[n.type] || ICONS.default}"></i>
            </div>
            <div style="flex:1;min-width:0">
              <div style="font-size:.78rem;font-weight:${n.read ? '400' : '500'}">${n.message}</div>
              <div style="font-family:var(--font-mono);font-size:.48rem;color:var(--text-dim);margin-top:2px">${new Date(n.created_at).toLocaleDateString('es-ES')}</div>
            </div>
            ${n.link ? `<a href="${n.link}" style="color:var(--text-dim);font-size:.7rem"><i class="fas fa-chevron-right"></i></a>` : ""}
          </div>
        `).join("");
      }
    }, 200);
    return () => clearInterval(iv);
  }, [html, notifs]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  if (!hasToken) {
    const ctaHtml = html.replace(/<div class="notif-list" id="notif-list">[\s\S]*?(?=<!-- ===== BOTTOM)/, 
      `<div class="notif-list" style="text-align:center;padding:60px 20px">
        <div style="font-size:2rem;margin-bottom:12px;color:var(--text-dim)"><i class="fas fa-bell"></i></div>
        <h2 style="font-family:var(--font-sans);font-size:1.1rem;font-weight:500;color:var(--text);margin-bottom:8px">Tus avisos te esperan</h2>
        <p style="font-family:var(--font-mono);font-size:.55rem;color:var(--text-dim);margin-bottom:24px;text-transform:uppercase;letter-spacing:.08em">Inicia sesión para ver tus notificaciones</p>
        <button onclick="window.location.href='/login'" style="font-family:var(--font-mono);font-size:.6rem;font-weight:500;padding:10px 28px;background:var(--text);color:var(--bg);border:none;cursor:pointer;letter-spacing:.1em;text-transform:uppercase">Iniciar sesión</button>
      </div>`
    );
    return <div dangerouslySetInnerHTML={{__html: ctaHtml}} />;
  }
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

const BASE = import.meta.env.BASE_URL;

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { login, register, user } = useAuthStore();
  const [html, setHtml] = useState("");

  // Redirect to catalog if already logged in
  useEffect(() => { if (user) navigate("/catalogo", { replace: true }); }, [user, navigate]);

  useEffect(() => {
    fetch(`${BASE}mib/v10-registro.html`).then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace("<form", '<div id="login-error-root"></div><form');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, `src="${BASE}treqe-logo.png"`);
      if (mode === "login") {
        b = b.replace(/¿Ya tienes cuenta\? <a[^>]*>Iniciar sesión<\/a>/, '<span style="color:var(--text-sub)">¿No tienes cuenta? </span><a href="/registro" style="color:var(--text-sub);text-decoration:underline">Crear cuenta</a>');
      } else {
        b = b.replace(/¿Ya tienes cuenta\? <a[^>]*>Iniciar sesión<\/a>/, '<span style="color:var(--text-sub)">¿Ya tienes cuenta? </span><a href="/login" style="color:var(--text-sub);text-decoration:underline">Iniciar sesión</a>');
      }
      setHtml(s + b);
    });
  }, [mode]);

  useEffect(() => {
    if (!html) return;
    let retries = 0;
    const iv = setInterval(() => {
      const form = document.querySelector("form");
      if (!form && retries < 20) { retries++; return; }
      clearInterval(iv);
      if (!form) return;
      const nameGrp = form.querySelector(".form-group");
      const title = document.querySelector("h2");
      const sub = document.querySelector(".sub");
      const submitBtn = form.querySelector('button[type="submit"]');
      const termsDiv = document.querySelector(".checkbox-group");

      if (mode === "login") {
        if (title) title.textContent = "Iniciar sesión";
        if (sub) sub.textContent = "Accede a tu cuenta de Treqe.";
        if (submitBtn) submitBtn.innerHTML = 'Iniciar sesión <i class="fas fa-arrow-right"></i>';
        if (nameGrp) { (nameGrp as HTMLElement).style.display = "none"; const ni = nameGrp.querySelector('input') as HTMLInputElement; if (ni) ni.removeAttribute('required'); }
        if (termsDiv) { (termsDiv as HTMLElement).style.display = "none"; const cb = termsDiv.querySelector('input') as HTMLInputElement; if (cb) cb.removeAttribute('required'); }
      } else {
        if (title) title.textContent = "Crear cuenta";
        if (sub) sub.textContent = "Únete a la comunidad de intercambio circular.";
        if (submitBtn) submitBtn.innerHTML = 'Crear cuenta <i class="fas fa-arrow-right"></i>';
        if (nameGrp) (nameGrp as HTMLElement).style.display = "block";
        if (termsDiv) (termsDiv as HTMLElement).style.display = "block";
      }

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
        if (!email || !password) return;

        // Clear previous error
        const root = document.getElementById('login-error-root');
        if (root) root.innerHTML = '';

        if (mode === "login") {
          await login(email, password);
          const err = useAuthStore.getState().error;
          if (err && root) {
            root.innerHTML = '<div style="padding:12px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;margin-bottom:16px;font-size:.85rem;color:#991B1B;font-family:\'IBM Plex Sans\',sans-serif;line-height:1.5">⚠️ <strong>Credenciales incorrectas.</strong> Revisa tu email y contraseña.<br><br><span style="color:#1C1915;font-weight:500;cursor:pointer;text-decoration:underline" onclick="window.location.hash=\'/recuperar-password\'">¿Olvidaste tu contraseña? Recuperar acceso</span><br><br><span style="color:#6B6560;font-size:.8rem;cursor:pointer;text-decoration:underline" onclick="window.location.hash=\'/registro\'">¿No tienes cuenta? Regístrate aquí</span></div>';
            return;
          }
        } else {
          const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
          await register(email, password, nameInput?.value || email.split("@")[0]);
          const err = useAuthStore.getState().error;
          if (err && root) {
            root.innerHTML = '<div style="padding:12px 14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;margin-bottom:16px;font-size:.85rem;color:#991B1B">⚠️ ' + err + '</div>';
            return;
          }
        }
        if (useAuthStore.getState().user) navigate("/catalogo");
      });
    }, 100);
    return () => clearInterval(iv);
  }, [html, mode, login, register, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

export function RegisterPage() { return <AuthPage mode="register" />; }
export function LoginPage() { return <AuthPage mode="login" />; }

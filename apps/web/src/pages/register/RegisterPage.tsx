import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/mib/v10-registro.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Fix toggle link
      // Replace the toggle link in footer
      const newLink = mode === "login"
        ? '<span style="color:var(--text-sub)">¿No tienes cuenta? </span><a href="/registro" style="color:var(--text-sub);text-decoration:underline">Crear cuenta</a>'
        : '<span style="color:var(--text-sub)">¿Ya tienes cuenta? </span><a href="/login" style="color:var(--text-sub);text-decoration:underline">Iniciar sesión</a>';
      b = b.replace(/¿Ya tienes cuenta\? <a[^>]*>Iniciar sesión<\/a>/, newLink);
      b = b.replace(/¿No tienes cuenta\? <a[^>]*>Crear cuenta<\/a>/, newLink);
      setHtml(s + b);
    });
  }, [mode]);

  useEffect(() => {
    if (!html) return;
    const t = setTimeout(() => {
      const form = document.querySelector("form");
      if (!form) return;
      const nameGrp = form.querySelector(".form-group");
      const title = document.querySelector("h2");
      const sub = document.querySelector(".sub");
      const submitBtn = form.querySelector('button[type="submit"]');
      const termsDiv = document.querySelector(".checkbox-group");

      // Set initial state based on mode
      if (mode === "login") {
        if (title) title.textContent = "Iniciar sesión";
        if (sub) sub.textContent = "Accede a tu cuenta de Treqe.";
        if (submitBtn) submitBtn.innerHTML = 'Iniciar sesión <i class="fas fa-arrow-right"></i>';
        // Keep Google/Apple visible on login too — just hide name+terms
      } else {
        if (nameGrp) (nameGrp as HTMLElement).style.display = "block";
        if (termsDiv) (termsDiv as HTMLElement).style.display = "block";
        if (title) title.textContent = "Crear cuenta";
        if (sub) sub.textContent = "Únete a la comunidad de intercambio circular.";
        if (submitBtn) submitBtn.innerHTML = 'Crear cuenta <i class="fas fa-arrow-right"></i>';
      }
      if (mode === "login" && nameGrp) (nameGrp as HTMLElement).style.display = "none";
      if (mode === "login" && termsDiv) (termsDiv as HTMLElement).style.display = "none";

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
        if (!email || !password) return;

        if (mode === "login") {
          await login(email, password);
        } else {
          const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
          await register(email, password, nameInput?.value || email.split("@")[0]);
        }
        if (useAuthStore.getState().user) navigate("/catalogo");
      });
    }, 200);
    return () => clearTimeout(t);
  }, [html, mode, login, register, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

export function RegisterPage() { return <AuthPage mode="register" />; }
export function LoginPage() { return <AuthPage mode="login" />; }

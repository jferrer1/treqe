import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function RegisterPage() {
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
      // Fix toggle link to be a button
      b = b.replace(/<a href="\.\.\/v10-registro\/">Iniciar sesión<\/a>/, '<button class="toggle-link" style="background:none;border:none;color:var(--text-sub);text-decoration:underline;cursor:pointer;font-size:inherit;font-family:inherit">Iniciar sesión</button>');
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    if (!html) return;
    const t = setTimeout(() => {
      const form = document.querySelector("form");
      const nameGrp = form?.querySelector(".form-group"); // First form-group is "Nombre"
      const title = document.querySelector("h2");
      const sub = document.querySelector(".sub");
      const submitBtn = form?.querySelector('button[type="submit"]');
      const termsDiv = document.querySelector(".checkbox-group");
      const toggleBtn = document.querySelector(".toggle-link");
      const googleBtns = document.querySelectorAll(".btn-google");

      let isLogin = false;

      const toggle = () => {
        isLogin = !isLogin;
        if (nameGrp) (nameGrp as HTMLElement).style.display = isLogin ? "none" : "block";
        if (termsDiv) (termsDiv as HTMLElement).style.display = isLogin ? "none" : "block";
        if (title) title.textContent = isLogin ? "Iniciar sesión" : "Crear cuenta";
        if (sub) sub.textContent = isLogin ? "Accede a tu cuenta de Treqe." : "Únete a la comunidad de intercambio circular.";
        if (submitBtn) submitBtn.innerHTML = isLogin ? 'Iniciar sesión <i class="fas fa-arrow-right"></i>' : 'Crear cuenta <i class="fas fa-arrow-right"></i>';
        if (toggleBtn) toggleBtn.textContent = isLogin ? "¿No tienes cuenta? Crear cuenta" : "¿Ya tienes cuenta? Iniciar sesión";
        if (googleBtns.length) googleBtns.forEach(b => { (b as HTMLElement).style.display = isLogin ? "none" : "block"; });
      };

      toggleBtn?.addEventListener("click", (e) => { e.preventDefault(); toggle(); });

      form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
        const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
        if (!email || !password) return;

        if (isLogin) {
          await login(email, password);
        } else {
          const nameInput = form.querySelector('input[type="text"]') as HTMLInputElement;
          await register(email, password, nameInput?.value || email.split("@")[0]);
        }
        if (useAuthStore.getState().user) navigate("/catalogo");
      });
    }, 200);
    return () => clearTimeout(t);
  }, [html, login, register, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

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
      setHtml(s + b);
    });
  }, []);

  // Add form handlers after HTML is rendered
  useEffect(() => {
    if (!html) return;
    const timer = setTimeout(() => {
      const forms = document.querySelectorAll("form");
      forms.forEach(form => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          const email = (form.querySelector('input[type="email"]') as HTMLInputElement)?.value;
          const password = (form.querySelector('input[type="password"]') as HTMLInputElement)?.value;
          const name = (form.querySelector('input[type="text"]') as HTMLInputElement)?.value;
          if (!email || !password) return;

          if (name) {
            // Register mode
            await register(email, password, name);
          } else {
            // Login mode
            await login(email, password);
          }
          
          if (useAuthStore.getState().user) {
            navigate("/catalogo");
          }
        });
      });

      // Toggle login/register
      const toggleBtn = document.querySelector('[data-action="toggle"]');
      if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
          const loginForm = document.getElementById("loginForm");
          const registerForm = document.getElementById("registerForm");
          if (loginForm && registerForm) {
            const isLogin = loginForm.style.display !== "none";
            loginForm.style.display = isLogin ? "none" : "block";
            registerForm.style.display = isLogin ? "block" : "none";
          }
        });
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [html]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

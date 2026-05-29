import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { rewriteMibLinks } from "@/lib/mibLinks";

interface ProductDetail {
  id: string; title: string; description: string | null;
  price: number; category: string; condition: string;
  photos: string[]; status: string; created_at: string;
  user_id?: string; owner?: { name: string; location?: string; reputation?: number };
}

const CONDITIONS: Record<string, string> = {
  new: "Nuevo", like_new: "Como nuevo", good: "Buen estado", fair: "Aceptable"
};

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [html, setHtml] = useState("");
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const hasToken = !!localStorage.getItem("treqe-token");

  // Load MIB HTML
  useEffect(() => {
    fetch("/mib/v2-detalle.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      const s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      b = rewriteMibLinks(b);
      setHtml(s + b);
    });
  }, []);

  // Fetch product
  useEffect(() => {
    if (!id || id === "demo") return;
    (async () => {
      try {
        const p: any = await api.get(`/api/products/${id}`);
        setProduct(p);
      } catch { /* keep MIB demo */ }
    })();
  }, [id]);

  // Inject data into DOM
  useEffect(() => {
    if (!html || !product) return;
    let att = 0;
    const iv = setInterval(() => {
      const titleEl = document.querySelector(".product-title, h1");
      if (!titleEl && att < 15) { att++; return; }
      clearInterval(iv);

      // Title
      if (titleEl) titleEl.textContent = product.title;
      // Price
      const priceEl = document.querySelector(".product-price, [class*='price']");
      if (priceEl) priceEl.innerHTML = `\u20AC${String(product.price).replace(".", ",")}`;
      // Condition
      const condEl = document.querySelector("[class*='condition'], .product-condition");
      if (condEl) condEl.textContent = CONDITIONS[product.condition] || product.condition;
      // Description
      const descEl = document.querySelector(".product-description, [class*='description']");
      if (descEl && product.description) descEl.textContent = product.description;
      // Photos
      if (product.photos?.length) {
        const imgContainer = document.querySelector("[class*='image'], .product-image, .detail-image") as HTMLElement;
        if (imgContainer) {
          imgContainer.innerHTML = `<img src="${product.photos[0]}" style="width:100%;height:100%;object-fit:cover" />`;
        }
      }
      // Seller
      const sellerEl = document.querySelector("[class*='seller'], [class*='owner'], [class*='user']");
      if (sellerEl && product.owner?.name) {
        sellerEl.textContent = product.owner.name;
      }
    }, 200);
    return () => clearInterval(iv);
  }, [html, product]);

  // Wire buy/trade buttons
  useEffect(() => {
    if (!html) return;
    const handler = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const text = btn.textContent || "";
      if (text.includes("COMPRAR") || text.includes("Comprar") || text.includes("comprar") ||
          text.includes("INTERCAMBIO") || text.includes("Intercambio") || text.includes("intercambiar") ||
          text.includes("Quiero") || text.includes("OFERTA")) {
        e.preventDefault(); e.stopPropagation();
        if (!hasToken) { navigate("/login"); return; }
        // Future: open purchase/trade flow
        alert(`Funcionalidad de ${text.includes("COMPRAR") || text.includes("comprar") ? "compra" : "intercambio"} en desarrollo`);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [html, hasToken, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}

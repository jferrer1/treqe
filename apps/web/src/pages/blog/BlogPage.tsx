import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface BlogPost {
  id: number; slug: string; title: string; excerpt: string | null;
  content: string; category: string; image_url: string | null;
  read_time: number; published_at: string | null; featured: boolean;
}

export function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      api.get<BlogPost>(`/api/blog/${slug}`).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false));
    } else {
      api.get<{ posts: BlogPost[] }>("/api/blog/?limit=50").then(r => setPosts(r.posts || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [slug]);

  const formatDate = (d: string | null) => {
    if (!d) return "";
    try { const date = new Date(d); return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }); } catch { return d; }
  };

  // Single post view
  if (slug) return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", background: "#F9F7F2", minHeight: "100vh" }}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate("/blog")}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">.blog</span>
      </div></div>
      <div style={{ padding: "20px 16px", maxWidth: 640, margin: "0 auto" }}>
        {loading ? <p style={{ textAlign: "center", color: "#8A8580" }}>Cargando...</p> :
         !post ? <p style={{ textAlign: "center", color: "#8A8580", padding: 40 }}>Articulo no encontrado</p> : (
          <article>
            {post.image_url && <img src={post.image_url} alt={post.title} style={{ width: "100%", borderRadius: 4, marginBottom: 16, objectFit: "cover", maxHeight: 300 }} />}
            <div style={{ fontSize: ".65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#8A8580", marginBottom: 8 }}>
              {post.category} {post.published_at ? " \u00B7 " + formatDate(post.published_at) : ""} {post.read_time ? " \u00B7 " + post.read_time + " min" : ""}
            </div>
            <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>{post.title}</h1>
            <div style={{ fontSize: ".9rem", lineHeight: 1.7, color: "#1C1915" }} dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>
        )}
      </div>
    </div>
  );

  // List view
  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", background: "#F9F7F2", minHeight: "100vh" }}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">.blog</span>
      </div></div>
      <div style={{ padding: "20px 16px", maxWidth: 640, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "1.6rem", fontWeight: 700, marginBottom: 4 }}>Blog</h1>
        <p style={{ fontSize: ".8rem", color: "#8A8580", marginBottom: 24 }}>Ideas sobre intercambio, sostenibilidad y comunidad</p>

        {loading ? <p style={{ textAlign: "center", color: "#8A8580" }}>Cargando...</p> :
         posts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#8A8580" }}>
            <i className="fas fa-pen-fancy" style={{ fontSize: "2rem", display: "block", marginBottom: 12, opacity: .3 }}></i>
            <p style={{ fontSize: ".85rem" }}>Próximamente nuevos artículos</p>
          </div>
        ) : posts.map(p => (
          <Link key={p.id} to={`/blog/${p.slug}`} style={{ display: "block", textDecoration: "none", color: "inherit", background: "#FFF", border: "1px solid #E5E0D8", borderRadius: 4, padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: ".6rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#8A8580", marginBottom: 6, display:"flex",gap:4,alignItems:"center" }}>
              <span style={{background:"#E5E0D8",padding:"1px 7px",borderRadius:2,fontSize:".45rem",color:"#55504B"}}>{p.category}</span>
              {p.published_at ? " \u00B7 " + formatDate(p.published_at) : ""}
              {p.read_time ? " \u00B7 " + p.read_time + " min lectura" : ""}
            </div>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>{p.title}</h2>
            {p.excerpt && <p style={{ fontSize: ".8rem", color: "#8A8580", lineHeight: 1.4 }}>{p.excerpt}</p>}
          </Link>
        ))}
      </div>

      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>Treqes</span></Link>
        <Link to="/subir" className="nav-item"><div className="nav-add-btn"><i className="fas fa-plus"></i></div></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span></Link>
        <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </div>
  );
}

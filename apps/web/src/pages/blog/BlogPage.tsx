import { Link } from "react-router-dom";

export function BlogPage() {
  const posts = [
    { slug: "1", title: "Por qué el trueque circular es el futuro del consumo", tag: "Primera entrega", date: "12 Mayo 2026" },
    { slug: "2", title: "Cómo funciona Treqe: guía visual del intercambio en 3 pasos", tag: "Guía", date: "14 Mayo 2026" },
    { slug: "3", title: "El fin de las comisiones abusivas en la segunda mano", tag: "Opinión", date: "16 Mayo 2026" },
  ];

  return (
    <>
      <div className="header">
        <Link to="/" className="logo-link"><span className="logo">treqe</span></Link>
        <div className="header-right">
          <Link to="/catalogo" className="blog-link"><i className="fas fa-arrow-left"></i> Catálogo</Link>
        </div>
      </div>
      <div className="section-title" style={{marginTop: 20}}>
        <h2>Blog</h2>
        <span>{posts.length} artículos</span>
      </div>
      <div className="catalog" style={{display: "flex", flexDirection: "column", gap: 16}}>
        {posts.map((post) => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="item-card" style={{padding: 20, textAlign: "left"}}>
            <div className="item-card__meta" style={{marginBottom: 6}}>{post.tag}</div>
            <div className="item-card__title">{post.title}</div>
            <div className="item-card__meta" style={{marginTop: 8}}>{post.date}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

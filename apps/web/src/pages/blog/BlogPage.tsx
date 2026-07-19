import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface BlogPost {
  id: number|string; slug: string; title: string; excerpt: string | null;
  content?: string; body?: string; category?: string; image_url?: string | null;
  read_time?: number; published_at?: string | null; created_at?: string | null; featured?: boolean;
}

const CATS = [
  { key: "all", label: "Todo" },
  { key: "economia", label: "Intercambio y economía" },
  { key: "historias", label: "Casos reales" },
  { key: "tecnologia", label: "Tecnología" },
  { key: "guia", label: "Guía" },
  { key: "sostenibilidad", label: "Sostenibilidad" },
];

const F = "'IBM Plex Sans',sans-serif";
const FM = "'IBM Plex Mono',monospace";

export function BlogPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState("all");
  const [visible, setVisible] = useState(6);

  useEffect(() => {
    if (slug) {
      api.get<BlogPost>(`/api/blog/${slug}`).then(setPost).catch(() => setPost(null)).finally(() => setLoading(false));
    } else {
      api.get<{ posts: BlogPost[]; items: BlogPost[] }>("/api/blog/?limit=50").then(r => setPosts(r.posts || r.items || [])).catch(() => {}).finally(() => setLoading(false));
    }
  }, [slug]);

  const fmt = (d: string | null) => {
    if (!d) return ""; try { return new Date(d).toLocaleDateString("es-ES", { day:"numeric", month:"long", year:"numeric" }); } catch { return d; }
  };

  // Single post
  if (slug) return (
    <div style={{ fontFamily:F, background:"#F9F7F2", minHeight:"100vh" }}>
      <div style={S.header}><div style={S.hLeft}>
        <button style={S.backBtn} onClick={() => navigate("/blog")}>← Blog</button>
      </div></div>
      <div style={S.postWrap}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         !post ? <p style={{textAlign:"center",color:"#8A8580",padding:40}}>Artículo no encontrado</p> : (
          <article style={S.postArt}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:16}}>
              <span style={{...S.catTag,border:"none"}}>{post.category || ''}</span>
              <span style={{color:"#A09A94"}}>·</span>
              <span style={S.meta}>{fmt(post.published_at || post.created_at || null)}</span>
              <span style={{color:"#A09A94"}}>·</span>
              <span style={S.meta}>{post.read_time || 0} min lectura</span>
            </div>
            <h1 style={S.postTitle}>{post.title}</h1>
            {post.excerpt && <p style={S.postSub}>{post.excerpt}</p>}
            <div style={S.postBody} dangerouslySetInnerHTML={{__html: post.body || post.content || ''}} />
            <div style={{marginTop:32,paddingTop:24,borderTop:"1px solid #E5E0D8"}}>
              <Link to="/blog" style={{...S.backBtn,textDecoration:"none"}}>← Volver al blog</Link>
            </div>
          </article>
        )}
      </div>
    </div>
  );

  // List view
  const filtered = useMemo(() => activeCat === "all" ? posts : posts.filter(p => p.category || '' === activeCat), [posts, activeCat]);
  const featured = useMemo(() => filtered.find(p => p.featured || false) || filtered[0], [filtered]);
  const grid = useMemo(() => filtered.filter(p => p.slug !== featured?.slug).slice(0, visible), [filtered, featured, visible]);

  return (
    <div style={{ fontFamily:F, background:"#F9F7F2", minHeight:"100vh", color:"#1C1915" }}>
      {/* Header */}
      <div style={S.header}><div style={S.hLeft}>
        <button style={S.backBtn} onClick={() => navigate(-1)}>←</button>
        <span style={{fontFamily:FM,fontSize:".85rem",fontWeight:600,letterSpacing:".12em",textTransform:"uppercase"}}>treqe<span style={{color:"#8A8580",marginLeft:4,fontWeight:400}}>.blog</span></span>
      </div></div>

      <div style={S.wrap}>
        {/* Hero */}
        <div style={S.hero}>
          <span style={S.heroTag}>Blog</span>
          <h1 style={S.heroTitle}>Por qué el intercambio es más inteligente que comprar</h1>
          <p style={S.heroText}>Intercambiamos desde antes de inventar el dinero. Treqe recupera lo mejor de esa idea con un algoritmo que hace posible lo imposible.</p>
        </div>

        {/* Categories */}
        <div style={S.cats}>
          {CATS.map(c => (
            <button key={c.key} style={{...S.catChip, ...(activeCat===c.key?S.catActive:{})}} onClick={()=>{setActiveCat(c.key);setVisible(6)}}>{c.label}</button>
          ))}
        </div>

        {loading ? <p style={{textAlign:"center",padding:60,color:"#8A8580"}}>Cargando artículos...</p> : (
        <div style={S.row}>
          {/* Main */}
          <div style={{flex:1,minWidth:0}}>
            <div style={S.secTitle}><h2 style={S.secH2}>Artículos destacados</h2><span style={S.secSub}>Más recientes</span></div>

            {featured && (
              <Link to={`/blog/${featured.slug}`} style={S.featCard}>
                <div style={S.featImg}><span style={S.featBadge}>Nuevo</span></div>
                <div style={S.featBody}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
                    <span style={S.meta}>{fmt(featured.published_at)}</span><span style={{color:"#A09A94"}}>·</span><span style={S.meta}>{featured.read_time} min lectura</span>
                  </div>
                  <div style={S.featTitle}>{featured.title}</div>
                  <div style={S.featExc}>{featured.excerpt}</div>
                  <div style={S.featRead}>Seguir leyendo →</div>
                </div>
              </Link>
            )}

            <div style={S.secTitle}><h2 style={S.secH2}>Más artículos</h2><span style={S.secSub}>{filtered.length} artículos</span></div>
            <div style={S.grid}>
              {grid.map(p => (
                <Link key={p.id} to={`/blog/${p.slug}`} style={S.card}>
                  <div style={S.cardThumb}><span style={{fontFamily:FM,fontSize:".8rem",color:"#55504B",fontWeight:600}}>{(p.category || '').charAt(0).toUpperCase()}</span></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginBottom:4}}>
                      <span style={S.meta}>{fmt(p.published_at || p.created_at || null)}</span>
                      <span style={S.catTag}>{CATS.find(c=>c.key===(p.category||''))?.label||(p.category||'')}</span>
                    </div>
                    <div style={S.cardTitle}>{p.title}</div>
                    <div style={S.cardExc}>{p.excerpt}</div>
                  </div>
                </Link>
              ))}
            </div>
            {visible < filtered.length - 1 && (
              <div style={{textAlign:"center",padding:"24px 0"}}>
                <button style={S.loadBtn} onClick={()=>setVisible(v=>v+6)}>Cargar más artículos</button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside style={{width:260,flexShrink:0}}>
            <div style={{position:"sticky",top:80}}>
              <div style={S.sbCard}>
                <h3 style={S.sbH3}>Newsletter</h3>
                <p style={{fontSize:".75rem",color:"#55504B",lineHeight:1.5,marginBottom:12}}>Recibe los nuevos artículos una vez a la semana. Zero spam.</p>
                <input type="email" placeholder="tu@email.com" style={S.sbInp} />
                <button style={S.sbBtn}>Suscribirse</button>
              </div>
              <div style={S.sbCard}>
                <h3 style={S.sbH3}>Categorías</h3>
                <ul style={{listStyle:"none",padding:0,margin:0}}>
                  {CATS.filter(c=>c.key!=="all").map(c=>{const n=posts.filter(p=>(p.category||'')===c.key).length;return(
                    <li key={c.key} style={S.sbLi} onClick={()=>setActiveCat(c.key)}><span>{c.label}</span><span style={S.sbBadge}>{n}</span></li>
                  )})}
                </ul>
              </div>
              <div style={S.sbCard}>
                <h3 style={S.sbH3}>Más leídos</h3>
                <ul style={{listStyle:"none",padding:0,margin:0}}>
                  {posts.slice(0,4).map(p=><li key={p.id} style={S.sbLi}><Link to={`/blog/${p.slug}`} style={{color:"#55504B",textDecoration:"none",fontSize:".5rem",display:"flex",alignItems:"center",gap:6}}><span style={{marginRight:6}}>→</span>{p.title}</Link></li>)}
                </ul>
              </div>
            </div>
          </aside>
        </div>
        )}
      </div>
    </div>
  );
}

const S: Record<string, React.CSSProperties> = {
  header: { display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 16px",background:"#F9F7F2",borderBottom:"1px solid #E5E0D8",position:"sticky",top:0,zIndex:100 },
  hLeft: { display:"flex",alignItems:"center",gap:8 },
  backBtn: { fontFamily:FM,fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",color:"#55504B",background:"none",border:"1px solid #E5E0D8",borderRadius:2,padding:"6px 12px",cursor:"pointer" },
  wrap: { maxWidth:1200,margin:"0 auto",padding:"24px" },
  hero: { padding:"36px",background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,marginBottom:28 },
  heroTag: { display:"inline-block",fontFamily:FM,fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".12em",padding:"4px 10px",background:"#1C1915",color:"#F9F7F2",borderRadius:2,marginBottom:14 },
  heroTitle: { fontSize:"clamp(1.3rem,3vw,1.8rem)",fontWeight:400,lineHeight:1.25,marginBottom:10,maxWidth:700,letterSpacing:"-.5px" },
  heroText: { fontSize:"clamp(.82rem,1.2vw,.92rem)",color:"#55504B",lineHeight:1.6,maxWidth:600 },
  cats: { display:"flex",gap:6,marginBottom:24,overflowX:"auto",scrollbarWidth:"none" },
  catChip: { flexShrink:0,padding:"6px 14px",fontFamily:FM,fontSize:".5rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",background:"#FFF",color:"#55504B",border:"1px solid #E5E0D8",borderRadius:2,cursor:"pointer",whiteSpace:"nowrap" },
  catActive: { background:"#1C1915",color:"#F9F7F2",borderColor:"#1C1915" },
  catTag: { fontFamily:FM,fontSize:".45rem",fontWeight:500,background:"#E5E0D8",padding:"1px 7px",borderRadius:2,color:"#55504B" },
  secTitle: { display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16 },
  secH2: { fontFamily:F,fontSize:"1.1rem",fontWeight:400,letterSpacing:"-.5px",margin:0 },
  secSub: { fontFamily:FM,fontSize:".5rem",color:"#8A8580" },
  meta: { fontFamily:FM,fontSize:".5rem",color:"#8A8580" },
  row: { display:"flex",gap:28,alignItems:"flex-start" },
  featCard: { display:"flex",background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,overflow:"hidden",marginBottom:28,textDecoration:"none",color:"inherit" },
  featImg: { width:"40%",minHeight:220,background:"#E5E0D8",display:"flex",alignItems:"flex-start",padding:14 },
  featBadge: { fontFamily:FM,fontSize:".5rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".08em",padding:"3px 10px",background:"#1C1915",color:"#F9F7F2",borderRadius:2 },
  featBody: { flex:1,padding:"24px 28px",display:"flex",flexDirection:"column",justifyContent:"center" },
  featTitle: { fontSize:"clamp(1rem,2vw,1.25rem)",fontWeight:400,lineHeight:1.3,marginBottom:8,letterSpacing:"-.5px" },
  featExc: { fontSize:".85rem",color:"#55504B",lineHeight:1.6,marginBottom:14 },
  featRead: { fontFamily:FM,fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",display:"flex",alignItems:"center",gap:6 },
  grid: { display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12 },
  card: { display:"flex",gap:14,background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,padding:20,textDecoration:"none",color:"inherit" },
  cardThumb: { width:68,height:68,border:"1px solid #E5E0D8",borderRadius:2,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#E5E0D8" },
  cardTitle: { fontSize:".85rem",fontWeight:500,lineHeight:1.3,marginBottom:3,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" },
  cardExc: { fontSize:".72rem",color:"#55504B",lineHeight:1.4,overflow:"hidden",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical" },
  loadBtn: { padding:"10px 28px",fontFamily:FM,fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,color:"#55504B",cursor:"pointer" },
  sbCard: { background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,padding:20,marginBottom:16 },
  sbH3: { fontFamily:FM,fontSize:".55rem",fontWeight:600,textTransform:"uppercase",letterSpacing:".12em",margin:"0 0 12px",paddingBottom:8,borderBottom:"1px solid #E5E0D8" },
  sbInp: { width:"100%",height:38,border:"1px solid #E5E0D8",borderRadius:2,padding:"0 12px",fontSize:".8rem",outline:"none",background:"#F9F7F2",marginBottom:8,fontFamily:F,boxSizing:"border-box" },
  sbBtn: { width:"100%",height:38,fontFamily:FM,fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".1em",background:"#1C1915",color:"#F9F7F2",border:"none",borderRadius:2,cursor:"pointer" },
  sbLi: { padding:"6px 0",borderBottom:"1px solid #E5E0D8",fontFamily:FM,fontSize:".5rem",color:"#55504B",cursor:"pointer",display:"flex",alignItems:"center",gap:6 },
  sbBadge: { marginLeft:"auto",background:"#E5E0D8",padding:"1px 6px",borderRadius:2,fontSize:".45rem",color:"#55504B" },
  postWrap: { maxWidth:720,margin:"0 auto",padding:"40px 24px" },
  postArt: { background:"#FFF",border:"1px solid #E5E0D8",borderRadius:2,padding:"36px 40px" },
  postTitle: { fontSize:"clamp(1.5rem,3vw,2rem)",fontWeight:400,lineHeight:1.2,letterSpacing:"-.5px",marginBottom:14 },
  postSub: { fontSize:"clamp(.95rem,1.5vw,1.1rem)",color:"#6B6560",lineHeight:1.6,marginBottom:28 },
  postBody: { fontSize:".95rem",lineHeight:1.8,color:"#55504B" },
};

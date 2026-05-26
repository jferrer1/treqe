import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

const CATEGORIES = ["Electrónica","Móviles","Consolas","Hogar","Deporte","Moda","Libros","Música","Coleccionismo","Motor","Niños","Herramientas","Decoración","Jardín","Informática","Cámaras","Bicicletas","Instrumentos","Juguetes","Otros"];
const CONDITIONS = ["like_new","good","fair","new","poor"];
const cl = (c: string) => ({like_new:"Como nuevo",good:"Buen estado",fair:"Aceptable",new:"Nuevo",poor:"Con desgaste"}[c]||c);

export function UploadPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [weight, setWeight] = useState("");
  const [step, setStep] = useState<"form"|"preview">("form");

  const uploadMutation = useMutation({
    mutationFn: () => api.post(`/api/products/?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}&price=${price}&category=${encodeURIComponent(category)}&condition=${condition}&weight=${weight || "0"}`),
    onSuccess: () => navigate("/catalogo"),
  });

  if (!user) {
    return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16,background:"var(--bg)",fontFamily:"var(--font-sans)"}}>
        <div style={{fontSize:"3rem"}}>🔒</div>
        <h2 style={{fontWeight:600}}>Necesitas una cuenta</h2>
        <p style={{color:"var(--text-sub)"}}>Regístrate para publicar artículos</p>
        <Link to="/registro" className="btn-primary" style={{textDecoration:"none",padding:"14px 32px"}}>Crear cuenta</Link>
      </div>
    );
  }

  if (step === "preview") {
    return (
      <>
        <div className="detail-header">
          <button className="back-btn" onClick={() => setStep("form")}><i className="fas fa-chevron-left"></i></button>
        </div>
        <div style={{padding:24,fontFamily:"var(--font-sans)"}}>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--text-dim)",marginBottom:24}}>Vista previa</div>
          <div className="gallery" style={{marginBottom:20}}>
            <div className="gallery-slide active" style={{background:"linear-gradient(135deg, #2D2D2D, #111)",height:280,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <i className="fas fa-box main-icon"></i>
            </div>
          </div>
          <div style={{fontFamily:"var(--font-mono)",fontSize:"0.55rem",textTransform:"uppercase",letterSpacing:"0.15em",color:"var(--text-dim)",marginBottom:8}}>{category.toUpperCase()}</div>
          <h1 style={{fontSize:"1.3rem",fontWeight:600,marginBottom:8}}>{title} · {cl(condition)}</h1>
          <div style={{fontSize:"1.6rem",fontWeight:700,marginBottom:24}}>€{price}</div>
          <p style={{color:"var(--text-sub)",lineHeight:1.6,marginBottom:32}}>{description}</p>
          <div style={{display:"flex",gap:8}}>
            <button className="btn-secondary" onClick={() => setStep("form")} style={{flex:1}}>Editar</button>
            <button className="btn-primary" onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isPending} style={{flex:1}}>
              {uploadMutation.isPending ? "Publicando..." : "Publicar artículo"}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span style={{fontFamily:"var(--font-mono)",fontSize:"0.65rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.1em",marginLeft:12}}>Publicar artículo</span>
      </div>

      <div style={{padding:24,fontFamily:"var(--font-sans)"}}>
        {/* Upload slots */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:24}}>
          {[...Array(8)].map((_,i) => (
            <div key={i} style={{aspectRatio:"1",border:"1px dashed var(--border)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--text-dim)",fontSize:"1.5rem",background:"var(--bg)"}}>
              <i className={i===0?"fas fa-camera":"fas fa-plus"} style={{fontSize:i===0?"1.2rem":"0.8rem"}}></i>
            </div>
          ))}
        </div>

        {/* Title */}
        <input placeholder="Título del artículo" value={title} onChange={e => setTitle(e.target.value)}
          style={inputStyle} />

        {/* Category */}
        <select value={category} onChange={e => setCategory(e.target.value)} style={{...inputStyle,appearance:"none"}}>
          <option value="">Categoría</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Price */}
        <input type="number" placeholder="Precio (€)" value={price} onChange={e => setPrice(e.target.value)}
          style={inputStyle} />

        {/* Condition */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
          {CONDITIONS.map(c => (
            <button key={c} onClick={() => setCondition(c)}
              style={{padding:"6px 14px",border:"1px solid var(--border)",background:condition===c?"var(--accent)":"transparent",color:condition===c?"var(--surface)":"var(--text)",fontFamily:"var(--font-mono)",fontSize:"0.6rem",textTransform:"uppercase",letterSpacing:1,cursor:"pointer"}}>
              {cl(c)}
            </button>
          ))}
        </div>

        {/* Weight */}
        <input type="number" placeholder="Peso (kg)" value={weight} onChange={e => setWeight(e.target.value)}
          style={inputStyle} step="0.1" />

        {/* Description */}
        <textarea placeholder="Descripción del artículo..." value={description} onChange={e => setDescription(e.target.value)}
          style={{...inputStyle,minHeight:100,resize:"vertical"}} />

        {/* Preview button */}
        <button className="btn-primary" onClick={() => setStep("preview")}
          disabled={!title || !price || !category || !condition}
          style={{width:"100%",opacity: title&&price&&category&&condition ? 1 : 0.5}}>
          Vista previa
        </button>
      </div>

      <nav className="bottom-nav">
        <Link to="/catalogo" className="nav-item"><i className="fas fa-search"></i><span>Buscar</span></Link>
        <Link to="/treqes" className="nav-item"><i className="fas fa-exchange-alt"></i><span>treqes</span></Link>
        <Link to="/subir" className="nav-item active"><div className="nav-add-btn"><i className="fas fa-plus"></i></div><span>Subir</span></Link>
        <Link to="/avisos" className="nav-item"><i className="fas fa-bell"></i><span>Avisos</span><span className="nav-badge"></span></Link>
        <Link to="/perfil" className="nav-item"><i className="fas fa-user"></i><span>Perfil</span></Link>
      </nav>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width:"100%",padding:"12px 16px",border:"1px solid var(--border)",
  background:"var(--surface)",fontSize:"0.95rem",fontFamily:"var(--font-sans)",
  marginBottom:12,outline:"none",display:"block"
};

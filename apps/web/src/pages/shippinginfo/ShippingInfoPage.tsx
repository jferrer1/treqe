import { Link } from "react-router-dom";

export function ShippingInfoPage() {
  return (
    <>
      <div className="header"><Link to="/" className="logo-link"><span className="logo">treqe</span></Link></div>
      <div className="section-title"><h2>Envíos y Costes</h2></div>
      <div style={{padding:"0 24px 40px",fontSize:"0.9rem",lineHeight:1.7,color:"#55504B"}}>
        <h3 style={{fontSize:"1rem",fontWeight:600,color:"#1C1915",marginBottom:12}}>Tarifas orientativas</h3>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <thead><tr style={{borderBottom:"1px solid #E5E0D8"}}><th style={{textAlign:"left",padding:"8px 0",fontSize:"0.75rem",color:"#8A8580"}}>Peso</th><th style={{textAlign:"right",padding:"8px 0",fontSize:"0.75rem",color:"#8A8580"}}>Coste</th></tr></thead>
          <tbody>
            {[["0-2 kg","4,95 €"],["2-5 kg","6,95 €"],["5-10 kg","9,95 €"],["10-20 kg","14,95 €"],["20-30 kg","19,95 €"]].map(([w,p])=><tr key={w} style={{borderBottom:"1px solid #F0EDE8"}}><td style={{padding:"8px 0"}}>{w}</td><td style={{textAlign:"right",padding:"8px 0",fontWeight:600}}>{p}</td></tr>)}
          </tbody>
        </table>
        <h3 style={{fontSize:"1rem",fontWeight:600,color:"#1C1915",marginBottom:12}}>Transportistas</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
          {["Correos","MRW","SEUR","GLS"].map(c=><span key={c} style={{padding:"6px 14px",border:"1px solid #E5E0D8",fontSize:"0.8rem",fontWeight:500}}>{c}</span>)}
        </div>
        <h3 style={{fontSize:"1rem",fontWeight:600,color:"#1C1915",marginBottom:12}}>Seguro</h3>
        <p>Compra directa: opcional (+1,99 €). Intercambio circular: incluido.</p>
        <p style={{marginTop:8}}>Cubre: pérdida, rotura, no coincide con descripción.</p>
      </div>
    </>
  );
}

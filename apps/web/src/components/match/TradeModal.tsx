import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface Product {
  id: string; title: string; price: number; photos: string[];
}

interface Props {
  wantedProductId: string;
  wantedTitle: string;
  wantedPrice?: number;
  onClose: () => void;
}

const CARD_BG = ["#1A3A2A", "#2A1A3A", "#3A2A1A", "#1A2A3A", "#2D2D2D", "#1A1A2A", "#2A3A2A", "#3A1A1A"];

export function TradeModal({ wantedProductId, wantedTitle, wantedPrice = 0, onClose }: Props) {
  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res: any = await api.get("/api/products/mine");
        setMyProducts(res.items || res || []);
      } catch { setError("No se pudieron cargar tus productos"); }
      setLoading(false);
    })();
  }, []);

  const goToStep2 = () => {
    if (!selected) return;
    setTimeout(() => {
      const rn = document.getElementById("tm-receiveName"); if (rn) rn.textContent = wantedTitle;
      const rp = document.getElementById("tm-receivePrice"); if (rp) rp.textContent = `€${String(wantedPrice).replace(".", ",")}`;
      const cn = document.getElementById("tm-confirmName"); if (cn) cn.textContent = selected.title;
      const cp = document.getElementById("tm-confirmPrice"); if (cp) cp.textContent = `${String(selected.price).replace(".", ",")} €`;
      const diff = wantedPrice - selected.price;
      const dv = document.getElementById("tm-diffValue"); if (dv) dv.textContent = diff > 0 ? `€${diff.toFixed(2)}` : "€0.00";
      const dl = document.getElementById("tm-diffLabel"); if (dl) dl.textContent = diff > 0 ? "DIFERENCIA A PAGAR" : diff < 0 ? "DIFERENCIA A RECIBIR" : "";
      const dc = document.getElementById("tm-diffContainer"); if (dc) dc.style.display = diff === 0 ? "none" : "";
    }, 50);
    document.getElementById("tm-step1Dot")?.classList.remove("active");
    document.getElementById("tm-step2Dot")?.classList.add("active");
    document.getElementById("tm-step1")?.classList.remove("visible");
    document.getElementById("tm-step2")?.classList.add("visible");
    const bb = document.getElementById("tm-backBtn"); if (bb) bb.style.display = "";
    const nb = document.getElementById("tm-nextBtn"); if (nb) nb.style.display = "none";
    const sb = document.getElementById("tm-sendBtn"); if (sb) sb.style.display = "";
  };

  const goToStep1 = () => {
    document.getElementById("tm-step1Dot")?.classList.add("active");
    document.getElementById("tm-step2Dot")?.classList.remove("active");
    document.getElementById("tm-step1")?.classList.add("visible");
    document.getElementById("tm-step2")?.classList.remove("visible");
    const bb = document.getElementById("tm-backBtn"); if (bb) bb.style.display = "none";
    const nb = document.getElementById("tm-nextBtn"); if (nb) nb.style.display = "";
    const sb = document.getElementById("tm-sendBtn"); if (sb) sb.style.display = "none";
  };

  const submitTrade = async () => {
    if (!selected) return;
    setSubmitting(true); setError("");
    try {
      await api.post(`/api/offers/?product_id_wants=${wantedProductId}&product_id_offers=${selected.id}`);
      setDone(true);
    } catch (e: any) { setError(e.message || "Error al enviar la oferta"); }
    setSubmitting(false);
  };

  return (
    <div
      className="modal-overlay visible"
      style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:9999,
        display:"flex", alignItems:"flex-end", justifyContent:"center",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="trade-modal"
        style={{
          background:"var(--surface,#FFF)", border:"1px solid var(--border,#E5E0D8)", borderBottom:"none",
          width:"100%", maxWidth:500, maxHeight:"85vh", overflowY:"auto",
          display:"flex", flexDirection:"column", animation:"mibSlideUp .3s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes mibSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
          .trade-modal .step-1,.trade-modal .step-2{display:none}
          .trade-modal .step-1.visible,.trade-modal .step-2.visible{display:block}
        `}</style>

        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:"1px solid var(--border,#E5E0D8)"}}>
          <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)"}}>Solicitar trueque</span>
          <button onClick={onClose} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border,#E5E0D8)",color:"var(--text-sub,#55504B)",fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.9rem",background:"none",cursor:"pointer"}}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div style={{flex:1,padding:24,overflowY:"auto"}}>
          {loading ? (
            <div style={{textAlign:"center",padding:"40px 0",color:"var(--text-dim,#8A8580)",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",textTransform:"uppercase",letterSpacing:".08em"}}>Cargando tus artículos...</div>
          ) : done ? (
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <div style={{fontSize:"2.5rem",marginBottom:16}}>✅</div>
              <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)",marginBottom:8}}>¡Oferta enviada!</div>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",color:"var(--text-sub,#55504B)",lineHeight:1.5}}>El vendedor recibirá tu propuesta de intercambio.</p>
            </div>
          ) : myProducts.length === 0 ? (
            /* No products — MIB CTA */
            <div style={{textAlign:"center",padding:"48px 20px"}}>
              <i className="fas fa-box-open" style={{fontSize:"2.4rem",display:"block",marginBottom:20,color:"var(--text-dim,#8A8580)",opacity:.3}}></i>
              <h3 style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".95rem",fontWeight:600,color:"var(--text,#1C1915)",margin:"0 0 8px"}}>No tienes artículos para intercambiar</h3>
              <p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",color:"var(--text-sub,#55504B)",lineHeight:1.6,marginBottom:28}}>Para solicitar un trueque necesitas tener al menos 1 artículo publicado.</p>
              <a href="/subir" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",padding:"14px 32px",background:"var(--accent,#1C1915)",color:"#FFF",border:"1px solid var(--accent,#1C1915)",textDecoration:"none",display:"inline-block"}}>
                Subir artículo <i className="fas fa-arrow-right" style={{marginLeft:6}}></i>
              </a>
            </div>
          ) : (
            <>
              {/* Step indicator — pill-shaped active dot */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:24}}>
                <div id="tm-step1Dot" className="step-dot active" style={{width:24,height:8,background:"var(--accent,#1C1915)",transition:"all .3s"}}></div>
                <div id="tm-step2Dot" className="step-dot" style={{width:8,height:8,background:"var(--border,#E5E0D8)",transition:"all .3s"}}></div>
              </div>

              {/* Step 1 */}
              <div id="tm-step1" className="step-1 visible">
                <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".85rem",fontWeight:500,color:"var(--text,#1C1915)",marginBottom:16,textAlign:"center"}}>
                  Selecciona qué artículo quieres treqear
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12,marginBottom:20}}>
                  {myProducts.slice(0, 8).map((p, i) => (
                    <div
                      key={p.id}
                      className={`your-item-card${selected?.id === p.id ? " selected" : ""}`}
                      onClick={() => {
                        setSelected(p);
                        const nb = document.getElementById("tm-nextBtn") as HTMLButtonElement;
                        if (nb) nb.disabled = false;
                      }}
                      style={{
                        background:"var(--bg,#F9F7F2)", border:`2px solid ${selected?.id===p.id?"var(--accent,#1C1915)":"transparent"}`,
                        cursor:"pointer",transition:"all .2s",
                      }}
                    >
                      <div style={{
                        aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:"2rem",color:"rgba(255,255,255,0.4)",position:"relative",
                        background:CARD_BG[i % 8],overflow:"hidden",
                      }}>
                        {p.photos?.[0]
                          ? <img src={p.photos[0]} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}} />
                          : <i className="fas fa-box"></i>
                        }
                        {selected?.id === p.id && (
                          <span style={{position:"absolute",top:8,right:8,width:24,height:24,background:"var(--accent,#1C1915)",display:"flex",alignItems:"center",justifyContent:"center",color:"#FFF",fontFamily:"'IBM Plex Mono',monospace",fontSize:".65rem"}}>
                            <i className="fas fa-check"></i>
                          </span>
                        )}
                      </div>
                      <div style={{padding:12}}>
                        <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".75rem",fontWeight:500,color:"var(--text,#1C1915)",marginBottom:4,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.title}</div>
                        <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".8rem",fontWeight:500,color:"var(--text,#1C1915)"}}>€{String(p.price).replace(".", ",")}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {myProducts.length > 8 && (
                  <div style={{textAlign:"center",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",color:"var(--text-dim,#8A8580)",textTransform:"uppercase"}}>+{myProducts.length - 8} artículos más</div>
                )}
              </div>

              {/* Step 2 */}
              <div id="tm-step2" className="step-2">
                <div style={{textAlign:"center",marginBottom:24}}>
                  <div style={{width:64,height:64,background:"var(--accent,#1C1915)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"1.5rem",color:"#FFF"}}>
                    <i className="fas fa-handshake"></i>
                  </div>
                  <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)",marginBottom:4}}>Confirma tu trueque</div>
                  <div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",color:"var(--text-sub,#55504B)"}}>Revisa los detalles antes de enviar</div>
                </div>

                <div style={{background:"var(--bg,#F9F7F2)",border:"1px solid var(--border,#E5E0D8)",padding:20,marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:16}}>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",margin:"0 auto 8px",background:"#2D2D2D",color:"rgba(255,255,255,0.6)"}}>
                        <i className="fas fa-box"></i>
                      </div>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)",marginBottom:4}}>RECIBES</div>
                      <div id="tm-receiveName" style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".75rem",fontWeight:500,color:"var(--text,#1C1915)",marginBottom:2}}>{wantedTitle}</div>
                      <div id="tm-receivePrice" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".85rem",fontWeight:500,color:"var(--text,#1C1915)"}}>€{String(wantedPrice).replace(".", ",")}</div>
                    </div>
                    <div style={{fontSize:"1rem",color:"var(--text-dim,#8A8580)"}}><i className="fas fa-exchange-alt"></i></div>
                    <div style={{flex:1,textAlign:"center"}}>
                      <div style={{width:56,height:56,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",margin:"0 auto 8px",background:"var(--accent,#1C1915)",color:"#FFF",overflow:"hidden"}}>
                        {selected?.photos?.[0]
                          ? <img src={selected.photos[0]} style={{width:"100%",height:"100%",objectFit:"cover"}} />
                          : <i className="fas fa-box"></i>
                        }
                      </div>
                      <div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)",marginBottom:4}}>DAS</div>
                      <div id="tm-confirmName" style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".75rem",fontWeight:500,color:"var(--text,#1C1915)",marginBottom:2}}>{selected?.title || "-"}</div>
                      <div id="tm-confirmPrice" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".85rem",fontWeight:500,color:"var(--text,#1C1915)"}}>{selected ? `${String(selected.price).replace(".",",")} €` : "- €"}</div>
                    </div>
                  </div>
                  <div id="tm-diffContainer" style={{background:"var(--surface,#FFF)",padding:16,marginTop:16,textAlign:"center",border:"1px dashed var(--border,#E5E0D8)"}}>
                    <div id="tm-diffLabel" style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",color:"var(--text-dim,#8A8580)",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>Diferencia a pagar</div>
                    <div id="tm-diffValue" style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1.3rem",fontWeight:600,color:"var(--text,#1C1915)"}}>
                      €{selected ? (wantedPrice - selected.price).toFixed(2) : "0.00"}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !done && myProducts.length > 0 && (
          <div style={{padding:"16px 24px 24px",borderTop:"1px solid var(--border,#E5E0D8)",display:"flex",gap:12}}>
            <button id="tm-backBtn" onClick={goToStep1} style={{
              flex:1,display:"none",padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,
              textTransform:"uppercase",letterSpacing:"1px",border:"1px solid var(--border,#E5E0D8)",background:"var(--surface,#FFF)",color:"var(--text,#1C1915)",cursor:"pointer",
            }}>ATRÁS</button>
            <button id="tm-nextBtn" onClick={goToStep2} disabled={!selected} style={{
              flex:1,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,
              textTransform:"uppercase",letterSpacing:"1px",
              background:selected ? "var(--accent,#1C1915)" : "var(--border,#E5E0D8)",
              color:selected ? "#FFF" : "var(--text-dim,#8A8580)",
              border:`1px solid ${selected ? "var(--accent,#1C1915)" : "var(--border,#E5E0D8)"}`,
              cursor:selected ? "pointer" : "not-allowed",
            }}>CONTINUAR</button>
            <button id="tm-sendBtn" onClick={submitTrade} disabled={submitting} style={{
              flex:1,display:"none",padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,
              textTransform:"uppercase",letterSpacing:"1px",
              background:submitting ? "var(--border,#E5E0D8)" : "var(--accent,#1C1915)",
              color:submitting ? "var(--text-dim,#8A8580)" : "#FFF",
              border:`1px solid ${submitting ? "var(--border,#E5E0D8)" : "var(--accent,#1C1915)"}`,
              cursor:submitting ? "not-allowed" : "pointer",
            }}>{submitting ? "Enviando..." : "ENVIAR SOLICITUD"}</button>
          </div>
        )}

        {error && (
          <div style={{margin:"0 24px 16px",padding:"10px 14px",background:"#FEE2E2",color:"#DC2626",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",textTransform:"uppercase",letterSpacing:".04em"}}>{error}</div>
        )}
      </div>
    </div>
  );
}

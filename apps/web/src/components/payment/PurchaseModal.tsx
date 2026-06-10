import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";

interface Props {
  productTitle: string; productPrice: number; productId: string;
  productWeight: number | null; onClose: () => void;
}

const CARRIERS = [
  { name: "Correos Paq Estándar", key: "correos_std", icon: "fa-envelope", desc: "2-4 días · Recogida en oficina", tag: "Más barato" },
  { name: "Correos Paq Premium", key: "correos_prem", icon: "fa-envelope-open-text", desc: "24-48h · A domicilio + seguimiento", tag: "Recomendado" },
  { name: "SEUR 24h", key: "seur", icon: "fa-truck-fast", desc: "24h · Urgente a domicilio", tag: "Más rápido" },
  { name: "GLS", key: "gls", icon: "fa-boxes", desc: "24-72h · Buena cobertura rural", tag: "Buena cobertura" },
];
const WT = [0,2,5,10,20,30];
const PR: Record<string,number[]>={correos_std:[4.95,5.95,7.95,10.95,14.95],correos_prem:[6.95,7.95,9.95,13.95,18.95],seur:[7.50,8.50,10.50,14.50,19.50],gls:[5.50,6.50,8.50,11.50,15.50]};
function tier(w:number|null):number{if(!w||w<=0)return 1;for(let i=0;i<WT.length-1;i++)if(w<=WT[i+1])return i;return WT.length-2}
function price(k:string,t:number):number{return PR[k]?.[t]??5.95}

export function PurchaseModal({ productTitle, productPrice, productId, productWeight, onClose }: Props) {
  const t = tier(productWeight);
  const wl = productWeight ? `${productWeight} kg` : "2-5 kg";
  const [carrier, setCarrier] = useState("correos_std");
  const sh = price(carrier, t);
  const [insurance, setInsurance] = useState(true);
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<1|2|3>(1);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [stripe, setStripe] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState("");
  const cardRef = useRef<any>(null);

  useEffect(()=>{(async()=>{try{const u:any=await api.get("/api/users/me");if(u?.location)setAddress(u.location)}catch{}})();},[]);
  useEffect(() => {
    if (document.querySelector("#stripe-js")) return;
    const script = document.createElement("script");
    script.id = "stripe-js";
    script.src = "https://js.stripe.com/v3/";
    script.onload = () => {
      api.get("/api/payments/config").then((cfg: any) => {
        if (cfg?.publishable_key) setStripe((window as any).Stripe(cfg.publishable_key));
      }).catch(() => {});
    };
    document.head.appendChild(script);
  }, []);

  const prot = insurance?(productPrice+sh)*0.05:0;
  const total = productPrice+sh+prot;

  const goToPayment = async () => {
    setSubmitting(true); setError("");
    try {
      // 1. Create purchase first
      const purchase: any = await api.post(`/api/purchases/?product_id=${productId}&shipping=${sh}&insurance=${insurance}`);
      // 2. Create payment intent for that purchase
      const res: any = await api.post(`/api/payments/intent?reference_id=${purchase.id}&reference_type=purchase`);
      if (res.client_secret) setClientSecret(res.client_secret);
      setStep(3);
    } catch(e:any) { setError(e.message||"Error al crear el pago"); }
    setSubmitting(false);
  };

  const confirmPayment = async () => {
    if (!stripe || !clientSecret) return;
    setSubmitting(true); setError("");
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardRef.current, billing_details: { name: address } },
      });
      if (result.error) { setError(result.error.message); }
      else if (result.paymentIntent?.status === "succeeded") {
        await api.post(`/api/purchases/?product_id=${productId}&shipping=${sh}&insurance=${insurance}`);
        setDone(true);
      }
    } catch(e:any) { setError(e.message||"Error al confirmar el pago"); }
    setSubmitting(false);
  };

  // Mount Stripe card element
  useEffect(() => {
    if (step !== 3 || !stripe) return;
    const elements = stripe.elements();
    const card = elements.create("card", { style: { base: { fontFamily: '"IBM Plex Sans",sans-serif',fontSize:"16px",color:"#1C1915","::placeholder":{color:"#8A8580"} },invalid:{color:"#DC2626"} } });
    const t = setTimeout(() => { const el = document.getElementById("card-element"); if (el) { el.innerHTML = ""; card.mount(el); cardRef.current = card; } }, 100);
    return () => clearTimeout(t);
  }, [step, stripe]);

  const hdr = (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 24px",borderBottom:"1px solid var(--border,#E5E0D8)"}}>
      <span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)"}}>{step===3?"Pago":"Comprar"}</span>
      <button onClick={onClose} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",border:"1px solid var(--border,#E5E0D8)",color:"var(--text-sub,#55504B)",fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.9rem",background:"none",cursor:"pointer"}}><i className="fas fa-times"></i></button>
    </div>
  );

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:9999,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div style={{background:"var(--surface,#FFF)",border:"1px solid var(--border,#E5E0D8)",borderBottom:"none",width:"100%",maxWidth:500,maxHeight:"85vh",overflowY:"auto",display:"flex",flexDirection:"column",animation:"mibSlideUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <style>{`@keyframes mibSlideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        {hdr}
        <div style={{flex:1,padding:24,overflowY:"auto"}}>
          {done && <D onClose={onClose} />}
          {!done && step===3 && <S3 total={total} clientSecret={clientSecret} error={error} submitting={submitting} onBack={()=>setStep(2)} onConfirm={confirmPayment} />}
          {!done && step===2 && <S2 productTitle={productTitle} productPrice={productPrice} carrier={carrier} shipping={sh} insurance={insurance} prot={prot} total={total} address={address} error={error} submitting={submitting} onBack={()=>setStep(1)} onNext={goToPayment} />}
          {!done && step===1 && <S1 productTitle={productTitle} productPrice={productPrice} tier={t} wl={wl} carrier={carrier} setCarrier={setCarrier} shipping={sh} insurance={insurance} setInsurance={setInsurance} address={address} setAddress={setAddress} onNext={()=>setStep(2)} />}
        </div>
      </div>
    </div>
  );
}

function D({onClose}:{onClose:()=>void}){return <div style={{textAlign:"center",padding:"40px 20px"}}><div style={{width:64,height:64,background:"var(--accent,#1C1915)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:"1.5rem",color:"#FFF"}}><i className="fas fa-check"></i></div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)",marginBottom:8}}>¡Pago realizado!</div><p style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",color:"var(--text-sub,#55504B)",lineHeight:1.5,marginBottom:6}}>Tu pago está protegido. El vendedor tiene 48h para aceptar.</p><button onClick={onClose} style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",padding:"14px 32px",background:"var(--accent,#1C1915)",color:"#FFF",border:"1px solid var(--accent)",cursor:"pointer"}}>ENTENDIDO</button></div>}

function S1({productTitle,productPrice,tier,wl,carrier,setCarrier,shipping,insurance,setInsurance,address,setAddress,onNext}:any){return(<><div style={{textAlign:"center",marginBottom:20}}><div style={{width:64,height:64,background:"var(--accent,#1C1915)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px",fontSize:"1.5rem",color:"#FFF"}}><i className="fas fa-credit-card"></i></div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".85rem",fontWeight:500,color:"var(--text,#1C1915)",marginBottom:4}}>{productTitle}</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)"}}>€{String(productPrice).replace(".",",")}</div></div><div style={{background:"var(--bg,#F9F7F2)",border:"1px solid var(--border,#E5E0D8)",padding:16,marginBottom:16}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)",marginBottom:6}}>Envío — {wl}</div>{CARRIERS.map(c=>{const p=price(c.key,tier);const sel=carrier===c.key;return(<label key={c.key} style={{display:"flex",alignItems:"flex-start",gap:10,padding:12,marginBottom:6,background:sel?"var(--surface,#FFF)":"transparent",border:`2px solid ${sel?"var(--accent,#1C1915)":"var(--border,#E5E0D8)"}`,cursor:"pointer"}}><input type="radio" name="carrier" checked={sel} onChange={()=>setCarrier(c.key)} style={{accentColor:"var(--accent,#1C1915)",marginTop:2}}/><i className={`fas ${c.icon}`} style={{color:sel?"var(--accent,#1C1915)":"var(--text-dim,#8A8580)",width:20,textAlign:"center",marginTop:2,fontSize:"1rem"}}></i><div style={{flex:1,minWidth:0}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:2}}><span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",fontWeight:500,color:"var(--text,#1C1915)"}}>{c.name}</span>{c.tag&&<span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".5rem",fontWeight:500,textTransform:"uppercase",letterSpacing:".5px",padding:"2px 6px",background:sel?"var(--accent,#1C1915)":"var(--border,#E5E0D8)",color:sel?"#FFF":"var(--text-dim,#8A8580)"}}>{c.tag}</span>}</div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".65rem",color:"var(--text-sub,#55504B)",lineHeight:1.3}}>{c.desc}</div></div><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".85rem",fontWeight:600,color:sel?"var(--accent,#1C1915)":"var(--text,#1C1915)",whiteSpace:"nowrap"}}>{String(p).replace(".",",")} €</span></label>)})}</div><label style={{display:"block",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)",marginBottom:8}}>Dirección de entrega</label><input type="text" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Calle, número, piso, CP, ciudad" style={{width:"100%",padding:"12px 14px",fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",border:"1px solid var(--border,#E5E0D8)",background:"var(--surface,#FFF)",color:"var(--text,#1C1915)",outline:"none",marginBottom:16}}/><label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:12,background:"var(--bg,#F9F7F2)",border:"1px solid var(--border,#E5E0D8)"}}><div style={{flex:1}}><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)",marginBottom:2}}>Protección de compra</div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".7rem",color:"var(--text-sub,#55504B)"}}>Cubre daños, pérdida o artículo incorrecto</div></div><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".7rem",color:"var(--text-dim,#8A8580)"}}>{((productPrice+shipping)*0.05).toFixed(2).replace(".",",")} €</span><input type="checkbox" checked={insurance} onChange={e=>setInsurance(e.target.checked)} style={{accentColor:"var(--accent,#1C1915)",width:18,height:18}}/></div></label><button onClick={onNext} disabled={!address.trim()} style={{width:"100%",marginTop:24,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",background:address.trim()?"var(--accent,#1C1915)":"var(--border,#E5E0D8)",color:address.trim()?"#FFF":"var(--text-dim,#8A8580)",border:`1px solid ${address.trim()?"var(--accent,#1C1915)":"var(--border,#E5E0D8)"}`,cursor:address.trim()?"pointer":"not-allowed"}}>CONTINUAR</button></>)}

function S2({productTitle,productPrice,carrier,shipping,insurance,prot,total,address,error,submitting,onBack,onNext}:any){const cn=CARRIERS.find((c:any)=>c.key===carrier)?.name||carrier;return(<><div style={{textAlign:"center",marginBottom:24}}><div style={{fontSize:"1.5rem",marginBottom:8}}>📦</div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".85rem",fontWeight:600,color:"var(--text,#1C1915)"}}>Resumen de la compra</div></div><div style={{background:"var(--bg,#F9F7F2)",border:"1px solid var(--border,#E5E0D8)",padding:20,marginBottom:20}}><R l={productTitle} v={`€${String(productPrice).replace(".",",")}`}/><R l={`Envío — ${cn}`} v={`€${String(shipping).replace(".",",")}`} d/>{insurance&&<R l="Protección de compra" v={`€${prot.toFixed(2).replace(".",",")}`} d/>}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px dashed var(--border,#E5E0D8)"}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",color:"var(--text-dim,#8A8580)"}}>TOTAL</span><span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:"1.1rem",fontWeight:700,color:"var(--text,#1C1915)"}}>€{total.toFixed(2).replace(".",",")}</span></div></div><div style={{marginBottom:16}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",color:"var(--text-dim,#8A8580)",textTransform:"uppercase",letterSpacing:".06em"}}>📍 {address}</span></div>{insurance&&<PB/>}{error&&<div style={{padding:"10px 14px",background:"#FEE2E2",color:"#DC2626",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",textTransform:"uppercase",letterSpacing:".04em",marginBottom:12}}>{error}</div>}<div style={{display:"flex",gap:12}}><button onClick={onBack} style={{flex:1,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",border:"1px solid var(--border,#E5E0D8)",background:"var(--surface,#FFF)",color:"var(--text,#1C1915)",cursor:"pointer"}}>ATRÁS</button><button onClick={onNext} disabled={submitting} style={{flex:1,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",background:submitting?"var(--border,#E5E0D8)":"var(--accent,#1C1915)",color:submitting?"var(--text-dim,#8A8580)":"#FFF",border:`1px solid ${submitting?"var(--border,#E5E0D8)":"var(--accent,#1C1915)"}`,cursor:submitting?"not-allowed":"pointer"}}>{submitting?"Procesando...":"PAGAR"}</button></div></>)}

function S3({total,clientSecret,error,submitting,onBack,onConfirm}:any){return(<><div style={{textAlign:"center",marginBottom:20}}><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".85rem",fontWeight:600,color:"var(--text,#1C1915)",marginBottom:4}}>Pago con tarjeta</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"1rem",fontWeight:600,color:"var(--text,#1C1915)"}}>€{total.toFixed(2).replace(".",",")}</div></div><div id="card-element" style={{padding:"14px",border:"1px solid var(--border,#E5E0D8)",background:"var(--surface,#FFF)",marginBottom:16,minHeight:44}}></div><div style={{display:"flex",alignItems:"center",gap:8,padding:8,background:"#EEF7EE",border:"1px solid #A5D9D1",marginBottom:16,fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".65rem",color:"#1C1915"}}><i className="fas fa-lock" style={{color:"#1C1915"}}></i> Tus datos de pago están cifrados y seguros. Procesado por Stripe.</div>{error&&<div style={{padding:"10px 14px",background:"#FEE2E2",color:"#DC2626",fontFamily:"'IBM Plex Mono',monospace",fontSize:".55rem",textTransform:"uppercase",letterSpacing:".04em",marginBottom:12}}>{error}</div>}<div style={{display:"flex",gap:12}}><button onClick={onBack} style={{flex:1,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",border:"1px solid var(--border,#E5E0D8)",background:"var(--surface,#FFF)",color:"var(--text,#1C1915)",cursor:"pointer"}}>ATRÁS</button><button onClick={onConfirm} disabled={submitting||!clientSecret} style={{flex:1,padding:"14px 20px",fontFamily:"'IBM Plex Mono',monospace",fontSize:".6rem",fontWeight:500,textTransform:"uppercase",letterSpacing:"1px",background:submitting||!clientSecret?"var(--border,#E5E0D8)":"var(--accent,#1C1915)",color:submitting||!clientSecret?"var(--text-dim,#8A8580)":"#FFF",border:`1px solid ${submitting||!clientSecret?"var(--border,#E5E0D8)":"var(--accent,#1C1915)"}`,cursor:submitting||!clientSecret?"not-allowed":"pointer"}}>{submitting?"Procesando...":"PAGAR €"+total.toFixed(2).replace(".",",")}</button></div></>)}

function R({l,v,d}:{l:string;v:string;d?:boolean}){return<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}><span style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".8rem",color:d?"var(--text-sub,#55504B)":"var(--text,#1C1915)"}}>{l}</span><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:".8rem",color:d?"var(--text-sub,#55504B)":"var(--text,#1C1915)"}}>{v}</span></div>}
function PB(){return<div style={{display:"flex",alignItems:"flex-start",gap:8,padding:12,background:"#EEF7EE",border:"1px solid #A5D9D1",marginBottom:16}}><i className="fas fa-shield-alt" style={{color:"#1C1915",marginTop:2}}></i><div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".7rem",fontWeight:500,color:"var(--text,#1C1915)"}}>Compra protegida</div><div style={{fontFamily:"'IBM Plex Sans',sans-serif",fontSize:".65rem",color:"var(--text-sub,#55504B)"}}>Si el artículo no llega, llega dañado o no coincide con la descripción, te devolvemos el dinero.</div></div></div>}

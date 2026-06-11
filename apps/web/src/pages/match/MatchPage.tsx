import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface MatchDetail { id:string; status:string; my_item?:any; other_item?:any; other_user?:any; created_at?:string; }

export function MatchPage() {
  const { id } = useParams<{id:string}>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<MatchDetail|null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("treqe-token") || !id || id === "demo") { setLoading(false); return; }
    api.get<MatchDetail>(`/api/matches/${id}`).then(setMatch).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: "accept"|"reject"|"cancel") => {
    if (!match) return; setActing(true);
    try { await api.post(`/api/matches/${match.id}/${action}`); const updated = await api.get<MatchDetail>(`/api/matches/${match.id}`); setMatch(updated); } catch {}
    setActing(false);
  };

  if (!localStorage.getItem("treqe-token")) return <div style={{padding:60,textAlign:"center"}}><p>Necesitas iniciar sesion</p><a href="/login">Iniciar sesion</a></div>;

  const S = {card:{background:"#FFF",border:"1px solid #E5E0D8",borderRadius:4,padding:16,marginBottom:12},label:{fontSize:".65rem",fontWeight:600,textTransform:"uppercase" as const,letterSpacing:".08em",color:"#8A8580",marginBottom:4},value:{fontSize:".85rem",fontWeight:500}};

  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh"}}>
      <div className="treqe-header"><div className="treqe-header__left">
        <button className="treqe-header__back" onClick={() => navigate(-1)}><i className="fas fa-chevron-left"></i></button>
        <span className="treqe-header__title">Match {id !== "demo" ? `#${(id||"").slice(-6)}` : ""}</span>
      </div></div>
      <div style={{padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
        {loading ? <p style={{textAlign:"center",color:"#8A8580"}}>Cargando...</p> :
         !match ? <p style={{textAlign:"center",color:"#8A8580",padding:40}}>No se encontro el match</p> : <>
          <div style={{textAlign:"center",marginBottom:20}}>
            <span style={{fontSize:".7rem",padding:"4px 12px",borderRadius:99,background:match.status==="active"?"#dcfce7":"#f3f4f6",color:match.status==="active"?"#22c55e":"#8A8580",fontWeight:600}}>{match.status}</span>
          </div>
          <div style={{display:"flex",gap:12,marginBottom:20}}>
            <div style={{...S.card,flex:1,textAlign:"center"}}><div style={S.label}>Tu articulo</div><div style={S.value}>{match.my_item?.title || "—"}</div><div style={{fontSize:".7rem",color:"#8A8580"}}>{match.my_item?.price ? match.my_item.price+" EUR" : ""}</div></div>
            <div style={{display:"flex",alignItems:"center",fontSize:"1.2rem",color:"#8A8580"}}><i className="fas fa-exchange-alt"></i></div>
            <div style={{...S.card,flex:1,textAlign:"center"}}><div style={S.label}>Su articulo</div><div style={S.value}>{match.other_item?.title || "—"}</div><div style={{fontSize:".7rem",color:"#8A8580"}}>{match.other_item?.price ? match.other_item.price+" EUR" : ""}</div></div>
          </div>
          {match.other_user && <div style={S.card}><div style={S.label}>Usuario</div><div style={S.value}>{match.other_user.name} {match.other_user.location ? " - "+match.other_user.location : ""}</div></div>}
          {match.status === "active" && (
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button onClick={() => handleAction("accept")} disabled={acting} style={{flex:1,padding:"12px",background:"#1C1915",color:"#FFF",border:"none",borderRadius:4,fontWeight:600,cursor:"pointer"}}>Aceptar</button>
              <button onClick={() => handleAction("reject")} disabled={acting} style={{flex:1,padding:"12px",background:"#FFF",color:"#DC2626",border:"1px solid #E5E0D8",borderRadius:4,fontWeight:600,cursor:"pointer"}}>Rechazar</button>
            </div>
          )}
        </>}
      </div>
    </div>
  );
}

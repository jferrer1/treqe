"""Cleanup worker — tareas de mantenimiento periódicas."""
import sys, os
from datetime import datetime, timedelta
from .celery_app import celery_app


@celery_app.task(name="src.workers.cleanup_worker.run_cleanup")
def run_cleanup():
    """
    Limpieza periódica (cada hora):
    - Expira matches > 24h sin respuesta
    - Libera artículos para nuevos ciclos
    - Limpia rejected_pairs > 7 días
    """
    import sqlalchemy
    from sqlalchemy import text
    
    db_url = os.environ.get("DATABASE_URL", "sqlite:///treqe_dev.db")
    if db_url and "postgresql://" in db_url and "+" not in db_url:
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    
    results = {"matches_expired": 0, "rejected_cleaned": 0, "products_cleaned": 0}
    
    try:
        engine = sqlalchemy.create_engine(db_url)
        with engine.connect() as conn:
            now = datetime.utcnow()
            expire_threshold = now - timedelta(hours=24)
            
            # Find expired pending matches
            rows = conn.execute(text(
                "SELECT id FROM matches WHERE status = 'pending' AND created_at < :threshold"
            ), {"threshold": expire_threshold})
            expired_ids = [row[0] for row in rows]
            
            for mid in expired_ids:
                # Cancel the match
                conn.execute(text(
                    "UPDATE matches SET status = 'expired' WHERE id = :id"
                ), {"id": mid})
                
                # Get participants to release their products
                rows2 = conn.execute(text(
                    "SELECT product_id, user_id FROM match_participants WHERE match_id = :mid"
                ), {"mid": mid})
                
                for product_id, user_id in rows2:
                    # Release product back to active
                    conn.execute(text(
                        "UPDATE products SET status = 'active' WHERE id = :pid"
                    ), {"pid": product_id})
                    
                    # Notify user
                    notif_id = str(__import__('uuid').uuid4())
                    conn.execute(text(
                        "INSERT INTO notifications (id, user_id, type, title, body, action_url, created_at, read) "
                        "VALUES (:id, :uid, 'match_timeout', 'Match expirado', :msg, :url, :now, false)"
                    ), {
                        "id": notif_id, "uid": user_id,
                        "msg": "El tiempo para aceptar el intercambio ha expirado. Tu artículo vuelve a estar disponible para nuevos matches.",
                        "url": "/treqes", "now": now
                    })
                    
                    # Mark participant as timeout
                    conn.execute(text(
                        "UPDATE match_participants SET status = 'timeout' WHERE match_id = :mid AND user_id = :uid"
                    ), {"mid": mid, "uid": user_id})
                    
                    # Re-activate offers related to this product
                    conn.execute(text(
                        "UPDATE offers SET status = 'active' WHERE (product_id_offers = :pid OR product_id_wants = :pid) AND status = 'matched'"
                    ), {"pid": product_id})
                
                results["matches_expired"] += 1
            
            # Clean up rejected pairs > 7 days
            # (rejected_pairs table has TTL tracked by created_at)
            conn.execute(text(
                "DELETE FROM rejected_pairs WHERE created_at < :threshold"
            ), {"threshold": now - timedelta(days=7)})
            results["rejected_cleaned"] = conn.rowcount if hasattr(conn, 'rowcount') else 0
            
            conn.commit()
        
        engine.dispose()
        print(f"[cleanup_worker] Done: {results}", file=sys.stderr)
        
    except Exception as e:
        print(f"[cleanup_worker] Error: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
    
    return results

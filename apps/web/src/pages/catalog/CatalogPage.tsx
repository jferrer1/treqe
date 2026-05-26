import { useEffect } from "react";

export function CatalogPage() {
  useEffect(() => {
    window.location.replace("/catalogo.html");
  }, []);
  return null;
}

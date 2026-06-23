// Global search + filter composable for catalog
(window as any).treqeSearch = (val: string) => {
  const v = val.toLowerCase().trim();
  
  // Get active filter state
  const sel = (document.getElementById("categorySelect") as HTMLSelectElement)?.value?.toLowerCase() || "";
  const activePrice = document.querySelector(".filter-quick-btn.active") as HTMLElement | null;
  const activeCond = document.querySelector("#filterModal .filter-chip.active") as HTMLElement | null;
  
  let minPrice = 0, maxPrice = Infinity;
  if (activePrice) {
    const txt = activePrice.textContent?.trim() || '';
    if (txt.startsWith('Hasta')) { minPrice = 0; maxPrice = parseFloat(txt.replace(/[^0-9]/g,'')) || 50; }
    else if (txt.startsWith('+')) { minPrice = parseFloat(txt.replace(/[^0-9]/g,'')) || 500; maxPrice = Infinity; }
    else { const parts = txt.split('-').map(s => parseFloat(s.replace(/[^0-9]/g,'')) || 0); minPrice = parts[0] || 0; maxPrice = parts[1] || Infinity; }
  }
  const condFilter = activeCond?.dataset?.condition || "";
  
  document.querySelectorAll(".item-card").forEach((c: any) => {
    const title = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase();
    const cat = (c.dataset.category || "").toLowerCase();
    const priceText = c.querySelector(".price-tag")?.textContent || "0";
    const price = parseFloat(priceText.replace(/[^0-9,.]/g, "").replace(",", ".")) || 0;
    const cond = c.dataset.condition || "";
    
    const searchMatch = !v || title.includes(v);
    const catMatch = !sel || cat === sel;
    const priceMatch = price >= minPrice && price <= maxPrice;
    const condMatch = !condFilter || condFilter === "any" || cond === condFilter;
    
    c.style.setProperty("display", searchMatch && catMatch && priceMatch && condMatch ? "" : "none", "important");
  });
};

// Enhanced filter application — also respects active search
(window as any).treqeApplyFilters = () => {
  const si = document.getElementById("searchInput") as HTMLInputElement | null;
  (window as any).treqeSearch(si?.value || "");
  
  // Update filter chips
  const sel = (document.getElementById("categorySelect") as HTMLSelectElement)?.value || "";
  const activePrice = document.querySelector(".filter-quick-btn.active") as HTMLElement | null;
  const activeCond = document.querySelector("#filterModal .filter-chip.active") as HTMLElement | null;
  
  // Remove old chips
  document.getElementById("active-filters")?.remove();
  
  const activeFilters: string[] = [];
  if (sel) activeFilters.push(sel);
  const priceLabel = activePrice?.textContent?.trim();
  if (priceLabel) activeFilters.push(priceLabel);
  const condLabel = activeCond?.textContent?.trim();
  if (condLabel && condLabel !== "Cualquiera") activeFilters.push(condLabel);
  
  if (activeFilters.length > 0) {
    const container = document.createElement("div");
    container.id = "active-filters";
    container.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;padding:8px 16px;align-items:center";
    
    activeFilters.forEach(label => {
      const chip = document.createElement("span");
      chip.style.cssText = "display:inline-flex;align-items:center;gap:6px;padding:4px 10px;background:#1C1915;color:#F9F7F2;font-family:'IBM Plex Mono',monospace;font-size:.5rem;text-transform:uppercase;letter-spacing:.06em";
      chip.innerHTML = `${label} <span style="cursor:pointer;margin-left:2px;opacity:.7">&times;</span>`;
      (chip.querySelector("span") as HTMLElement).addEventListener("click", () => {
        chip.remove();
        // Reset corresponding filter
        if (label === sel) (document.getElementById("categorySelect") as HTMLSelectElement).value = "";
        else if (label === priceLabel) document.querySelectorAll(".filter-quick-btn").forEach((b: any) => b.classList.remove("active"));
        else if (label === condLabel) {
          document.querySelectorAll("#filterModal .filter-chip").forEach((b: any) => b.classList.remove("active"));
          document.querySelector("#filterModal .filter-chip[data-condition=any]")?.classList.add("active");
        }
        (window as any).treqeApplyFilters();
      });
      container.appendChild(chip);
    });
    
    // Add clear all button
    const clearAll = document.createElement("button");
    clearAll.style.cssText = "background:none;border:none;color:#DC2626;font-family:'IBM Plex Mono',monospace;font-size:.45rem;cursor:pointer;text-transform:uppercase;letter-spacing:.06em;padding:4px 8px";
    clearAll.textContent = "Limpiar todo";
    clearAll.addEventListener("click", () => {
      (document.getElementById("categorySelect") as HTMLSelectElement).value = "";
      document.querySelectorAll(".filter-quick-btn").forEach((b: any) => b.classList.remove("active"));
      document.querySelectorAll("#filterModal .filter-chip").forEach((b: any) => b.classList.remove("active"));
      document.querySelector("#filterModal .filter-chip[data-condition=any]")?.classList.add("active");
      (window as any).treqeApplyFilters();
    });
    container.appendChild(clearAll);
    
    const toolbar = document.querySelector(".toolbar");
    if (toolbar) toolbar.after(container);
  }
  
  document.getElementById("filterModal")?.classList.remove("visible");
};

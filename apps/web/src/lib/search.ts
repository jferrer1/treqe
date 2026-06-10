// Global search function for catalog
(window as any).treqeSearch = (val: string) => {
  const v = val.toLowerCase().trim();
  document.querySelectorAll(".item-card").forEach((c: any) => {
    const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase();
    c.style.setProperty("display", !v || t.includes(v) ? "" : "none", "important");
  });
  // When clearing search, re-apply active filters
  if (!v && document.querySelector("#active-filters")) {
    const activeSort = document.querySelector(".sort-option.active") as HTMLElement | null;
    if (activeSort?.dataset.sort) {
      setTimeout(() => {
        const cards = Array.from(document.querySelectorAll(".item-card"));
        if (activeSort.dataset.sort === "price-asc") cards.sort((a: any, b: any) => parseFloat(a.querySelector(".price-tag")?.textContent?.replace(/[^0-9,.]/g,"").replace(",",".")||"0") - parseFloat(b.querySelector(".price-tag")?.textContent?.replace(/[^0-9,.]/g,"").replace(",",".")||"0"));
        else if (activeSort.dataset.sort === "price-desc") cards.sort((a: any, b: any) => parseFloat(b.querySelector(".price-tag")?.textContent?.replace(/[^0-9,.]/g,"").replace(",",".")||"0") - parseFloat(a.querySelector(".price-tag")?.textContent?.replace(/[^0-9,.]/g,"").replace(",",".")||"0"));
        else if (activeSort.dataset.sort === "name") cards.sort((a: any, b: any) => (a.querySelector(".item-card__title")?.textContent||"").localeCompare(b.querySelector(".item-card__title")?.textContent||""));
        const grid = document.querySelector(".catalog");
        if (grid) cards.forEach(c => grid.appendChild(c));
      }, 10);
    }
  }
};

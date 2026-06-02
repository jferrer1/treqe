// Global search function for catalog
(window as any).treqeSearch = (val: string) => {
  const v = val.toLowerCase().trim();
  document.querySelectorAll(".item-card").forEach((c: any) => {
    const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase();
    c.style.setProperty("display", !v || t.includes(v) ? "" : "none", "important");
  });
};

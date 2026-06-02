f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Replace dynamic padding with CSS that re-calculates on resize
old = 'if (sectionTitle) { sectionTitle.after(container); const grid = document.querySelector(".catalog"); if (grid) { const gs = window.getComputedStyle(grid); container.style.paddingLeft = (grid.getBoundingClientRect().left + parseFloat(gs.paddingLeft || "0")) + "px"; } }'
new = '''if (sectionTitle) { sectionTitle.after(container);
      const updateChipPos = () => {
        const grid = document.querySelector(".catalog");
        if (grid) {
          const gs = window.getComputedStyle(grid);
          container.style.paddingLeft = (grid.getBoundingClientRect().left + parseFloat(gs.paddingLeft || "0")) + "px";
        }
      };
      updateChipPos();
      window.addEventListener("resize", updateChipPos);
    }'''
c = c.replace(old, new)

old2 = 'if (tb) { tb.after(container); const grid2 = document.querySelector(".catalog"); if (grid2) { const gs2 = window.getComputedStyle(grid2); container.style.paddingLeft = (grid2.getBoundingClientRect().left + parseFloat(gs2.paddingLeft || "0")) + "px"; } }'
new2 = '''if (tb) { tb.after(container);
      const updateChipPos2 = () => {
        const grid2 = document.querySelector(".catalog");
        if (grid2) {
          const gs2 = window.getComputedStyle(grid2);
          container.style.paddingLeft = (grid2.getBoundingClientRect().left + parseFloat(gs2.paddingLeft || "0")) + "px";
        }
      };
      updateChipPos2();
      window.addEventListener("resize", updateChipPos2);
    }'''
c = c.replace(old2, new2)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Resize listener added")

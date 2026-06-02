f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8').read()

# Replace chip insertion: append to toolbar + add flex-wrap
c = c.replace(
    'if (sectionTitle) { sectionTitle.after(container); container.style.paddingLeft = (sectionTitle as HTMLElement).offsetLeft + "px"; }',
    'if (sectionTitle) { sectionTitle.style.flexWrap = "wrap"; sectionTitle.appendChild(container); }'
)
c = c.replace(
    'if (tb) { tb.after(container); container.style.paddingLeft = (tb as HTMLElement).offsetLeft + "px"; }',
    'if (tb) { (tb as HTMLElement).style.flexWrap = "wrap"; tb.appendChild(container); }'
)

open(f, 'w', encoding='utf-8').write(c)
print("Chip inside toolbar with flex-wrap")

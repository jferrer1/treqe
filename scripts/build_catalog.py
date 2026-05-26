"""Take MIB catalog HTML, remove fake products, add API script."""
import re, os
BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "..", "mib-pages")
DST = os.path.join(BASE, "..", "apps", "web", "public")

html = open(os.path.join(SRC, "v1-catalogo.html"), encoding="utf-8").read()

# Encontrar el inicio del catalogo
catalog_start = html.find('<div class="catalog"')
# Encontrar el paging sentinel (fin del catalogo)
sentinel = html.find('<div id="pagingSentinel"')

# Reemplazar todo el contenido entre catalog y sentinel con un loader
before = html[:catalog_start]
after = html[sentinel:]

# Extraer cierre del div catalog
catalog_close = after.find('</div>') + 6

# Crear nueva seccion de catalogo con placeholder
new_catalog = '''<div class="catalog" id="catalog">
  <div id="pagingSentinel"><i class="fas fa-spinner fa-pulse"></i> CARGANDO ARTICULOS...</div>
</div>

<script>
// Cargar productos desde la API
const API = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : 'https://treqe-production-8518.up.railway.app';

async function loadCatalog() {
  try {
    const res = await fetch(API + '/api/products/?limit=70');
    const data = await res.json();
    renderProducts(data.items);
  } catch(e) {
    document.getElementById('pagingSentinel').innerHTML = 'Error al cargar';
  }
}

const BG_COLORS = ["#2D2D2D","#3A2A1A","#1A2A3A","#2A1A2A","#1A3A2A","#3A3A1A","#2A2A3A","#3A2A3A","#1A1A2A","#2A3A2A","#3A1A1A","#1A3A3A","#2D3D2D","#3A2A2A","#1A3A1A","#2A2A1A","#2A3A1A","#3A1A2A","#1A1A3A","#3A3A2A"];

function renderProducts(products) {
  const catalog = document.getElementById('catalog');
  catalog.innerHTML = products.map((p, i) => 
    '<div class="item-card" onclick="window.location.href=\\'/articulo/' + p.id + '\\'">' +
    '<div class="item-card__image" style="background:' + BG_COLORS[i % BG_COLORS.length] + '">' +
    '<button class="like-btn" onclick="event.stopPropagation();this.classList.toggle(\\'liked\\')"><i class="far fa-heart"></i></button>' +
    '<i class="fas fa-box placeholder-icon white"></i>' +
    '<span class="price-tag">€' + p.price + '</span></div>' +
    '<div class="item-card__info"><div class="item-card__title">' + p.title + '</div>' +
    '<div class="item-card__meta"><i class="fas fa-tag"></i> ' + p.category + '</div></div></div>'
  ).join('');
  document.getElementById('articleCount').textContent = products.length + ' articulos';
}

loadCatalog();
</script>
'''

# Armar nuevo HTML
new_html = before + new_catalog + after[catalog_close:]

# Fix logo path
new_html = new_html.replace('../../assets/treqe-logo-mib.png', '/treqe-logo.png')
new_html = new_html.replace('../assets/treqe-logo-mib.png', '/treqe-logo.png')

with open(os.path.join(DST, "catalogo.html"), "w", encoding="utf-8") as f:
    f.write(new_html)

print(f"Created: {len(new_html)} chars")

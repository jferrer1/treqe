f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\product\ProductDetailPage.tsx'
c = open(f, 'r', encoding='utf-8').read()
c = c.replace('const CONDITIONS: Record<string, string> = {\n  new: "Nuevo", like_new: "Como nuevo", good: "Buen estado", fair: "Aceptable"\n};\n\n', '')
open(f, 'w', encoding='utf-8').write(c)
print('Removed CONDITIONS')

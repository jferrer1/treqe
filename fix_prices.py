import re

files = [
    r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx",
    r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\profile\ProfilePage.tsx",
    r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\matches\MatchesPage.tsx",
]

for f in files:
    with open(f, 'r', encoding='utf-8') as fh:
        c = fh.read()
    old = c
    
    # Replace price display patterns to use comma as decimal separator
    # Template literal: &euro;${p.price} -> &euro;${String(p.price).replace('.', ',')}
    # Template literal: \u00A4${p.price} etc
    
    # Replace &euro;${...price} patterns
    c = re.sub(r'&euro;\$\{(p\.price|m\.my_item\?\.price[^}]*|m\.other_item\?\.price[^}]*)\}',
               lambda m: f'&euro;${{String({m.group(1)}).replace(".", ",")}}', c)
    
    # Replace \u20AC${...price} patterns  
    c = re.sub(r'\\u20AC\$\{(p\.price|m\.my_item\?\.price[^}]*|m\.other_item\?\.price[^}]*)\}',
               lambda m: f'\\u20AC${{String({m.group(1)}).replace(".", ",")}}', c)
    
    # Replace €${...price} patterns (literal euro sign)
    c = re.sub(r'\u20AC\$\{(p\.price|m\.my_item\?\.price[^}]*|m\.other_item\?\.price[^}]*)\}',
               lambda m: f'\u20AC${{String({m.group(1)}).replace(".", ",")}}', c)
    
    if c != old:
        with open(f, 'w', encoding='utf-8', newline='') as fh:
            fh.write(c)
        print(f"Fixed: {f.split(chr(92))[-1]}")
    else:
        print(f"No changes: {f.split(chr(92))[-1]}")

print("Done")

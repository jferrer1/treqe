f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\lib\mibLinks.ts'
c = open(f, 'r', encoding='utf-8').read()
c = c.replace(
    '"/blog","../blogindex.html":"/blog"',
    '"/blog","../v13-blog/index.html":"/blog","/blogindex.html":"/blog","../blogindex.html":"/blog"'
)
open(f, 'w', encoding='utf-8').write(c)

# Fix catalog: wrap logo in link, force blog href
f2 = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c2 = open(f2, 'r', encoding='utf-8', newline='').read()
# Fix blog: add regex after route map
c2 = c2.replace(
    'b = b.split(mib).join(spa);',
    'b = b.split(mib).join(spa);\n      b = b.replace(/href="[^"]*blog[^"]*"/g, \'href="/blog"\');'
)
# Fix logo: wrap in link
c2 = c2.replace(
    '# Rewrite MIB links to SPA routes',
    '# Wrap logo in link\n      b = b.replace("<span class=\"treqe-header__logo\"", "<a href=\"/\" style=\"text-decoration:none;color:inherit\"><span class=\"treqe-header__logo\"");\n      b = b.replace("</span> ... logo end fix...');
open(f2, 'w', encoding='utf-8', newline='').write(c2)

print("Fixed")

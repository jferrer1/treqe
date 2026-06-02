f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\lib\mibLinks.ts'
c = open(f, 'r', encoding='utf-8').read()
if '../blogindex.html' not in c:
    c = c.replace(
        '"../v13-blog/":"/blog"',
        '"../v13-blog/":"/blog","../blogindex.html":"/blog"'
    )
    open(f, 'w', encoding='utf-8').write(c)
    print("Blog link added to mibLinks")
else:
    print("Already there")

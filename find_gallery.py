import re
h = open(r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\public\mib\v2-detalle.html', encoding='utf-8').read()
b = re.search(r'<body>(.*?)</body>', h, re.DOTALL).group(1)
# Find the gallery slides
idx = b.find('gallery-slide')
if idx > 0:
    print(b[max(0,idx-50):idx+2000])

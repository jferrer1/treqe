f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\matches\MatchesPage.tsx'
c = open(f, 'r', encoding='utf-8').read()
c = c.replace('\u005cu20AC+m.my_item.price', '\u005cu20AC+String(m.my_item.price).replace(".", ",")')
c = c.replace('\u005cu20AC+m.other_item.price', '\u005cu20AC+String(m.other_item.price).replace(".", ",")')
open(f, 'w', encoding='utf-8').write(c)
print("Fixed MatchesPage prices")

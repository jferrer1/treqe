import re

# Fix MatchesPage
with open(r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\matches\MatchesPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'import { api } from "@/lib/api";',
    'import { api } from "@/lib/api";\nimport { rewriteMibLinks } from "@/lib/mibLinks";'
)
c = c.replace(
    'b = b.replace(/<!-- ===== ACTIVES',
    'b = rewriteMibLinks(b);\n      b = b.replace(/<!-- ===== ACTIVES'
)

with open(r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\matches\MatchesPage.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("MatchesPage fixed")

# Fix UploadPage
with open(r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\upload\UploadPage.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'b = b.replace(/\s+on\\w+="[^"]*"/g, "");',
    'b = rewriteMibLinks(b);\n      b = b.replace(/\\s+on\\w+="[^"]*"/g, "");'
)

with open(r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\upload\UploadPage.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("UploadPage fixed")

import re
c = open(r"apps/web/src/styles/treqe-mib.css", encoding="utf-8").read()
print(f"Size: {len(c)} chars")
print(f":root blocks: {c.count(':root')}")
print(f"body {{: {len(re.findall(r'body\s*\{', c))}")
# Check for dark mode overrides that might conflict
dm = re.findall(r'body\.dark\s*\{[^}]*\}', c)
print(f"body.dark rules: {len(dm)}")
# Check if font variables exist
print(f"--font-mono: {'--font-mono' in c}")
print(f"--font-sans: {'--font-sans' in c}")
print(f"--bg: {'--bg' in c}")
# First line
lines = c.strip().split('\n')
print(f"First line: {lines[0][:100]}")

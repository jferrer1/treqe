import re
p = r"apps/web/src/styles/treqe-mib.css"
c = open(p, encoding="utf-8").read()
c = re.sub(r'@import url\("[^"]*fonts.googleapis.com[^"]*"\);\s*', '', c)
c = re.sub(r'@import url\("[^"]*font-awesome[^"]*"\);\s*', '', c)
c = re.sub(r'@import url\("[^"]*cdnjs[^"]*"\);\s*', '', c)
open(p, "w", encoding="utf-8").write(c)
print(f"Cleaned: {len(c)} chars")

"""Merge ALL CSS from all 33 MIB pages into a single treqe-mib.css."""
import re, os

src = os.path.join(os.path.dirname(__file__), "..", "mib-pages")
dst = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "styles", "treqe-mib.css")

# Start with the most complete CSS (catalog has base styles + all shared components)
all_css = ""
processed = set()

for f in sorted(os.listdir(src)):
    if not f.endswith(".html"):
        continue
    html = open(os.path.join(src, f), encoding="utf-8").read()
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL)
    for css in styles:
        all_css += f"\n/* === {f} === */\n{css.strip()}\n"
        print(f"  {f}: {len(css)} chars")

with open(dst, "w", encoding="utf-8") as fh:
    fh.write(all_css)

print(f"\nTotal CSS: {len(all_css)} chars -> {dst}")

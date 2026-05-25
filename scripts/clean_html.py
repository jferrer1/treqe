"""Pre-clean MIB HTML: strip ALL JavaScript before conversion."""
import re, sys

html = open(sys.argv[1], encoding="utf-8").read()

# Strip ALL script tags
html = re.sub(r"<script[^>]*>.*?</script>", "", html, flags=re.DOTALL)

# Strip ALL event handlers (onclick, onsubmit, onchange, oninput, onload, etc.)
html = re.sub(r'\s+on\w+="[^"]*"', '', html)

# Strip ALL inline JS in href="javascript:..."
html = re.sub(r'href="javascript:[^"]*"', 'href="#"', html)

# Strip template literals with ${...} inside JS strings that the converter misses
# (these appear in script-like contexts inside the HTML)

# Strip style tags (CSS already extracted)
html = re.sub(r"<style[^>]*>.*?</style>", "", html, flags=re.DOTALL)

out = sys.argv[2] if len(sys.argv) > 2 else sys.argv[1] + ".clean.html"
with open(out, "w", encoding="utf-8") as f:
    f.write(html)
print(f"Cleaned: {out}")

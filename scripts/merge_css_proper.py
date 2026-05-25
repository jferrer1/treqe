"""Merge ALL MIB page CSS into a single, clean, PostCSS-compatible file."""
import re, os

SRC = os.path.join(os.path.dirname(__file__), "..", "mib-pages")
DST = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "styles", "treqe-mib.css")

all_rules = []      # (selector, properties_text) tuples
seen_selectors = set()  # deduplicate identical selectors
base_selectors = set()  # selectors from catalog (most complete)

# First pass: collect catalog selectors as base reference
catalog_html = open(os.path.join(SRC, "v1-catalogo.html"), encoding="utf-8").read()
catalog_styles = re.findall(r"<style[^>]*>(.*?)</style>", catalog_html, re.DOTALL)
for css in catalog_styles:
    for rule in re.findall(r"([^{]+)\{([^}]+)\}", css):
        sel = rule[0].strip()
        props = rule[1].strip()
        if sel and props:
            base_selectors.add(sel)

def fix_css_props(props):
    """Fix common CSS syntax errors."""
    # Fix missing semicolons between properties (space before property name)
    props = re.sub(r'(\d)(px|rem|em|%|vw|vh|s)\s+([a-z-]+):', r'\1\2; \3:', props)
    props = re.sub(r'(auto|none|normal)\s+([a-z-]+):', r'\1; \2:', props)
    # Fix double spaces
    props = re.sub(r'\s{2,}', ' ', props)
    # Ensure trailing semicolon
    if props and not props.endswith(';'):
        props += ';'
    return props

# Process all pages
for fname in sorted(os.listdir(SRC)):
    if not fname.endswith(".html"):
        continue
    html = open(os.path.join(SRC, fname), encoding="utf-8").read()
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL)
    
    for css in styles:
        # Strip @import and @font-face (handled by index.html)
        css = re.sub(r'@import[^;]*;', '', css)
        css = re.sub(r'@font-face\s*\{[^}]*\}', '', css)
        
        # Parse rules
        rules = re.findall(r"([^{]+)\{([^}]+)\}", css)
        for sel, props in rules:
            sel = sel.strip()
            props = fix_css_props(props.strip())
            if not sel or not props:
                continue
            # Normalize selector (collapse whitespace)
            sel_norm = re.sub(r'\s+', ' ', sel)
            if sel_norm in seen_selectors:
                continue
            seen_selectors.add(sel_norm)
            all_rules.append((sel, props))

# Group: base rules first, then page-specific rules
base = []
specific = []
for sel, props in all_rules:
    sel_norm = re.sub(r'\s+', ' ', sel)
    if sel_norm in base_selectors:
        base.append((sel, props))
    else:
        specific.append((sel, props))

# Write: base + specific
output = "/* === TREQE MIB DESIGN SYSTEM — All 33 pages === */\n\n"
output += "/* === Base (shared across all pages) === */\n"
for sel, props in base:
    output += f"{sel} {{ {props} }}\n"

output += "\n/* === Page-specific styles === */\n"
for sel, props in specific:
    output += f"{sel} {{ {props} }}\n"

with open(DST, "w", encoding="utf-8") as f:
    f.write(output)

print(f"Total rules: {len(all_rules)} (base: {len(base)}, specific: {len(specific)})")
print(f"CSS size: {len(output)} chars -> {DST}")

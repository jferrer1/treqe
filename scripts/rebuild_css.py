"""Rebuild treqe-mib.css — single :root, single body, deduplicated rules."""
import re, os

SRC = os.path.join(os.path.dirname(__file__), "..", "mib-pages")
DST = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "styles", "treqe-mib.css")

# Base CSS from catalog (most complete design system)
catalog = open(os.path.join(SRC, "v1-catalogo.html"), encoding="utf-8").read()
catalog_css = re.findall(r"<style[^>]*>(.*?)</style>", catalog, re.DOTALL)[0]

# Extract :root, html, body from catalog as the MASTER
root_match = re.search(r":root\s*\{([^}]+)\}", catalog_css)
html_match = re.search(r"html\s*\{([^}]+)\}", catalog_css)
body_match = re.search(r"body\s*\{([^}]+)\}", catalog_css)

master_root = root_match.group(0) if root_match else ""
master_html = html_match.group(0) if html_match else ""
master_body = body_match.group(0) if body_match else ""

# Collect all page-specific rules (excluding :root, html, body, body.dark, @import, @font-face)
all_rules = []
seen_selectors = set()

for fname in sorted(os.listdir(SRC)):
    if not fname.endswith(".html"):
        continue
    html = open(os.path.join(SRC, fname), encoding="utf-8").read()
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL)
    
    for css in styles:
        # Strip @import, @font-face, @media (keep in output but don't parse as rules)
        css_clean = re.sub(r'@import[^;]*;', '', css)
        css_clean = re.sub(r'@font-face\s*\{[^}]*\}', '', css_clean)
        
        rules = re.findall(r"([^{]+)\{([^}]+)\}", css_clean)
        for sel, props in rules:
            sel = sel.strip()
            # Skip global elements (handled by master)
            if sel in (":root", "html", "body", "body.dark"):
                continue
            # Normalize
            sel_norm = re.sub(r'\s+', ' ', sel)
            props_norm = re.sub(r'\s+', ' ', props.strip())
            # Fix missing semicolons
            props_norm = re.sub(r'(\d)(px|rem|em|%)\s+([a-z-]+):', r'\1\2; \3:', props_norm)
            if not props_norm.endswith(';'):
                props_norm += ';'
            if sel_norm in seen_selectors:
                continue
            seen_selectors.add(sel_norm)
            all_rules.append((sel, props_norm))

# Collect @media queries separately
media_queries = []
for fname in sorted(os.listdir(SRC)):
    if not fname.endswith(".html"):
        continue
    html = open(os.path.join(SRC, fname), encoding="utf-8").read()
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL)
    for css in styles:
        mq_blocks = re.findall(r"(@media[^{]*\{.*?\})", css, re.DOTALL)
        for mq in mq_blocks:
            mq_clean = re.sub(r'\s+', ' ', mq)
            if mq_clean not in media_queries:
                media_queries.append(mq_clean)

# Build output
output = """/* === TREQE MIB — Complete Design System (33 pages) === */

"""
output += master_root + "\n"
output += master_html + "\n"
output += master_body + "\n\n"

# Dark mode body
for fname in sorted(os.listdir(SRC)):
    if not fname.endswith(".html"): continue
    html = open(os.path.join(SRC, fname), encoding="utf-8").read()
    styles = re.findall(r"<style[^>]*>(.*?)</style>", html, re.DOTALL)
    for css in styles:
        dm = re.search(r"body\.dark\s*\{([^}]+)\}", css)
        if dm:
            output += f"body.dark {{ {dm.group(1).strip()} }}\n"
            break

output += "\n/* === Shared Components === */\n"
for sel, props in all_rules:
    if any(x in sel for x in ['.header', '.bottom-nav', '.section-title', '.toolbar', '.tool-btn', 
                               '.blog-link', '.search-icon', '.search-expand', '.logo', '.treqe-logo',
                               '.demo-notice', '.empty-state', '.match-banner', '.catalog', '.item-card',
                               '.filter-modal', '.sort-dropdown', '.active-filters', '.like-btn',
                               '.price-tag', '.dm-toggle', '.scoring-info', '.nav-item', '.nav-add-btn',
                               '.nav-badge', '.notification-btn', '.notification-badge', '.trade-btn',
                               '.placeholder-icon', '.item-card__video-badge']):
        output += f"{sel} {{ {props} }}\n"

output += "\n/* === Page-Specific Styles (ALL) === */\n"
for sel, props in all_rules:
    if not any(x in sel for x in ['.header', '.bottom-nav', '.section-title', '.toolbar', '.tool-btn',
                                   '.blog-link', '.search-icon', '.search-expand', '.logo', '.treqe-logo',
                                   '.demo-notice', '.empty-state', '.match-banner', '.catalog', '.item-card',
                                   '.filter-modal', '.sort-dropdown', '.active-filters', '.like-btn',
                                   '.price-tag', '.dm-toggle', '.scoring-info', '.nav-item', '.nav-add-btn',
                                   '.nav-badge', '.notification-btn', '.notification-badge', '.trade-btn',
                                   '.placeholder-icon', '.item-card__video-badge']):
        output += f"{sel} {{ {props} }}\n"

output += "\n/* === Media Queries === */\n"
for mq in media_queries:
    output += mq + "\n"

with open(DST, "w", encoding="utf-8") as f:
    f.write(output)

print(f"Output: {len(output)} chars")
print(f"Rules: {len(all_rules)}")
print(f"Media queries: {len(media_queries)}")

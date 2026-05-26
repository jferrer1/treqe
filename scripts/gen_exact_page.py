"""Generate a React component that renders EXACT MIB HTML inline."""
import re, sys, os

html_file = sys.argv[1]
component_name = sys.argv[2]
out_file = sys.argv[3]

html = open(html_file, encoding="utf-8").read()

# Extract style and body
style_match = re.search(r"<style>(.*?)</style>", html, re.DOTALL)
body_match = re.search(r"<body>(.*?)</body>", html, re.DOTALL)

style = style_match.group(1) if style_match else ""
body = body_match.group(1) if body_match else ""

# Clean body
body = re.sub(r"<script[\s\S]*?</script>", "", body)
body = re.sub(r'\s+on\w+="[^"]*"', "", body)
body = body.replace("../../assets/treqe-logo-mib.png", "/treqe-logo.png")

# Build the component
code = f'''import {{ useEffect }}

export function {component_name}() {{
  useEffect(() => {{
    // Inject page-specific CSS into head
    const el = document.getElementById("page-css");
    if (!el) {{
      const s = document.createElement("style");
      s.id = "page-css";
      s.textContent = `{style}`;
      document.head.appendChild(s);
    }}
    return () => document.getElementById("page-css")?.remove();
  }}, []);

  return <div dangerouslySetInnerHTML={{ __html: `{body}` }} />;
}}
'''

with open(out_file, "w", encoding="utf-8") as f:
    f.write(code)
print(f"OK: {out_file} ({len(code)} chars)")

"""Strip unused Link imports from generated pages."""
import os, re

root = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "pages")
for dirpath, _, filenames in os.walk(root):
    for f in filenames:
        if not f.endswith(".tsx"):
            continue
        path = os.path.join(dirpath, f)
        content = open(path, encoding="utf-8").read()
        if "<Link " not in content:
            content = content.replace('import { Link } from "react-router-dom";\n\n', "")
            with open(path, "w", encoding="utf-8") as fh:
                fh.write(content)
            print(f"Fixed: {f}")
print("Done")

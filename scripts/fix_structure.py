"""Fix structural issues in auto-converted pages."""
import os, re

BASE = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "pages")
FIXES = {
    "blog/BlogPage.tsx": [
        # Remove extra closing div (mismatched from removed script/style)
        ('</div>\n </div>\n\n \n <main', '</div>\n\n <main'),
    ],
    "matches/MatchesPage.tsx": [
        ('</div>\n </div>\n\n \n <div class', '</div>\n\n <div class'),
    ],
    "notifications/NotificationsPage.tsx": [
        ('</div>\n </div>\n\n \n <div class', '</div>\n\n <div class'),
    ],
    "profile/ProfilePage.tsx": [
        ('</div>\n </div>\n\n \n <div class', '</div>\n\n <div class'),
    ],
}

for fname, replacements in FIXES.items():
    path = os.path.join(BASE, fname)
    if not os.path.exists(path):
        print(f"SKIP: {fname}")
        continue
    content = open(path, encoding="utf-8").read()
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            print(f"  Replaced in {fname}")
    open(path, "w", encoding="utf-8").write(content)
    print(f"Fixed: {fname}")
print("Done")

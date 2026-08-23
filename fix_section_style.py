import os
import glob
import re

pages = glob.glob("apps/hub/src/app/design-system/components/**/page.tsx", recursive=True)

for page_path in pages:
    with open(page_path, 'r') as f:
        content = f.read()
    
    # regex to remove `const sectionStyle: React.CSSProperties = { ... };`
    # and `const sectionStyle = { ... };`
    # It might span multiple lines or one line
    new_content = re.sub(r'const sectionStyle(?:.*?)= {.*?};\n?', '', content, flags=re.DOTALL)
    
    if new_content != content:
        print(f"Fixed {page_path}")
        with open(page_path, 'w') as f:
            f.write(new_content)

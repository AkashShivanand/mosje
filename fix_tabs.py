import os
import glob
import re

pages = glob.glob("apps/hub/src/app/design-system/components/**/page.tsx", recursive=True)

for page_path in pages:
    with open(page_path, 'r') as f:
        content = f.read()
    
    if "designContent={" in content:
        # We need to replace it with tabs prop
        print(f"Fixing {page_path}")
        
        # Regex to extract the contents
        design_match = re.search(r'designContent=\{\s*(.*?)\s*\}\s*developContent=', content, re.DOTALL)
        develop_match = re.search(r'developContent=\{\s*(.*?)\s*\}\s*accessibilityContent=', content, re.DOTALL)
        a11y_match = re.search(r'accessibilityContent=\{\s*(.*?)\s*\}\s*/>', content, re.DOTALL)
        
        if not (design_match and develop_match and a11y_match):
            continue
            
        new_tabs = f"""tabs={{[
          {{ id: "design", label: "Design", content: ({design_match.group(1)}) }},
          {{ id: "develop", label: "Develop", content: ({develop_match.group(1)}) }},
          {{ id: "accessibility", label: "Accessibility", content: ({a11y_match.group(1)}) }}
        ]}}
      />"""
      
        content = re.sub(r'designContent=\{.*?\/>', new_tabs, content, flags=re.DOTALL)
        
        with open(page_path, 'w') as f:
            f.write(content)

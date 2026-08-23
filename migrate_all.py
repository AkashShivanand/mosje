import os
import glob
import re

components_dir = "apps/hub/src/app/design-system/components/"
pages = glob.glob(os.path.join(components_dir, "**/page.tsx"), recursive=True)

for page_path in pages:
    with open(page_path, 'r') as f:
        content = f.read()
    
    if "DocsTabs" in content:
        continue # Already migrated
        
    print(f"Migrating {page_path}")
    
    # 1. Add import
    import_stmt = 'import { DocsTabs } from "@/components/design-system/docs-kit";\n'
    content = re.sub(r'(import .*?from "@/components/design-system/docs-kit(?:/index)?";)', r'\1\n' + import_stmt, content)
    if 'DocsTabs' not in content:
        # Fallback if the index import wasn't found or matched
        content = content.replace('import * as React from "react";\n', 'import * as React from "react";\n' + import_stmt)
    
    # Split into sections
    parts = content.split('<section style={{ marginBottom: "var(--sa-section-48)" }}>')
    if len(parts) < 2:
        parts = content.split('<section style={sectionStyle}>')
        if len(parts) < 2:
            print(f"Skipping {page_path} - no sections found")
            continue
            
    header_part = parts[0]
    rest = content[len(header_part):]
    
    # Simple regex to get all sections
    all_sections = re.findall(r'<section.*?>(.*?)</section>', rest, re.DOTALL)
    
    design_html = ""
    dev_html = ""
    a11y_html = ""
    
    for sec in all_sections:
        full_sec = f"<section style={{{{ marginBottom: \"var(--sa-section-48)\" }}}}>{sec}</section>"
        if "id=\"api\"" in sec.lower() or "PropsTable" in sec or "TerminalCode" in sec or "id=\"tokens\"" in sec.lower() or "TokenTable" in sec:
            dev_html += full_sec + "\n"
        elif "id=\"accessibility\"" in sec.lower() or "A11yChecklist" in sec:
            a11y_html += full_sec + "\n"
        else:
            design_html += full_sec + "\n"
            
    # Remove the old sections from the file
    last_section_end = content.rfind('</section>') + 10
    first_section_start = content.find('<section', len(header_part) - 10)
    
    new_tabs = f"""
      <DocsTabs
        tabs={{[
          {{
            id: "design",
            label: "Design",
            content: (
              <div className="ds-prose">
                {design_html}
              </div>
            )
          }},
          {{
            id: "develop",
            label: "Develop",
            content: (
              <div className="ds-prose">
                {dev_html}
              </div>
            )
          }},
          {{
            id: "accessibility",
            label: "Accessibility",
            content: (
              <div className="ds-prose">
                {a11y_html}
              </div>
            )
          }}
        ]}}
      />
"""
    new_content = content[:first_section_start] + new_tabs + content[last_section_end:]
    
    # Write back
    with open(page_path, 'w') as f:
        f.write(new_content)

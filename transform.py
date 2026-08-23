import re

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Find the imports to add DocsTabs
    if 'DocsTabs' not in content:
        content = content.replace('PropsTable,', 'DocsTabs, PropsTable,')

    # Remove the hardcoded numbers from headers like "1. Anatomy"
    content = re.sub(r'<h2(.*?)>\s*\d+\.\s*(.*?)\s*</h2>', r'<h2\1>\2</h2>', content, flags=re.DOTALL)

    # Extract all sections
    sections = []
    pattern = re.compile(r'(<section.*?>(.*?)</section>)', re.DOTALL)
    for match in pattern.finditer(content):
        # We need to know the id of the h2 to classify it
        h2_match = re.search(r'<h2 id="(.*?)"', match.group(2))
        h2_id = h2_match.group(1) if h2_match else "unknown"
        sections.append((h2_id, match.group(1)))

    if not sections:
        return

    # Group them
    groups = {
        'design': [],
        'develop': [],
        'accessibility': [],
        'meta': []
    }

    for s_id, s_content in sections:
        if s_id in ['anatomy', 'variants', 'metrics', 'content-rules', 'responsive']:
            groups['design'].append(s_content)
        elif s_id in ['props', 'behavior', 'code', 'forms', 'reuse']:
            groups['develop'].append(s_content)
        elif s_id in ['accessibility', 'evidence']:
            groups['accessibility'].append(s_content)
        else:
            groups['meta'].append(s_content)

    # Reconstruct the main part
    main_pattern = re.compile(r'(<main[^>]*>)(.*?)(</main>)', re.DOTALL)
    
    # We will build the tabs component
    tabs_jsx = """
      <DocsTabs tabs={[
        { id: "design", label: "Design", content: (<>{DESIGN_CONTENT}</>) },
        { id: "develop", label: "Develop", content: (<>{DEVELOP_CONTENT}</>) },
        { id: "accessibility", label: "Accessibility", content: (<>{A11Y_CONTENT}</>) },
        { id: "meta", label: "Meta", content: (<>{META_CONTENT}</>) }
      ]} />
"""
    tabs_jsx = tabs_jsx.replace("{DESIGN_CONTENT}", "\n".join(groups['design']))
    tabs_jsx = tabs_jsx.replace("{DEVELOP_CONTENT}", "\n".join(groups['develop']))
    tabs_jsx = tabs_jsx.replace("{A11Y_CONTENT}", "\n".join(groups['accessibility']))
    tabs_jsx = tabs_jsx.replace("{META_CONTENT}", "\n".join(groups['meta']))

    def repl(m):
        # preserve everything before the first section
        # find where the first section starts in m.group(2)
        first_section_idx = m.group(2).find('<section')
        if first_section_idx != -1:
            intro = m.group(2)[:first_section_idx]
            return m.group(1) + intro + tabs_jsx + m.group(3)
        return m.group(0)

    new_content = main_pattern.sub(repl, content)

    with open(filepath, 'w') as f:
        f.write(new_content)

process_file('apps/hub/src/app/design-system/components/actions/button/page.tsx')
process_file('apps/hub/src/app/design-system/components/section-templates/site-header/page.tsx')


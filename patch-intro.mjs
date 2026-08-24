import fs from 'fs';
const file = 'apps/storybook/stories/Introduction.mdx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/<h2 className="sb-section-title">The Four Non-Negotiables<\/h2>[\s\S]*?(?=<div className="sb-container">)/, `<h2 className="sb-section-title">Core Design Principles</h2>
  <div className="sb-cards-grid">
    <div className="sb-card">
      <div className="sb-card-icon primary">✦</div>
      <h3 className="sb-card-title">Token Architecture</h3>
      <p className="sb-card-desc">Design tokens only. No raw hex codes or arbitrary pixels in components. Fully governed by Style Dictionary.</p>
    </div>
    <div className="sb-card">
      <div className="sb-card-icon">✦</div>
      <h3 className="sb-card-title">Strict Accessibility</h3>
      <p className="sb-card-desc">WCAG 2.2 AA + GIGW 3.0 compliance. Semantic HTML, alt text, keyboard navigation, visible focus, and verified contrast ratios.</p>
    </div>
    <div className="sb-card">
      <div className="sb-card-icon primary">✦</div>
      <h3 className="sb-card-title">Design Parity</h3>
      <p className="sb-card-desc">Every component here maps perfectly to its equivalent in the SAMAVESH Figma library, right down to the node IDs via Code Connect.</p>
    </div>
    <div className="sb-card">
      <div className="sb-card-icon">✦</div>
      <h3 className="sb-card-title">Responsive Fluidity</h3>
      <p className="sb-card-desc">Built for seamless scaling across devices with fully responsive tokens and modular component architectures.</p>
    </div>
  </div>
</div>

`);

fs.writeFileSync(file, code);

/**
 * SAMAVESH Design System — Figma Template Generator Script
 * 
 * Instructions:
 * 1. Open your SAMAVESH Design System Figma file in Figma Desktop App.
 * 2. Open Plugins -> Development -> Open Console (or create a Quick Plugin).
 * 3. Paste and run this script to instantly generate the `01 · PortalLoginTemplate`
 *    master component frame & 10-section SAMAVESH documentation cards!
 */

(async () => {
  // 1. Load Noto Sans font
  await figma.loadFontAsync({ family: "Noto Sans", style: "Regular" });
  await figma.loadFontAsync({ family: "Noto Sans", style: "Bold" });

  // 2. Create Master Component Board
  const board = figma.createFrame();
  board.name = "01 · PortalLoginTemplate";
  board.resize(1816, 830);
  board.x = 100;
  board.y = 100;
  board.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.98, b: 0.99 } }];

  const header = figma.createText();
  header.fontName = { family: "Noto Sans", style: "Bold" };
  header.characters = "MASTER COMPONENT: PortalLoginTemplate";
  header.fontSize = 24;
  header.fills = [{ type: 'SOLID', color: { r: 0.01, g: 0.45, b: 0.87 } }];
  board.appendChild(header);

  // 3. Create Documentation Canvas (1680px Width)
  const docCanvas = figma.createFrame();
  docCanvas.name = "PortalLoginTemplate / Documentation";
  docCanvas.resize(1680, 5844);
  docCanvas.x = 2000;
  docCanvas.y = 100;
  docCanvas.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];

  const sections = [
    "Hero Block — Templatised Portal Login System",
    "01 · Anatomy (Pins 1..8: Utility Bar, Brand Header, Hero, Role Tabs, Auth Card)",
    "02 · Properties (Figma Variant Props ↔ React Code Props)",
    "03 · Variants (Desktop 1440px vs Mobile 375px)",
    "04 · States (Default, Hover, Focus-visible, Active, Disabled)",
    "05 · Tokens (OKLCH Tokens: --sa-color-primaryScale-800, Noto Sans)",
    "06 · Behaviour (Role sync, Captcha refresh, OTP timer, DigiLocker flow)",
    "07 · Usage (import { PortalLoginTemplate } from '@mosje/design-system')",
    "08 · Accessibility (GIGW 3.0, WCAG 2.1 AA, Skip link #login-form)",
    "09 · Do & Don't (Token binding guidelines & anti-patterns)",
    "10 · Resources (React @mosje/design-system, Code Connect, Storybook)"
  ];

  let currentY = 80;
  sections.forEach((secTitle, index) => {
    const card = figma.createFrame();
    card.name = `Section ${index}`;
    card.resize(1440, 420);
    card.x = 120;
    card.y = currentY;
    card.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    card.cornerRadius = 8;
    card.strokes = [{ type: 'SOLID', color: { r: 0.89, g: 0.91, b: 0.94 } }];

    const txt = figma.createText();
    txt.fontName = { family: "Noto Sans", style: "Bold" };
    txt.characters = secTitle;
    txt.fontSize = 18;
    txt.x = 24;
    txt.y = 24;
    txt.fills = [{ type: 'SOLID', color: { r: 0.08, g: 0.11, b: 0.16 } }];
    card.appendChild(txt);

    docCanvas.appendChild(card);
    currentY += 480;
  });

  figma.viewport.scrollAndZoomIntoView([board, docCanvas]);
  figma.notify("✅ PortalLoginTemplate master board & documentation generated successfully!");
})();

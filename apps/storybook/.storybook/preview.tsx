import { Title, Subtitle, Description, Primary, Controls, Stories } from "@storybook/blocks";
import * as React from "react";
import type { Preview } from "@storybook/react";

// The generated token contract + all component styles.
import "@mosje/design-system/tokens.css";
import "@mosje/design-system/components.css";
// Material Symbols Rounded. An app loads this once in its root layout; without
// it every <Icon> renders its name as literal text, so any story using an icon
// would look broken here rather than in the component.
import "@mosje/design-system/icons.css";

export const globalTypes = {
  colorMode: {
    description: "Brand color mode",
    defaultValue: "blue",
    toolbar: {
      title: "Color mode",
      icon: "circlehollow",
      items: [
        { value: "blue", title: "Blue" },
        { value: "navy", title: "Navy" },
        // A third brand for evaluation (2026-08-11): the DBIM key colour #162F6A. It measures
        // deltaE 1.9 from navy — the same colour to the eye — so the switch is expected to look
        // like almost nothing happens. That is the point: seeing them side by side is what
        // settles whether the estate needs both. Deliberately absent from the Figma library,
        // which keeps two modes.
        { value: "dbim", title: "DBIM Blue" },
      ],
      dynamicTitle: true,
    },
  },
  density: {
    description: "Density",
    defaultValue: "comfortable",
    toolbar: {
      title: "Density",
      icon: "component",
      items: [
        { value: "comfortable", title: "Comfortable" },
        { value: "compact", title: "Compact" },
      ],
      dynamicTitle: true,
    },
  },
};



const preview: Preview = {
  parameters: {
    layout: "fullscreen",
    controls: { expanded: true, matchers: { color: /(background|color)$/i } },
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <div style={{ marginTop: '32px', marginBottom: '32px', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
            <Primary />
          </div>
          <div style={{ marginTop: '32px', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>Properties</h2>
            <Controls />
          </div>
          <Stories title="Variants & Examples" />
        </>
      ),
    },
  },
  decorators: [
    (Story, context) => {
      const { density, colorMode } = context.globals;
      return (
        <div
          data-brand={colorMode}
          data-density={density === "comfortable" ? undefined : density}
          style={{
            padding: 24,
            minHeight: "100vh",
            background: "var(--sa-bg-neutral-base)",
            color: "var(--sa-text-neutral-base)",
            fontFamily: "var(--sa-font-latin)",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

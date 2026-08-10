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
            background: "var(--ds-surface)",
            color: "var(--ds-ink)",
            fontFamily: "var(--ds-font-sans)",
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

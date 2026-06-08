import * as React from "react";
import type { Preview } from "@storybook/react";

// The generated token contract + all component styles.
import "@mosje/design-system/tokens.css";
import "@mosje/design-system/components.css";

export const globalTypes = {
  theme: {
    description: "Theme",
    defaultValue: "light",
    toolbar: {
      title: "Theme",
      icon: "paintbrush",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
        { value: "hc", title: "High contrast" },
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
      const { theme, density } = context.globals;
      return (
        <div
          data-theme={theme === "light" ? undefined : theme}
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

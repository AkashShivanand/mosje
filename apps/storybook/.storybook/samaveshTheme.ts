import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  // Typography
  fontBase: '"Noto Sans", sans-serif',
  fontCode: 'monospace',

  brandTitle: 'SAMAVESH Design System',
  brandUrl: '/',
  // You can set an external image URL for brandImage
  brandImage: 'https://ux4g.gov.in/assets/images/emblem-dark.svg',
  brandTarget: '_self',

  // Colors
  colorPrimary: '#162F6A', // DBIM Blue
  colorSecondary: '#162F6A',

  // UI
  appBg: '#F3F4F6', // sa-bg-neutral-subtle equivalent
  appContentBg: '#FFFFFF',
  appPreviewBg: '#FFFFFF',
  appBorderColor: '#E5E7EB',
  appBorderRadius: 8,

  // Text colors
  textColor: '#1F2937', // sa-text-neutral-base
  textInverseColor: '#FFFFFF',

  // Toolbar default and active colors
  barTextColor: '#4B5563',
  barSelectedColor: '#162F6A',
  barHoverColor: '#162F6A',
  barBg: '#FFFFFF',

  // Form colors
  inputBg: '#FFFFFF',
  inputBorder: '#D1D5DB',
  inputTextColor: '#1F2937',
  inputBorderRadius: 4,
});

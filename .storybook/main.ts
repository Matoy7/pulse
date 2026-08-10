import type { StorybookConfig } from '@storybook/react-vite';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (viteConfig) => {
    // Reuse the same "@" -> src alias the main app uses, so stories can
    // import components the same way the dashboard does.
    viteConfig.resolve = viteConfig.resolve || {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias || {}),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    };
    return viteConfig;
  },
};
export default config;

import type { Preview } from '@storybook/react-vite';

// The dashboard's global stylesheet: Tailwind CSS 4 + the design-token
// foundation (src/styles/tokens.css, imported from within index.css) +
// the project's font-face declarations. Loading it here means every
// story renders with the exact same styles the real app uses.
import '../src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
};

export default preview;

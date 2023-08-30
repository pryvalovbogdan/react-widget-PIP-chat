import type { Preview } from '@storybook/react';
import { withI18next } from './decorators';
import { BrowserRouter as Router } from 'react-router-dom';

export { globalTypes } from './decorators';

const preview: Preview = {
  decorators: [
    withI18next,
    (Story, props) => {
      return (
        <Router>
          <Story {...props.args} />
        </Router>
      );
    },
  ],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;

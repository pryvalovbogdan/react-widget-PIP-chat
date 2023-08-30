import { renderWithProviders } from '@jestUtils/renderWithProviders.tsx';

import { ButtonWithTranslate } from '../index.tsx';

describe('Test ButtonWithTranslate', () => {
  test('snapshot', () => {
    const { baseElement } = renderWithProviders(
      <ButtonWithTranslate i18Value={2} handle={() => {}} i18Key='count' backgroundColor='red' />,
    );

    expect(baseElement).toMatchSnapshot();
  });
});

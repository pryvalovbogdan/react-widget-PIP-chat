import { renderWithProviders } from '@jestUtils/renderWithProviders.tsx';

import { Header } from '../index.tsx';

describe('Test Header', () => {
  test('snapshot', () => {
    const { baseElement } = renderWithProviders(<Header />);

    expect(baseElement).toMatchSnapshot();
  });
});

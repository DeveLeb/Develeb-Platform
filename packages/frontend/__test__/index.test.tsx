import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';
import fetch from 'jest-fetch-mock';

import Home from '@/app/page';

// Sample test suite to show how testing is used
describe('Home', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  it('renders a heading', async () => {
    fetch.mockResponseOnce(JSON.stringify({ data: 'sami' }));

    render(<Home />);
    const heading = await screen.findByRole('develeb', {});

    expect(heading).toBeInTheDocument();
  });
});

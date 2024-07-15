import '@testing-library/jest-dom';

import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import SampleComponent from '@/components/SampleComponent';
import { mockGetResponse, resetHandlers, startServer, stopServer } from '@/utils/mockApi';

beforeAll(() => {
  startServer();
});

afterEach(() => {
  resetHandlers();
});

afterAll(() => {
  stopServer();
});

test('fetches and displays data from mocked API', async () => {
  mockGetResponse('/api/users', [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
  ]);

  render(<SampleComponent />);

  await waitFor(() => {
    expect(screen.getByText('Users:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
});

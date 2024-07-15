import { http } from 'msw';

export const handlers = [
  http.get('/api/users', ({}) => {
    return new Response(
      JSON.stringify([
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }),
];

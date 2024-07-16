import { http, HttpResponse } from 'msw';

import { mswServer } from '../mocks/mswServer';
import { mswWorker } from '../mocks/mswWorker';

export const startServer = () => {
  if (typeof window === 'undefined') {
    mswServer.listen();
  } else {
    mswWorker.start();
  }
};

export const stopServer = () => {
  if (typeof window === 'undefined') {
    mswServer.close();
  } else {
    mswWorker.stop();
  }
};

export const resetHandlers = () => {
  if (typeof window === 'undefined') {
    mswServer.resetHandlers();
  } else {
    mswWorker.resetHandlers();
  }
};

export const mockGetResponse = (url: string, response: any) => {
  const handler = http.get(url, () => HttpResponse.json(response));

  if (typeof window === 'undefined') {
    mswServer.use(handler);
  } else {
    mswWorker.use(handler);
  }
};

export const mockPostResponse = (url: string, response: any) => {
  const handler = http.post(url, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...(body as object), ...(response as object) });
  });

  if (typeof window === 'undefined') {
    mswServer.use(handler);
  } else {
    mswWorker.use(handler);
  }
};

export const mockPutResponse = (url: string, response: any) => {
  const handler = http.put(url, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...(body as object), ...(response as object) });
  });

  if (typeof window === 'undefined') {
    mswServer.use(handler);
  } else {
    mswWorker.use(handler);
  }
};

export const mockDeleteResponse = (url: string, response: any) => {
  const handler = http.delete(url, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ ...(body as object), ...(response as object) });
  });

  if (typeof window === 'undefined') {
    mswServer.use(handler);
  } else {
    mswWorker.use(handler);
  }
};

export const mockErrorResponse = (url: string, status: number, message: string) => {
  const handler = http.get(url, () => HttpResponse.error({ status, statusText: message }));

  if (typeof window === 'undefined') {
    mswServer.use(handler);
  } else {
    mswWorker.use(handler);
  }
};

// Similarly, you can define other mockErrorResponses as needed

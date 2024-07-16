import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { TextDecoder, TextEncoder } from 'util';

import { mswServer } from '@/mocks/mswServer';

// Polyfill TextEncoder and TextDecoder for Node environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// MSW setup
beforeAll(() => mswServer.listen());
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

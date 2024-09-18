import { pino } from 'pino';

const targets = [
  {
    target: 'pino-pretty',
    level: 'info',
    options: {},
  },
];

if (process.env.production && process.env.LOKI_HOST && process.env.LOKI_USERNAME && process.env.LOKI_PASSWORD) {
  targets.push({
    target: 'pino-loki',
    level: 'info',
    options: {
      batching: true,
      interval: 5,
      labels: { application: 'production-server' },

      host: process.env.LOKI_HOST,
      basicAuth: {
        username: process.env.LOKI_USERNAME,
        password: process.env.LOKI_PASSWORD,
      },
    },
  });
} else {
  console.warn(
    'Loki logging is enabled but missing required environment variables. Please set LOKI_HOST, LOKI_USERNAME, and LOKI_PASSWORD. Defaulting to console logging.'
  );
}

export { targets };

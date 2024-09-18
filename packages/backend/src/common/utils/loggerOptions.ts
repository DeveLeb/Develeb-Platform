import { pino } from 'pino';

const loggerOptions = [{ level: 'info' }];

if (process.env.isProduction || process.env.NODE_ENV === 'production') {
  if (process.env.LOKI_HOST && process.env.LOKI_USERNAME && process.env.LOKI_PASSWORD) {
    loggerOptions.push(
      pino.transport({
        target: 'pino-loki',
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
      })
    );
  } else {
    console.error(
      'Loki logging is enabled but missing required environment variables. Please set LOKI_HOST, LOKI_USERNAME, and LOKI_PASSWORD. Defaulting to console logging.'
    );
  }
}

export { loggerOptions };

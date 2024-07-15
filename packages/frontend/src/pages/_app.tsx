import '../styles/globals.css';

import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import RootLayout from '@/app/layout';

if (process.env.NEXT_PUBLIC_API_MOCKING === 'true') {
  import('../mocks').then(({ setupMocks }) => {
    setupMocks();
  });
}

type NextPageWithMeta = NextPage & {
  title?: string;
  description?: string;
};

type AppPropsWithMeta = AppProps & {
  Component: NextPageWithMeta;
};

const App = ({ Component, pageProps }: AppPropsWithMeta) => (
  <>
    <Head>
      <title>{Component.title ?? 'Eri Panselina | Journalist - PR expert - Link builder'}</title>
      <meta
        name="description"
        content={
          Component.description ??
          'Eri is a career journalist who is now using her superpowers to help people communicate their mission and understand the world around them.'
        }
      />
    </Head>
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  </>
);

export default App;

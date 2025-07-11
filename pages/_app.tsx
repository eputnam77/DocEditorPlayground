import type { AppProps } from 'next/app';
import '../styles/globals.css';

/**
 * Root application component that imports global styles.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

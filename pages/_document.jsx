import { Html, Head, Main, NextScript } from 'next/document';

import Footer from '../components/Footer';
import Topbar from '../components/Topbar';

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  );
}

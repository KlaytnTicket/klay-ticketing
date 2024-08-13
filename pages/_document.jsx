import { Html, Head, Main, NextScript } from 'next/document';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';
export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <Topbar />
      <body>
        <Main />
        <NextScript />
      </body>
      <Footer />
    </Html>
  );
}

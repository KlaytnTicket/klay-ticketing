import { Html, Head, Main, NextScript } from 'next/document';
import Topbar from './components/Topbar';

export default function Document() {
  return (
    <Html lang="ko">
      <Head />
      <body>
        <Topbar />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

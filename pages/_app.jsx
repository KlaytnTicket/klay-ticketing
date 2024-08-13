import { SWRConfig } from 'swr';
import '@styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Topbar from 'components/Topbar';

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 5000,
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Topbar />
      <Component {...pageProps} />
    </SWRConfig>
  );
}

import Topbar from '@components/Topbar';
import { useRouter } from 'next/router';
import { SWRConfig } from 'swr';
import '@styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Footer from '../components/Footer';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const hideTopbarPath = ['/klipConfirm'];
  const hideTopbar = hideTopbarPath.includes(router.pathname);

  return (
    <SWRConfig
      value={{
        refreshInterval: 5000,
        fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()),
      }}
    >
      {!hideTopbar && <Topbar />}
      <Component {...pageProps} />
      {!hideTopbar && <Footer />}
    </SWRConfig>
  );
}

import { Inter } from 'next/font/google';
import Link from 'next/link';
import ButtonA from './components/ButtonA';

const inter = Inter({ subsets: ['latin'] });

export default function IndexPage() {
  return (
    <main className={inter.className}>
      <h1 className="text-3xl">Klay Ticketing Index Page</h1>
      <ButtonA label="asdf" URL="caver-test"></ButtonA>
      <Link href="/caver-test" className="hover:underline">
        test page
      </Link>
    </main>
  );
}

import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export default function IndexPage() {
  return (
    <main className={inter.className}>
      <h1 className="text-3xl">Klay Ticketing Index Page</h1>
      <Link href="/caver-test" className="hover:underline">
        test page
      </Link>
    </main>
  );
}

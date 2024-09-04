import ConcertSlider from 'components/ConcertSlider';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Klayten_Ticketing</title>
      </Head>

      {/* 콘서트목록 들어올 장소  */}
      <div className='min-h-screen'>
        <main className="mx-auto mt-32 w-4/5 justify-center">
          <div>
            <h1 className="text-center text-2xl font-bold">콘서트 목록</h1>
            {/* 목록 받기 */}
            <ConcertSlider />
          </div>
        </main>
      </div>
    </div>
  );
}

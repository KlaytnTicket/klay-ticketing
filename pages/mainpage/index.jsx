import ConcertSlider from 'components/ConcertSlider';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Klayten_Ticketing</title>
      </Head>

      {/* 콘서트목록 들어올 장소  */}
      <div className="bg-slate-200">
        <main className="mx-auto mt-20 w-4/5 justify-center">
          <div>
            <h1 className="text-center font-bold">콘서트 목록</h1>
            {/* 목록 받기 */}
            <div className="mt-4 border-y-2 border-slate-500 py-8">
              <ConcertSlider />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

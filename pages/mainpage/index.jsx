import ConcertSlider from 'components/ConcertSlider';
import Head from 'next/head';
import Image from 'next/image';
import reviewIMG from '../../image/reviewIMG.png';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Klayten_Ticketing</title>
      </Head>

      {/* 콘서트목록 들어올 장소  */}
      <div className="min-h-screen">
        <main className="mx-auto mt-7 w-4/5 justify-center">
          <div>
            <h1 className="text-center text-3xl font-bold">티케팅 목록</h1>
            {/* 목록 받기 */}
            <ConcertSlider />
            <div className="flex justify-center">
              <Image src={reviewIMG} className="" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

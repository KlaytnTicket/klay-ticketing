import Head from "next/head";
import ConcertSlider from "components/ConcertSlider";
import NavLogin from "components/NavLogin";


export default function Home(){
  return(
    <div>
      <Head>
        <title>Klayten_Ticketing</title>
      </Head>

      {/* 로그인&회원가입 */}
      <NavLogin />

      {/* 콘서트목록 들어올 장소  */}
      <div className="bg-slate-200">
        <main className="mt-20 justify-center w-4/5 mx-auto">
          <div>
            <h1 className="font-bold text-center">콘서트 목록</h1>
            {/* 목록 받기 */}
            <div className="border-slate-500 border-y-2 
              mt-4 py-8">
              <ConcertSlider />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
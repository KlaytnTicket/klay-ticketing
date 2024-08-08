import Test from '../images/이리.png';
import Footer from '../images/footer.png';
import { useRouter } from 'next/router';
import Image from 'node_modules/next/image';
import { useState } from 'react';

export default function CaverTestPage() {
  const router = useRouter();

  const [select, setSelected] = useState(false);
  const [choose, setChoose] = useState(0);

  const [date, setDate] = useState(20);
  const { id } = router.query;
  console.log(id);

  return (
    <>
      {/* --------------------- 예약하기 div , fixed  ---------------*/}
      <div>
        <div className="fixed right-32 top-40 flex h-[450px] w-[280px] flex-col rounded-2xl bg-[#4579FF] px-7 py-5 font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)]">
          <div>관람일</div>
          <div id="dateSection" className="flex justify-center space-x-3 py-5">
            <div className="cursor-pointer select-none" onClick={() => setDate(date - 1)}>
              &lt;
            </div>
            <div className="select-none"> 2024 - 12 - {date}</div>
            <div className="cursor-pointer select-none" onClick={() => setDate(date + 1)}>
              &gt;
            </div>
          </div>
          <div id="section-bar" className="h-[1px] w-full bg-white" />
          <div className="pt-5">회차</div>
          {/* --------------------- 회차 뜨도록 하는거 복붙인데 갯수에 따라 자동 으로 늘도록 설정할거 ---------------*/}
          <div id="1" className="flex items-center justify-between space-x-3 pt-5">
            <div
              onClick={() => setChoose(1)}
              className={`relative flex h-10 w-28 cursor-pointer select-none items-center justify-center rounded-3xl ${choose === 1 ? 'bg-[#EF88D8] text-[#FFFFFF]' : 'bg-[#C8CBE8] text-black'} shadow-[5px_5px_5px_0px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-[#EF88D8] hover:text-[#FFFFFF]`}
            >
              <div className="absolute left-[10px] top-0 text-[10px]">1회</div>
              <div>18:00</div>
            </div>
            <div className="text-[10px]">잔여 좌석 : NNN석</div>
          </div>
          <div id="2" className="flex items-center justify-between space-x-3 pt-5">
            <div
              onClick={() => setChoose(2)}
              className={`relative flex h-10 w-28 cursor-pointer select-none items-center justify-center rounded-3xl ${choose === 2 ? 'bg-[#EF88D8] text-[#FFFFFF]' : 'bg-[#C8CBE8] text-black'} shadow-[5px_5px_5px_0px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-[#EF88D8] hover:text-[#FFFFFF]`}
            >
              <div className="absolute left-[10px] top-0 text-[10px]">2회</div>
              <div>20:00</div>
            </div>
            <div className="text-[10px]">잔여 좌석 : NNN석</div>
          </div>
          {/* ------------------------------------------------------------ */}
        </div>
        <div
          onClick={() => {
            choose !== 0 ? window.alert('예약화면으로 이동') : null;
          }}
          className={`fixed right-32 top-[630px] flex h-[40px] w-[280px] items-center justify-center rounded-xl ${choose === 0 ? 'bg-[#383838]' : 'bg-[#4579FF]'} font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)] transition-colors duration-300`}
        >
          <div>예매하기</div>
        </div>
      </div>
      {/* ------------------------------------------------------------ */}
      <div className="px-44 py-16">
        {/* --------------------- 티케팅 관련 내용 소개 섹션 ---------------*/}
        <div className="pb-10">
          <div className="px-2 text-3xl font-extrabold">이터널 리턴 코발트 챌린지 컵 4강 티켓</div>
        </div>
        <div className="flex">
          <Image src={Test} className="w-80" />
          <div className="flex flex-col space-y-3 px-10 text-lg font-extrabold">
            <div>장소 : </div>
            <div>경기기간 : </div>
            <div>경기시간 : </div>
            <div>관람 연령 : </div>
            <div>가격 </div>
          </div>
          <div className="flex flex-col space-y-[17px] font-extrabold">
            <div className="whitespace-nowrap">장소 데이터</div>
            <div className="whitespace-nowrap">경기 시간 데이터</div>
            <div className="whitespace-nowrap">경기 기간 데이터</div>
            <div className="whitespace-nowrap">관람 연령 데이터</div>
            <div className="flex flex-col space-y-3 pt-3">
              <div>A 좌석 : 5000원</div>
              <div>A 좌석 : 5000원</div>
              <div>A 좌석 : 5000원</div>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------ */}
        <div className="flex pt-36">
          <div className="flex h-[2000px] w-[1000px] items-center justify-center rounded-xl bg-[#E1EBED] text-[100px] font-extrabold">1000px 사진 넣는 곳</div>
        </div>
        <div className="flex w-full pt-36">
          <Image src={Footer} />
        </div>
      </div>
    </>
  );
}

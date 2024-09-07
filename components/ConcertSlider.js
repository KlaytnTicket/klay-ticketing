import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ConcertSlider() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이벤트 받아오기
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/api/events/events', {
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        setEvents(res.data);
      } catch (error) {
        // console.log('이벤트 목록 패치 에러: ', error);
      }
    }
    fetchEvents();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
  };

  if (events.length === 0) {
    return <div>목록이 없습니다.</div>;
  }

  return (
    <div className="relative mt-8 px-4 md:px-12 lg:px-24">
      {/* 좌측 버튼 */}
      <button
        className="absolute left-0 top-[calc(45%)] -translate-y-1/2 transform rounded-xl bg-[#4579FF] px-4 py-3 text-xl font-extrabold text-white"
        onClick={prevSlide}
        style={{ marginLeft: '-2rem' }}
      >
        &lt;
      </button>

      {/* 우측 버튼 */}
      <button
        className="absolute right-0 top-[calc(45%)] -translate-y-1/2 transform rounded-xl bg-[#4579FF] px-4 py-3 text-xl font-extrabold text-white"
        onClick={nextSlide}
        style={{ marginRight: '-2rem' }}
      >
        &gt;
      </button>
      <div>
        <div className="mb-8 h-[1px] w-auto bg-slate-300"></div>

        {/* 슬라이더 내용 */}
        <div className="relative overflow-hidden">
          <div className="ml-2 flex gap-5 transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * 35}%)` }}>
            {events.map((event) => (
              <div key={event.ID} className="flex w-1/3 shrink-0 flex-col items-center rounded-lg bg-white p-4 px-4">
                <Link href={`/ticketing_view/${event.ID}`}>
                  <img src={event.TICKET_IMAGE} className="border- h-80 w-60 rounded-lg border-[#4579FF] object-cover shadow-md" />
                  <h2 className="ml-2 mt-2 text-start text-2xl font-extrabold">{event.NAME}</h2>
                </Link>
                <div className="text-start">
                  <p className="mt-2 text-sm text-gray-600">티켓팅 시작: {new Date(event.TICKETING_START).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">종료일: {new Date(event.TICKETING_END).toLocaleString()}</p>
                  <p className="text-sm text-gray-600">상태: {event.TICKETING_IS_OPEN ? '진행 중' : '종료'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지 표시 */}
        <div className="mt-8 flex justify-center">
          {Array(events.length)
            .fill(0)
            .map((_, i) => (
              <button key={i} className={`mx-1 h-2 w-2 rounded-full ${currentIndex === i ? 'bg-gray-800' : 'bg-gray-400'}`} onClick={() => setCurrentIndex(i)}></button>
            ))}
        </div>
        <div className="mt-8 h-[1px] w-full bg-slate-300"></div>
      </div>
    </div>
  );
}

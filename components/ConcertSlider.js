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
    return (<div>목록이 없습니다.</div>);
  }

  return (
    <div className="mt-8 min-h-screen relative px-4 md:px-12 lg:px-24">
      {/* 좌측 버튼 */}
      <button
        className='absolute top-[calc(50%-250px)] left-0 transform -translate-y-1/2 px-4 py-3 bg-slate-100 rounded-full shadow-2xl'
        onClick={prevSlide}
        style={{ marginLeft: '-2rem' }}
      >
          &lt;
      </button>

      <div>
        <div className="mb-8 bg-slate-300 w-auto h-[1px]"></div>

        {/* 슬라이더 내용 */}
        <div className='relative overflow-hidden'>
          <div
            className='flex transition-transform duration-500 ml-2 gap-12'
            style={{ transform: `translateX(-${currentIndex * 50}%)` }}
          >
            {events.map((event) => (
              <div
                key={event.ID}
                className='w-1/2 px-4 shrink-0 flex flex-col items-center bg-white rounded-lg shadow-xl p-4'
              >
                <Link href={`/ticketing_view/${event.ID}`}>
                  <img
                    src={event.TICKET_IMAGE}
                    className='w-60 h-80 object-cover rounded-lg shadow-md'
                  />
                  <h2 className="ml-2 text-lg font-semibold text-center">{event.NAME}</h2>
                </Link>
                <p className='text-sm mt-2 text-gray-600'>
                  티켓팅 시작: {new Date(event.TICKETING_START).toLocaleString()}
                </p>
                <p className='text-sm text-gray-600'>
                  종료일: {new Date(event.TICKETING_END).toLocaleString()}
                </p>
                <p className='text-sm text-gray-600'>
                  상태: {event.TICKETING_IS_OPEN ? '진행 중' : '종료'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지 표시 */}
        <div className='flex justify-center mt-8'>
          {Array(events.length).fill(0).map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 mx-1 rounded-full ${
                currentIndex === i ? 'bg-gray-800' : 'bg-gray-400'
              }`}
              onClick={() => setCurrentIndex(i)}
            ></button>
          ))}
        </div>
        <div className="mt-8 bg-slate-300 w-full h-[1px]"></div>
      </div>

      {/* 우측 버튼 */}
      <button
        className='absolute top-[calc(50%-250px)] right-0 transform -translate-y-1/2 px-4 py-3 bg-slate-100 rounded-full shadow-2xl'
        onClick={nextSlide}
        style={{ marginRight: '-2rem' }}
      >
          &gt;
      </button>
    </div>
  );
}

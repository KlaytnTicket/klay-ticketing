import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

export default function ConcertSlider() {
  const [events, setEvents] = useState([]);

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

  const settings = {
    dots: true, // 페이지네이션 점
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 이동 속도
    slidesToShow: 2, // 보여줄 슬라이드 수
    slidesToScroll: 1, // 스크롤 시 이동할 슬라이드 수
    arrows: true, // 좌우 버튼
  };

  if (events === null) {
    return (<div>목록이 없습니다.</div>);
  }

  return (
    <div>
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event.ID} className="mx-24 my-10">
            <Link href={`/ticketing_view/${event.ID}`}>
              <h2 className="ml-16 text-lg font-semibold">{event.NAME}</h2>
            </Link>
            <p>티켓팅 시작: {new Date(event.TICKETING_START).toLocaleString()}</p>
            <p>종료일: {new Date(event.TICKETING_END).toLocaleString()}</p>
            <p>상태: {event.TICKETING_IS_OPEN ? '종료' : '진행 중'}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

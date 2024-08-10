import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';

export default function ConcertSlider() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await axios.get('/api/events/events');
        setEvents(res.data);
      } catch (error) {
        console.log('이벤트 목록 패치 에러: ', error);
      }
    }
    fetchEvents();
  }, []);

  var settings = {
    dots: true, // 페이지네이션 점
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 이동 속도
    slidesToShow: 2, // 보여줄 슬라이드 수
    slidesToScroll: 1, // 스크롤 시 이동할 슬라이드 수
    arrows: true, // 좌우 버튼
  };

  return (
    <div>
      <Slider {...settings}>
        {events.map((event) => (
          <div key={event.EVENT_PK} className="mx-24 my-10">
            <Link href={`/ticketing_view/${event.EVENT_PK}`}>
              <h2 className="ml-16 text-lg font-semibold">{event.EVENT_NAME}</h2>
            </Link>
            <p>시작일: {new Date(event.EVENT_START).toLocaleString()}</p>
            <p>종료일: {new Date(event.EVENT_END).toLocaleString()}</p>
            <p>상태: {event.EVENT_STATUS ? '종료' : '진행 중'}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

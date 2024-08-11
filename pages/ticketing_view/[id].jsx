import { useRouter } from 'next/router';
import axios from 'node_modules/axios/index';
import { useEffect, useState } from 'react';
import FixedTicketingSection from './ticketing_fixed_section';
import DeatilTicketingSection from './ticketing_detail_section';

export default function CaverTestPage() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (id) {
      async function fetchEvent() {
        try {
          const res = await axios.get(`/api/events/${id}`);
          setEvent(res.data);
        } catch (error) {
          console.log('이벤트 패치 에러: ', error);
        }
      }
      fetchEvent();
    }
  }, [id]);

  if (!event) {
    return <div className="mt-20 flex min-h-screen justify-center">Loading... 로딩이 길어진다면 뒤로가기 혹은 새로고침을 해주세요</div>;
  }

  return (
    <>
      <FixedTicketingSection event={event} id={id} />
      <DeatilTicketingSection event={event} />
    </>
  );
}

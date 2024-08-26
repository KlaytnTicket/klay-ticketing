import { useRouter } from 'next/router';
import axios from 'node_modules/axios/index';
import { useEffect, useState } from 'react';

import DeatilTicketingSection from '../../components/ticketing_view/ticketing_detail_section';
import FixedTicketingSection from '../../components/ticketing_view/ticketing_fixed_section';

export default function CaverTestPage() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState(null);

  async function fetchEvent() {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      window.alert('에러가 발생했습니다. 계속 해서 이런 오류 창이 뜨면 문의해주세요.');
      window.location.href = '/mainpage';
    }
  }
  useEffect(() => {
    if (id) {
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

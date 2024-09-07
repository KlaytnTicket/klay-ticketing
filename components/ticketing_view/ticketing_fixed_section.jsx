import { useRouter } from 'node_modules/next/router';
import { useEffect, useState } from 'react';

export default function FixedTicketingSection(props) {
  const { event, id } = props;
  const router = useRouter();

  const [remainingTime, setRemainingTime] = useState();

  // 날짜 , 시간 YYYY-MM-DD , TT-MM 으로 변환하는 로직
  function formatDate(eventDate) {
    const date = new Date(eventDate);
    return date.toISOString().split('T')[0];
  }

  function formatTime(eventDate) {
    const date = new Date(eventDate);
    return date.toISOString().split('T')[1].slice(0, 5);
  }
  // -----------------------------------------------
  // 티케팅 남은 시간 보여주는 로직
  function getRemainingTime(ticketEnd) {
    const now = new Date();
    const endTime = new Date(ticketEnd);
    const timeDifference = endTime - now;

    if (timeDifference <= 0 || !event.event.TICKETING_IS_OPEN) {
      return '예매가 종료되었습니다.';
    }
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
    // -----------------------------------------------
    // 조건에 따른 출력 형식
    if (hours > 0) {
      return `${hours}시 ${minutes}분 ${seconds}초 `;
    }
    if (minutes > 0) {
      return `${minutes}분 ${seconds}초`;
    }
    return `${seconds}초`;
  }
  // -----------------------------------------------
  // 티켓 UserId가 null인 것 인식하여 남는 자리 확인하는 로직
  function countNullUserIdTickets(tickets) {
    return tickets.filter((ticket) => ticket.USER_ID === null).length;
  }

  const nullUserTicketsCount = countNullUserIdTickets(event.tickets);
  // -----------------------------------------------
  // 로그인 여부 확인
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  // -----------------------------------------------
  // 예매하기 눌러서 티켓 구매 페이지 넘어가기 전 로그인 확인 기능
  function checkUser() {
    if (user === null) {
      alert('로그인을 해주세요.');
      return;
    }

    if (user !== null && event.event.TICKETING_IS_OPEN) {
      router.push({
        pathname: '/reservation',
        query: { event_pk: id },
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime(event.event.TICKETING_END));
    }, 1000);
    return () => clearInterval(interval);
  }, [event.event.TICKETING_END]);

  // -----------------------------------------------
  return (
    <>
      <div className="fixed right-32 top-40 flex h-[450px] w-[280px] flex-col rounded-2xl bg-[#4579FF] px-7 py-5 font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)]">
        <div>예매 일</div>
        <div id="dateSection" className="flex justify-between space-x-3 pb-1 pt-5">
          <div className="select-none">{formatDate(event.event.TICKETING_START)}</div> <div>~</div>
          <div className="select-none">{formatDate(event.event.TICKETING_END)}</div>
        </div>
        <div id="dateSection" className="flex justify-around space-x-3 pb-4">
          <div className="select-none">{formatTime(event.event.TICKETING_START)}</div>
          <div className="select-none">{formatTime(event.event.TICKETING_END)}</div>
        </div>

        <div id="section-bar" className="h-[1px] w-full bg-white" />
        <div className="pt-5">정보</div>

        <div className="pt-1">
          <div className="flex items-center justify-between space-x-3 pt-5">
            <div className="relative flex h-14 w-full select-none items-center justify-center rounded-3xl bg-[#383838] text-[#FFFFFF] shadow-[5px_5px_5px_0px_rgba(0,0,0,0.3)]">
              <div className="absolute left-[30px] top-1 text-[10px]">잔여좌석</div>
              <div>{nullUserTicketsCount}석</div>
            </div>
          </div>
          <div className="flex items-center justify-between space-x-3 pt-5">
            <div className="relative flex h-14 w-full select-none items-center justify-center rounded-3xl bg-[#FFBE57] text-[#2C2C2C] shadow-[5px_5px_5px_0px_rgba(0,0,0,0.3)]">
              <div className="absolute left-[30px] top-1 text-[10px] font-extrabold">남은 시간</div>
              <div>{remainingTime}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={checkUser}
        className={`fixed right-32 top-[630px] flex h-[40px] w-[280px] cursor-pointer items-center justify-center rounded-xl ${event.event.TICKETING_IS_OPEN ? 'bg-[#4579FF]' : 'bg-[#383838]'} font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)] transition-colors duration-300`}
      >
        <div>{event.event.TICKETING_IS_OPEN ? '예매하기' : '종료된 이벤트입니다.'}</div>
      </div>
    </>
  );
}

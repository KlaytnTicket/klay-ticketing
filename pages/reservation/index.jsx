import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tickets, setTickets] = useState([]); // 층 수에 따른 전체 티켓정보
  const [ticketInfo, setTicketInfo] = useState({}); // 티켓 이벤트 정보 가져오기
  const [selectedSeats, setSelectedSeats] = useState(null);
  const [userPoint, setUserPoint] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [floor, setFloor] = useState(1);
  const [error, setError] = useState(null); // 에러 상태 추가
  const router = useRouter(); // next.js 라우터

  const { event_pk, ticket_limit } = router.query; // 이벤트 pk랑 티켓팅 최댓값 받아오는 거 ==> 티켓정보 불러오기
  const [user, setUser] = useState(null);

  // User 아이디 불러오기
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const res = await axios.get('/api/tickets/ticketInfo', {
          params: { floor, event_pk },
          headers: {
            'Cache-Control': 'no-cache', // 캐시 무시
          },
        });

        const { ticketInfo: fetchedTicketInfo } = res.data; // API 응답으로부터 티켓 이벤트 정보 가져오기
        let { tickets: fetchedTickets } = res.data; // 티켓 정보 가져오기

        const formattedStartDate = new Date(fetchedTicketInfo.EVENT_START).toLocaleString();
        const formattedEndDate = new Date(fetchedTicketInfo.EVENT_END).toLocaleString();
        const ticketinfo = { ...fetchedTicketInfo, EVENT_START: formattedStartDate, EVENT_END: formattedEndDate };

        // 좌석 데이터를 행과 열 순서로 출력하기
        fetchedTickets = fetchedTickets.sort((a, b) => {
          if (a.SEAT_ROW === b.SEAT_ROW) {
            return a.SEAT_COLUMN - b.SEAT_COLUMN;
          }
          return a.SEAT_ROW - b.SEAT_ROW;
        });

        setTicketInfo(ticketinfo);
        setTickets(fetchedTickets);
      } catch (errors) {
        setError('데이터를 불러오지 못했습니다');
        setTickets([]);
        setTicketInfo({});
      }
    };

    const fetchUserPoint = async () => {
      try {
        const { userID } = user;
        const res = await axios.get('/api/tickets/user', {
          params: { userID },
          headers: {
            'Cache-Control': 'no-cache', // 캐시 무시
          },
        });

        setUserPoint(res.data.USER_POINT);
      } catch (errors) {
        setError('데이터를 불러오지 못했습니다'); // 에러 메시지 설정
      }
    };

    fetchTicketData();
    fetchUserPoint();
  }, [floor, event_pk, user]);

  useEffect(() => {
    if (selectedSeats) {
      setTotalPrice(selectedSeats.PRICE);
    } else {
      setTotalPrice(0);
    }
  }, [selectedSeats]);

  const handleSeatSelect = (ticket) => {
    if (ticket.IS_USED) {
      alert('이미 예매된 좌석입니다.');
      return;
    }

    // 이미 선택된 좌석이 있을 경우 새로운 좌석으로 교체
    if (selectedSeats && selectedSeats.ID === ticket.ID) {
      setSelectedSeats(null);
      setTotalPrice(0);
    } else {
      // 새 좌석을 선택할 때 기존 선택 좌석을 교체
      const newTotalPrice = ticket.PRICE;

      if (newTotalPrice > userPoint) {
        alert('포인트가 부족합니다.');
      } else {
        setSelectedSeats(ticket);
        setTotalPrice(newTotalPrice);
      }
    }
  };

  // 층 고르기
  const handleFloorChange = (direction) => {
    if (direction === 'prev' && floor > 1) {
      setFloor(floor - 1);
    } else if (direction === 'next' && floor < 2) {
      setFloor(floor + 1);
    }
  };

  // 좌석 별 색깔
  const getSeatColor = (grade) => {
    switch (grade) {
      case 'S':
        return 'bg-red-500';
      case 'A':
        return 'bg-purple-500';
      case 'B':
        return 'bg-yellow-500';
      case 'C':
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };

  const remainingSeats = tickets.filter((ticket) => !ticket.IS_USED).length;

  const remainingSSeats = tickets.filter((ticket) => !ticket.IS_USED && ticket.SEAT_GRADE === 'S').length;
  const remainingASeats = tickets.filter((ticket) => !ticket.IS_USED && ticket.SEAT_GRADE === 'A').length;
  const remainingBSeats = tickets.filter((ticket) => !ticket.IS_USED && ticket.SEAT_GRADE === 'B').length;
  const remainingCSeats = tickets.filter((ticket) => !ticket.IS_USED && ticket.SEAT_GRADE === 'C').length;

  const handleCompleteSelection = async () => {
    if (totalPrice === 0) {
      alert('좌석 선택해라.');
    } else {
      try {
        const { userID } = user;
        const ticketID = selectedSeats.ID;

        const requestData = { userID, totalPrice, ticketID };

        const res = await axios.post('/api/tickets/ticketbuy', requestData);

        if (res.status !== 200) {
          throw new Error('결제 처리 오류');
        }

        alert('결제 성공');
        setSelectedSeats(null); // 선택 좌석 초기화
        router.reload();
      } catch (errors) {
        alert('결제 처리 오류');
      }
    }
  };

  const handleGoBack = () => {
    router.push('/previous');
  };

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 부분 */}
      <div className="mb-4 bg-blue-500 p-4 text-white">
        <h1 className="text-left text-2xl font-bold">좌석 선택</h1>
      </div>

      {/* 티켓 정보 섹션 */}
      <div className="mb-4 flex justify-between bg-gray-200 p-4">
        <div className="text-3xl font-extrabold">{ticketInfo.NAME}</div>
        <div className="text-right text-sm">
          <div>{ticketInfo.EVENT_START}</div>
          <div>{ticketInfo.EVENT_END}</div>
          <div>{ticketInfo.SITE}</div>
        </div>
      </div>

      {/* 좌우 화살표 버튼 */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => handleFloorChange('prev')} disabled={floor === 1}>
          <div className="cursor-pointer select-none">&lt;</div>
        </button>
        <span className="text-xl font-bold">현재 층: {floor}층</span>
        <button onClick={() => handleFloorChange('next')} disabled={floor === 2}>
          <div className="cursor-pointer select-none">&gt;</div>
        </button>
      </div>

      {/* 좌석 목록 */}
      <div className="mb-4 grid grid-cols-10 gap-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.ID}
            className={`col-span-1 cursor-pointer border p-2 ${selectedSeats && selectedSeats.ID === ticket.ID ? 'border-4 border-black' : ''} ${ticket.IS_USED ? 'bg-gray-400' : getSeatColor(ticket.SEAT_GRADE)}`}
            onClick={() => handleSeatSelect(ticket)}
          >
            {ticket.SEAT_ROW}-{ticket.SEAT_COLUMN}
          </div>
        ))}
      </div>

      {/* 남은 좌석 수 */}
      <div className="mb-4 text-center">
        남은 좌석 : {remainingSeats}석<br />
        (S등급 : {remainingSSeats}석, A등급 : {remainingASeats}석, B등급 : {remainingBSeats}석, C등급 : {remainingCSeats}석)
      </div>

      {/* 선택된 좌석 목록 */}
      <div className="mt-20 flex items-start justify-between">
        <div className="w-1/2">
          <h2 className="mb-2 text-xl font-bold">고른 좌석</h2>
          <div className="border-b-2 border-t-2 border-black">
            {selectedSeats && (
              <div className="mb-4 border-b p-2">
                <div className="flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석층수</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{selectedSeats.SEAT_FLOOR}층</div>
                  </div>
                </div>
                {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 border-t border-gray-300" />
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석등급</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{selectedSeats.SEAT_GRADE}</div>
                  </div>
                </div>
                {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 border-t border-gray-300" />
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석위치</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>
                      {selectedSeats.SEAT_ROW}-{selectedSeats.SEAT_COLUMN}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 결제 버튼 및 돌아가기 버튼 */}
        <div className="flex w-1/2 flex-col items-center justify-center">
          <button onClick={handleCompleteSelection} className="mt-10 w-96 rounded bg-orange-500 p-4 text-xl font-bold text-white">
            <span className="animate-flash">좌석 선택 완료 및 결제</span>
          </button>
          <button onClick={handleGoBack} className="mt-4 w-96 rounded bg-gray-200 p-2 text-sm text-black">
            이전으로 돌아가기
          </button>
        </div>
      </div>

      <div className="mt-4">
        <p className="font-bold">나의 포인트: {userPoint}원</p>
        <p className="font-bold">필요 포인트: {totalPrice}원</p>
      </div>
    </div>
  );
}

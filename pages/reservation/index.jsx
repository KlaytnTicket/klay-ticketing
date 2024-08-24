import axios from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function Home() {
  const [tickets, setTickets] = useState([]); // 층 수에 따른 전체 티켓정보
  const [ticketInfo, setTicketInfo] = useState({}); // 티켓 이벤트 정보 가져오기
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userPoint, setUserPoint] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [floor, setFloor] = useState(1);
  const [error, setError] = useState(null); // 에러 상태 추가
  const router = useRouter(); // next.js 라우터

  const { ticket_time, event_pk, ticket_limit } = router.query; // 이벤트 pk랑 시간대, 티켓팅 최댓값 받아오는 거 ==> 티켓정보 불러오기
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
          params: { floor, event_pk, ticket_time },
          headers: {
            'Cache-Control': 'no-cache', // 캐시 무시
          },
        });

        // Array destructuring 사용
        const { TICKET_DATE, ...restTicketInfo } = res.data.ticketInfo;
        const date = new Date(TICKET_DATE);
        const formattedDate = date.toISOString().split('T')[0];
        const ticketinfo = { TICKET_DATE: formattedDate, ...restTicketInfo };

        setTicketInfo(ticketinfo);
        setTickets(res.data.tickets);
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
  }, [floor, ticket_time, event_pk]);

  useEffect(() => {
    const total = selectedSeats.reduce((sum, ticket) => sum + ticket.PRICE, 0);
    setTotalPrice(total);
  }, [selectedSeats]);

  const handleSeatSelect = (ticket) => {
    if (ticket.IS_USED) {
      alert('이미 예매된 좌석입니다.');
      return;
    }

    let newSelectedSeats = [...selectedSeats];

    if (selectedSeats.includes(ticket)) {
      // 이미 고른 자리를 클릭하면 선택 풀림
      newSelectedSeats = selectedSeats.filter((seat) => seat !== ticket);
    } else {
      const row = ticket.SEAT_ROW;

      if (selectedSeats.length === 0) {
        newSelectedSeats = [ticket];
      } else if (selectedSeats.length === 1) {
        const [firstSeat] = selectedSeats;
        const minColumn = Math.min(firstSeat.SEAT_COLUMN, ticket.SEAT_COLUMN);
        const maxColumn = Math.max(firstSeat.SEAT_COLUMN, ticket.SEAT_COLUMN);

        // 첫 번째 좌석과 새로 선택된 좌석 사이의 모든 좌석을 가져옴
        const middleSeats = tickets.filter((seat) => seat.SEAT_ROW === row && seat.SEAT_COLUMN > minColumn && seat.SEAT_COLUMN < maxColumn && !seat.IS_USED);

        // 중간 좌석들을 선택한 좌석 리스트에 추가
        newSelectedSeats = [firstSeat, ...middleSeats, ticket];
      } else if (selectedSeats.length === 2) {
        const [firstSeat, secondSeat] = selectedSeats;
        if (Math.abs(firstSeat.SEAT_COLUMN - ticket.SEAT_COLUMN) === 1 || Math.abs(secondSeat.SEAT_COLUMN - ticket.SEAT_COLUMN) === 1) {
          // 고른 자리가 기존 자리랑 붙어 있으면
          newSelectedSeats = [...selectedSeats, ticket];
        } else {
          newSelectedSeats = [ticket];
        }
      } else {
        newSelectedSeats = [ticket];
      }
    }

    // 선택된 좌석 수가 ticket_limit을 초과하면, 마지막에 선택한 좌석만 남기고 초기화
    if (newSelectedSeats.length > ticket_limit) {
      newSelectedSeats = [ticket];
    }

    // 새로 고른 좌석들 총 포인트 계산
    const newTotalPrice = newSelectedSeats.reduce((sum, seat) => sum + seat.PRICE, 0);

    if (newTotalPrice > userPoint) {
      alert('포인트가 부족합니다.');
    } else {
      setSelectedSeats(newSelectedSeats);
    }
  };

  const handleFloorChange = (direction) => {
    if (direction === 'prev' && floor > 1) {
      setFloor(floor - 1);
    } else if (direction === 'next' && floor < 2) {
      setFloor(floor + 1);
    }
  };

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

  const remainingSeats = tickets.filter((ticket) => ticket.IS_USED === false).length;

  const remainingSSeats = tickets.filter((ticket) => ticket.IS_USED !== 0 && ticket.SEAT_GRADE === 'S').length;
  const remainingASeats = tickets.filter((ticket) => ticket.IS_USED !== 0 && ticket.SEAT_GRADE === 'A').length;
  const remainingBSeats = tickets.filter((ticket) => ticket.IS_USED !== 0 && ticket.SEAT_GRADE === 'B').length;
  const remainingCSeats = tickets.filter((ticket) => ticket.IS_USED !== 0 && ticket.SEAT_GRADE === 'C').length;

  const handleCompleteSelection = async () => {
    if (totalPrice === 0) {
      alert('좌석 선택해라.');
    } else {
      try {
        const { userID } = user;
        const ticketIDs = selectedSeats.map((seat) => seat.ID);

        const requestData = { userID, totalPrice, ticketIDs };

        const res = await axios.post('/api/tickets/ticketbuy', requestData);

        if (res.status !== 200) {
          throw new Error('결제 처리 오류');
        }

        alert('결제 성공');
        setSelectedSeats([]); // 선택 좌석 초기화
        router.reload();
        // router.push('/payment');
      } catch (errors) {
        // console.error(error);
        alert('결제 처리 오류');
      }
    }
  };
  // console.log(tickets);
  // console.log(selectedSeats);
  // if(selectedSeats !== null){
  //   console.log(selectedSeats[0]);
  // }

  const handleGoBack = () => {
    // 이전 페이지로 이동
    router.push('/previous');
  };

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <div className="mb-4 bg-blue-500 p-4 text-white">
        <h1 className="text-left text-2xl font-bold">좌석 선택</h1>
      </div>

      {/* 티켓 정보 섹션 */}
      <div className="mb-4 flex justify-between bg-gray-200 p-4">
        <div className="text-3xl font-extrabold">{ticketInfo.NFT_NAME}</div>
        <div className="text-right text-sm">
          <div>{ticketInfo.TICKET_DATE}</div>
          <div>{ticketInfo.TICKET_TIME}</div>
          <div>{ticketInfo.PLACE}</div>
        </div>
      </div>

      {/* 좌우 화살표 버튼 */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => handleFloorChange('prev')} disabled={floor === 1}>
          <div className="cursor-pointer select-none" onClick={() => setFloor(floor - 1)}>
            &lt;
          </div>
        </button>
        <span className="text-xl font-bold">현재 층: {floor}층</span>
        <button onClick={() => handleFloorChange('next')} disabled={floor === 2}>
          <div className="cursor-pointer select-none" onClick={() => setFloor(floor - 1)}>
            &gt;
          </div>
        </button>
      </div>

      {/* 좌석 목록 */}
      <div className="mb-4 grid grid-cols-10 gap-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.ID}
            className={`col-span-1 cursor-pointer border p-2 ${selectedSeats.includes(ticket) ? 'border-4 border-black' : ''} ${
              ticket.IS_USED ? 'bg-gray-400' : getSeatColor(ticket.SEAT_GRADE)
            }`}
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
            {selectedSeats.map((ticket, index) => (
              <div key={ticket.ID} className={`border-b p-2 ${index !== selectedSeats.length - 1 ? 'mb-4' : ''}`}>
                <div className="flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석층수</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{ticket.SEAT_FLOOR}층</div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" /> {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석등급</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{ticket.SEAT_GRADE}</div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" /> {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석위치</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>
                      {ticket.SEAT_ROW}-{ticket.SEAT_COLUMN}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 버튼 2개 */}
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

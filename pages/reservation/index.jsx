import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from "axios";

//import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // 화살표 아이콘 사용

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [ticketInfo, setTicketInfo] = useState({});
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [userPoint, setUserPoint] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [floor, setFloor] = useState(1);
  const [error, setError] = useState(null); // 에러 상태 추가
  const router = useRouter(); // Next.js 라우터 쓰기

  useEffect(() => {
    const fetchTicketData = async () => {
      try {
        const res = await axios.get(
          `/api/tickets/ticketInfo`, {
            params: { floor },
            headers: {
              'Cache-Control': 'no-cache', //캐시 무시
            },
          });

        

        setTicketInfo(res.data.ticketInfo);
        setTickets(res.data.tickets);
      } catch (error) {
        console.log(error);
        setError('데이터를 불러오지 못했습니다'); // 에러 메시지 설정
        setTickets([]);
        setTicketInfo({});
      }
    };

    const fetchUserPoint = async () => {
      try {
        const res = await axios.get('/api/tickets/user',{
          headers: {
            'Cache-Control': 'no-cache', //캐시 무시
          },
        });
       
        
        setUserPoint(res.data.USER_POINT);
      } catch (error) {
        console.log(error);
        setError('데이터를 불러오지 못했습니다'); // 에러 메시지 설정
      }
    };

    fetchTicketData();
    fetchUserPoint();
  }, [floor]);

  useEffect(() => {
    const total = selectedSeats.reduce((sum, ticket) => sum + ticket.TICKET_PRICE, 0);
    setTotalPrice(total);
  }, [selectedSeats]);

  const handleSeatSelect = (ticket) => {
    if (ticket.TICKET_STATUS) {
      alert('이미 예매된 좌석입니다.');
      return;
    }
    if (selectedSeats.includes(ticket)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== ticket));
    } else {
      if (selectedSeats.length >= 3) {
        // 선택된 티켓이 3장 이상인 경우 초기화 후 새로운 티켓 추가
        setSelectedSeats([ticket]);
      } else {
        // 선택된 티켓이 3장 미만인 경우 티켓 추가
        setSelectedSeats([...selectedSeats, ticket]);
      }
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

  const remainingSeats = tickets.filter((ticket) => ticket.TICKET_STATUS === 0).length;

  const remainingSSeats = tickets.filter((ticket) => ticket.TICKET_STATUS === 0 && ticket.TICKET_GRADE === 'S').length;
  const remainingASeats = tickets.filter((ticket) => ticket.TICKET_STATUS === 0 && ticket.TICKET_GRADE === 'A').length;
  const remainingBSeats = tickets.filter((ticket) => ticket.TICKET_STATUS === 0 && ticket.TICKET_GRADE === 'B').length;
  const remainingCSeats = tickets.filter((ticket) => ticket.TICKET_STATUS === 0 && ticket.TICKET_GRADE === 'C').length;

  const handleCompleteSelection = () => {
    // 결제 페이지로 이동
    router.push('/payment');
  };

  const handleGoBack = () => {
    // 이전 페이지로 이동
    router.push('/previous');
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h4 className="text-center text-2xl font-bold">{error}</h4>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* 헤더 */}
      <div className="mb-4 bg-blue-500 p-4 text-white">
        <h1 className="text-left text-2xl font-bold">좌석 선택</h1>
      </div>

      {/* 티켓 정보 섹션 */}
      <div className="mb-4 flex justify-between bg-gray-200 p-4">
        <div className="text-3xl font-extrabold">{ticketInfo.TICKET_NAME}</div>
        <div className="text-right text-sm">
          <div>{ticketInfo.TICKET_DATE}</div>
          <div>{ticketInfo.TICKET_TIME}</div>
          <div>{ticketInfo.TICKET_PLACE}</div>
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
            key={ticket.TICKET_SEAT}
            className={`col-span-1 cursor-pointer border p-2 ${selectedSeats.includes(ticket) ? 'border-4 border-black' : ''} ${
              ticket.TICKET_STATUS ? 'bg-gray-400' : getSeatColor(ticket.TICKET_GRADE)
            }`}
            onClick={() => handleSeatSelect(ticket)}
          >
            {ticket.TICKET_ROW}-{ticket.TICKET_COLUMN}
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
              <div key={ticket.TICKET_SEAT} className={`border-b p-2 ${index !== selectedSeats.length - 1 ? 'mb-4' : ''}`}>
                {' '}
                {/* 마지막 티켓 외에는 mb-4 추가 */}
                <div className="flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석층수</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{ticket.TICKET_FLOOR}층</div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" /> {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석등급</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>{ticket.TICKET_GRADE}</div>
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-300" /> {/* 구분선 추가 및 마진 적용 */}
                <div className="mt-2 flex">
                  <div className="flex w-1/3 items-center justify-center bg-gray-200 p-2">
                    <div className="font-bold">좌석위치</div>
                  </div>
                  <div className="flex w-2/3 items-center p-2">
                    <div>
                      {ticket.TICKET_ROW}-{ticket.TICKET_COLUMN}
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
import { useRouter } from 'node_modules/next/router';
import { useEffect, useState } from 'react';

export default function FixedTicketingSection(props) {
  const { event, id } = props;
  const router = useRouter();

  const [choose, setChoose] = useState(0);
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function changeDate(days) {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  }

  function TimeAndEmptySeats(tickets) {
    const dateMap = new Map();

    tickets.forEach((ticket) => {
      const date = new Date(ticket.TICKET_DATE).toISOString().split('T')[0];
      const time = ticket.TICKET_TIME.substring(0, 5);
      const status = ticket.IS_USED;

      if (!dateMap.has(date)) {
        dateMap.set(date, new Map());
      }
      const timeMap = dateMap.get(date);
      if (!timeMap.has(time)) {
        timeMap.set(time, { emptySeats: 0 });
      }
      if (!status) {
        timeMap.get(time).emptySeats += 1;
      }
    });

    const result = Array.from(dateMap.entries()).map(([date, timeMap]) => ({
      date,
      times: Array.from(timeMap.entries()).map(([time, { emptySeats }]) => ({
        time,
        emptySeats,
      })),
    }));

    result.sort((a, b) => {
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) return dateComparison;

      return a.times[0].time.localeCompare(b.times[0].time);
    });

    return result;
  }

  const groupedTickets = TimeAndEmptySeats(event.tickets);
  const hasTicketsForSelectedDate = groupedTickets.some((ticketDate) => ticketDate.date === formatDate(selectedDate));

  // 로그인 여부 확인
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  function checkUser(){
    if(user === null){
      alert('로그인을 해주세요.');
    }

    if(user !== null && choose !== 0){
      router.push({
        pathname: '/reservation',
        query: {ticket_time: choose, event_pk: id, ticket_limit: event.event.TICKETING_LIMIT},
      });
     }
  }

  return (
    <>
      <div className="fixed right-32 top-40 flex h-[450px] w-[280px] flex-col rounded-2xl bg-[#4579FF] px-7 py-5 font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)]">
        <div>관람일</div>
        <div id="dateSection" className="flex justify-center space-x-3 py-5">
          <div className="cursor-pointer select-none" onClick={() => changeDate(-1)}>
            &lt;
          </div>
          <div className="select-none">{formatDate(selectedDate)}</div>
          <div className="cursor-pointer select-none" onClick={() => changeDate(1)}>
            &gt;
          </div>
        </div>

        <div id="section-bar" className="h-[1px] w-full bg-white" />
        <div className="pt-5">회차</div>
        {/* Render tickets or hello based on the presence of tickets */}
        {hasTicketsForSelectedDate ? (
          groupedTickets.map(
            (ticketDate, index) => ticketDate.date === formatDate(selectedDate) && (
              <div key={index} className="pt-1">
                {ticketDate.times.map((timeSlot, idx) => (
                  <div key={idx} id={timeSlot.time} className="flex items-center justify-between space-x-3 pt-5">
                    <div
                      onClick={() => setChoose(timeSlot.time)}
                      className={`relative flex h-10 w-28 cursor-pointer select-none items-center justify-center rounded-3xl ${choose === timeSlot.time ? 'bg-[#EF88D8] text-[#FFFFFF]' : 'bg-[#C8CBE8] text-black'} shadow-[5px_5px_5px_0px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-[#EF88D8] hover:text-[#FFFFFF]`}
                    >
                      <div className="absolute left-[10px] top-0 text-[10px]">{idx + 1}회</div>
                      <div>{timeSlot.time}</div>
                    </div>
                    <div className="text-[10px]">잔여 좌석 : {timeSlot.emptySeats}석</div>
                  </div>
                ))}
              </div>
            ),
          )
        ) : (
          <div className="p-4">
            예정된 티케팅 날짜가 <br /> 존재하지 않습니다.
          </div>
        )}
      </div>
      <div
        onClick={checkUser}
        className={`fixed right-32 top-[630px] flex h-[40px] w-[280px] items-center justify-center rounded-xl ${choose === 0 ? 'bg-[#383838]' : 'bg-[#4579FF]'} font-extrabold text-[#FFFFFF] shadow-[10px_10px_10px_0px_rgba(0,0,0,0.3)] transition-colors duration-300`}
      >
        <div>예매하기</div>
      </div>
    </>
  );
}

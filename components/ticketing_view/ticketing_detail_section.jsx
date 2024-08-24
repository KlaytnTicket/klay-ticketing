import Image from 'next/image';
import { useState, useEffect } from 'react';

import testImage from '../../image/이리.png';

export default function DeatilTicketingSection(props) {
  const { event } = props;

  // 티켓 등급별로 가격을 관리하는 상태
  const [ticketGradePrice, setTicketGradePrice] = useState([]);

  // 날짜 형식 변환 함수
  function formatDate(dateString) {
    const date = new Date(dateString);
    const year = String(date.getFullYear()).slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  }

  // 티켓 등급별로 가격을 정리하는 함수
  function getUniqueTicketGrades(tickets) {
    const ticketMap = new Map();

    tickets.forEach((ticket) => {
      if (!ticketMap.has(ticket.SEAT_GRADE)) {
        ticketMap.set(ticket.SEAT_GRADE, ticket.PRICE);
      }
    });

    const result = Array.from(ticketMap, ([grade, price]) => ({ grade, price })).sort((a, b) => b.price - a.price);
    return result;
  }

  // 가격별 좌석 나누는거 부터 불러오도록
  useEffect(() => {
    if (event && event.tickets) {
      const TicketGradePrice = getUniqueTicketGrades(event.tickets);
      setTicketGradePrice(TicketGradePrice);
    }
  }, [event]);

  return (
    <div className="px-44 py-16">
      {/* --------------------- 티케팅 관련 내용 소개 섹션 ---------------*/}
      <div className="pb-10">
        <div className="px-2 text-3xl font-extrabold">{event.event.NAME}</div>
      </div>
      <div className="flex">
        {/* 이미지 불러오는 기능 알아봐야하. */}
        <Image src={testImage} alt="이미지" width={320} height={240} className="w-80" />
        <div className="flex flex-col space-y-3 px-10 text-lg font-extrabold">
          <div>티케팅 현황 : </div>
          <div>유형 : </div>
          <div>장소 : </div>
          <div>1인 최대 발행 매수 : </div>
          <div>이벤트 진행 : </div>
          <div>티켓팅 기간 : </div>
          <div>가격 </div>
        </div>
        <div className="flex flex-col space-y-[17px] pt-[2px] font-extrabold">
          <div className="whitespace-nowrap">{event.event.TICKETING_IS_OPEN ? '종료' : '진행 중'}</div>
          <div className="whitespace-nowrap">{event.event.TAG}</div>
          <div className="whitespace-nowrap">{event.event.SITE}</div>
          <div className="whitespace-nowrap">{event.event.TICKETING_LIMIT}</div>
          <div className="whitespace-nowrap">
            {formatDate(event.event.EVENT_START)} ~ {formatDate(event.event.EVENT_END)}
          </div>
          <div className="whitespace-nowrap">
            {formatDate(event.event.TICKETING_START)} ~ {formatDate(event.event.TICKETING_END)}
          </div>
          <div className="flex flex-col space-y-3 pt-3">
            {ticketGradePrice?.map((ticket, index) => (
              <div key={index}>
                {ticket.grade} 좌석 : {ticket.price}원
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ------------------------------------------------------------ */}
      <div className="flex pt-36">
        <div className="flex h-[2000px] w-[1000px] items-center justify-center rounded-xl bg-[#E1EBED] text-[100px] font-extrabold">1000px 사진 넣는 곳</div>
      </div>
    </div>
  );
}

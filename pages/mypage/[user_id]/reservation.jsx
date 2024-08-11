import { useMemo } from 'react';
import useSWR from 'swr';

export default function MyPageReservation(props) {
  const { data } = useSWR(props && props.user_id ? `/api/mypage/reservation?user_id=${props.user_id}` : null);
  const r = useMemo(() => (data && data.r ? data.r : []), [data]);
  const d = useMemo(() => {
    if (data && data.r) {
      let es = r.map((i) => i.EVENT_START);
      es = es.map((i) => {
        const n = new Date(i);
        return `${n.getFullYear()}.${n.getMonth() + 1}.${n.getDate()}`;
      });
      return es;
    }
    return [];
  }, [data, r]);
  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">최근 예매내역</h1>
      </div>
      <div className="m-auto max-w-[80vw]">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th>공연이름</th>
              <th>티켓좌석</th>
              <th>가격</th>
              <th>티켓등급</th>
              <th>공연일</th>
              <th>사용여부</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {r.map((i, k) => (
              <tr key={k} className="border-b">
                <td>{i.EVENT_NAME}</td>
                <td>{i.EVENT_NAME}</td>
                <td>{i.TICKET_PRICE.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}원</td>
                <td>{i.TICKET_GRADE}</td>
                <td>{d[k]}</td>
                <td>{i.NFT_STATUS ? '사용 가능' : '사용 불가능'}</td>
              </tr>
            ))}
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export async function getServerSideProps(req) {
  const { user_id } = req.query;
  return {
    props: {
      user_id,
    },
  };
}

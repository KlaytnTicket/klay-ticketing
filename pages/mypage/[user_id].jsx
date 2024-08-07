import Link from 'next/link';
import { useMemo } from 'react';
import useSWRImmutable from 'swr/immutable';

export default function MyPage(props) {
  const { data } = useSWRImmutable(props ? `/api/mypage/${props.user_id}` : null, { refreshInterval: 0 });
  const u = useMemo(() => (data && data.result ? data.result[0] : {}), [data]);
  const c = 3;
  const d = '0x12345678890';
  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">마이페이지</h1>
        {u.USER_NICKNAME}님 환영합니다.
      </div>
      <div className="flex justify-center">
        <div className="h-32 w-[75%] rounded-lg bg-gray-300 shadow-lg">
          <ul className="grid h-full grid-flow-col grid-cols-3 items-center">
            <li className="p-4">
              <div>포인트</div>
              <div className="font-bold">{u.USER_POINT}</div>
            </li>
            <li className="p-4">
              <div>예매한 티켓</div>
              <div className="font-bold">{c}장</div>
            </li>
            <li className="p-4">
              <div>내 지갑</div>
              <div className="font-bold">{u.USER_WALLET}</div>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="p-4">
          <ul>
            <li className="my-2">
              <Link href="/mypage/setting">회원정보 수정</Link>
            </li>
            <li className="my-2">
              <Link href="/mypage/reservation">최근 예매내역</Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <ul>
            <li className="my-2">
              <a href="mailto:qjawns10000@naver.com">고객 센터</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function getServerSideProps(req) {
  const { user_id } = req.query;
  return {
    props: {
      user_id,
    },
  };
}

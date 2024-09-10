import { executeQuery } from '@lib/postgres';
import Link from 'next/link';
import { useMemo } from 'react';

export default function MyPage(props) {
  const u = useMemo(() => (props && props.result ? props.result[0] : {}), [props]);
  const c = useMemo(() => (props && props.c ? props.c : []), [props]);
  if (!props || !props.result) {
    return <div>loading...</div>;
  }
  return (
    <div className="px-28 pt-6">
      <div>
        <h1 className="ml-44 mt-5 text-xl font-bold">마이페이지</h1>
        <p className="ml-44 mt-2">
          <span className="">{u.USER_NICKNAME}</span> 님 환영합니다.
        </p>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="h-32 w-[75%] rounded-lg bg-gray-300 shadow-lg">
          <ul className="grid h-full grid-flow-col grid-cols-3 items-center">
            <li className="p-4">
              <div>포인트</div>
              <div className="font-bold">{u.USER_POINT}</div>
            </li>
            <li className="p-4">
              <div>예매한 티켓</div>
              <div className="font-bold">{c.length}장</div>
            </li>
            <li className="p-4">
              <div>내 지갑</div>
              <div className="font-bold">{u.USER_WALLET}</div>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="ml-60 p-4">
          <ul>
            <li className="my-2">
              <Link href={`/mypage/${u.USER_ID}/setting`}>회원정보 수정</Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <ul>
            <li className="my-2">
              <Link href={`/mypage/${u.USER_ID}/reservation`}>최근 예매내역</Link>
            </li>
          </ul>
        </div>
        <div className="p-4">
          <ul>
            <li className="my-2">
              <Link href={'/payment'}>포인트 충전</Link>
            </li>
          </ul>
        </div>
        <div className="mr-60 p-4">
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

export async function getServerSideProps(req) {
  const { user_id } = req.query;
  const result = await executeQuery(`SELECT * FROM "USER" WHERE "USER_ID" = '${user_id}'`);
  const c = await executeQuery(`SELECT * FROM "NFT" WHERE "USER_ID" = '${user_id}' AND "NFT_STATUS" = true`);
  return {
    props: {
      result,
      c,
    },
  };
}

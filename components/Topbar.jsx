import Image from 'node_modules/next/image';
import Link from 'node_modules/next/link';
import { useRouter } from 'node_modules/next/router';
import React, { useEffect, useState } from 'react';

import ButtonA from './ButtonA';
import icon from '../image/icon1.png';
import LOGO from '../image/logo.png';

export default function Topbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // top bar 이벤트 설정 페이지로 이동 하기 위한 변수
  const [Admin, setAdmin] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [router.asPath]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  function egg() {
    if (Admin === '나관리잔데') {
      // 페이지 이동을 처리하는 코드
      window.location.href = 'http://localhost:3000/admins/event';
    }
  }

  return (
    <div className="flex h-24 w-full items-center justify-between overflow-hidden border-b-2 bg-[#F3F4F6] px-48 text-slate-500">
      <div className="flex items-center">
        <Link href={'/mainpage'} className="py-4">
          <Image className="w-52 cursor-pointer" src={LOGO} alt="" />
        </Link>
        <input value={Admin} onChange={(e) => setAdmin(e.target.value)} className="h-12 w-96 rounded-l-xl border pl-5" type="text" placeholder="찾으시는 이벤트를 검색해 보세요" />
        <button className="flex h-12 w-14 items-center justify-center rounded-r-xl bg-[#4579FF]" onClick={egg}>
          <Image src={icon} />
        </button>
      </div>
      {!user ? (
        <div className="flex items-center gap-5">
          <div className="text-lg font-extrabold">사용을 위해 로그인을 해주세요.</div>
          <ButtonA URL="login" label="로그인" styleClass={'w-28 h-11 border-[3px] rounded-lg fontA text-ms'} />
          <ButtonA URL="signup" label="회원가입" styleClass={'w-28 h-11 border-[3px] rounded-lg fontA text-ms'} />
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="text-lg font-extrabold">{user.nickname}</div>
          <ButtonA URL={`mypage/${user.userID}`} label={'마이 페이지'} width={100} />
          <ButtonA URL="mainpage" onClick={handleLogout} label={'로그아웃'} width={80} />
        </div>
      )}
    </div>
  );
}

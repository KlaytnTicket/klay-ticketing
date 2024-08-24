import Image from 'node_modules/next/image';
import Link from 'node_modules/next/link';
import { useRouter } from 'node_modules/next/router';
import React, { useEffect, useState } from 'react';

import ButtonA from './ButtonA';
import LOGO from '../image/logo.png';

export default function Topbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, [router.asPath]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="flex h-24 w-full items-center justify-between overflow-hidden border-b-2 bg-[#F3F4F6] px-16 text-slate-500">
      <Link href={'/mainpage'} className="py-4">
        <Image className="w-52 cursor-pointer" src={LOGO} alt="" />
      </Link>
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

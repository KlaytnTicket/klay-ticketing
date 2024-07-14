'use client';
import React, { useState } from 'react';
import ButtonA from './ButtonA';
import LOGO from '../images/logo.png';
import Image from 'node_modules/next/image';
import Link from 'node_modules/next/link';

export default function Topbar() {
  const [user, setUser] = useState(null);

  return (
    <div className="flex h-24 w-full items-center justify-between border-b-2 bg-[#F3F4F6] px-16 text-slate-500">
      <Link href={'/caver-test'} className="py-4">
        <Image className="w-52 cursor-pointer" src={LOGO} alt="" />
      </Link>
      {!user ? (
        <div className="flex items-center gap-5">
          <div className="text-lg font-extrabold">사용을 위해 로그인을 해주세요.</div>
          <ButtonA URL="/sign-in" label="로그인" styleClass={'w-28 h-11 border-[3px] rounded-lg fontA text-ms'} />
        </div>
      ) : (
        <div className="flex items-center gap-5">
          <div className="text-lg font-extrabold">{user.name}</div>
          <ButtonA onClick={logout} label={'로그아웃'} width={80} />
        </div>
      )}
    </div>
  );
}

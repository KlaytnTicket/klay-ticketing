import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [userID, setUserID] = useState('');
  const [userPSW, setUserPSW] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async(event) =>{
    event.preventDefault();

    if(!userID || !userPSW){
      alert("아이디 또는 비번을 입력하지 않았다..");
    }

    try {
      const res = await axios.post(
        '/api/accounts/login', 
        {userID: userID, userPSW: userPSW}
      );

      if(res.status === 200){
        localStorage.setItem('user', JSON.stringify(res.data.user));
        router.push('/mainpage');
      }
    } catch(error){
      setError('로그인 실패. 당신의 인증 값을 다시 확인해주세요.');
    }
  };

  return (
    <div className="bg-white">      
      <Head>
        <title>로그인</title>
      </Head>

      {/* 로고 */}      
		  <header>
        <div className="container mx-auto flex justify-center
        mt-32">
          <Link href="/mainpage">로고</Link>
        </div>        
      </header>      

      {/* 로그인 폼 */}
      <main className="min-h-screen flex mt-8 justify-center">
        <div className="items-center">
          <div className="shadow-md p-8 rounded-lg px-36 ">
            <form onSubmit={handleSubmit}>
              <input 
                type="text"
                value={userID}
                onChange={(e)=>setUserID(e.target.value)}
                required
                placeholder="아이디"
                className="border-slate-300 border-2 
                rounded-md pr-20 pl-2 py-2"
              /><br />
              <input 
                type="password"
                value={userPSW}
                onChange={(e)=>setUserPSW(e.target.value)}
                required
                placeholder="비밀번호"
                className="border-slate-300 border-2 
                rounded-md pr-20 pl-2 py-2 mt-2"
              />              
              <br />
              <input type="radio"
                className="mt-4"
              /><label> 로그인 상태 유지</label>        
              <br />
              {error && <p>{error}</p>}
              <button
                className="py-2 px-28 mt-4
                bg-custom-blue text-white
                font-light rounded-full shadow-md"
              >로그인</button>
            </form>
          </div>

          <div className="font-bold text-xs ml-40 mt-2">
            <Link href="/registerSearch">아이디 찾기</Link> |
            <Link href="/registerSearch/resetpsw"> 비밀번호 찾기</Link> |            
            <Link href="/signup"
              className="text-custom-blue"> 회원가입</Link> 
          </div>          
        </div>        
      </main>
    </div>
  );
}
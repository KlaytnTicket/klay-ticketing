import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PasswordSearch(){
  const [userID, setUserID] = useState('');
  const [newPSW, setNewPSW] = useState('');
  const [newPSWConfirm, setNewPSWConfirm] = useState('');
  
  const [newForm, setNewForm] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckUser = async (event) =>{
    event.preventDefault();

    try {
      const res = await axios.post(
        '/api/accounts/resetpsw',
        {userID}
      );

      if(res.status === 200){
        setNewForm(true);
        setError('');
      }
    } catch (error) {
      setError(error.res?.data?.message || '아이디 확인 실패. 다시 시도하세요.');
      setNewForm(false);
    }
  };

  const handleResetPSW = async (event) =>{
    event.preventDefault();

    if(newPSW !== newPSWConfirm){
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post(
        '/api/accounts/resetpsw',
        {userID, newPSW}
      );

      if(res.status === 200){
        router.push('/login');
        setError('');
      }
    } catch (error) {
      setError(error.res?.data?.message || '비밀번호 변경 실패');
    }
  };


  return(
    <div>
    <Head>
      <title>계정 찾기</title>
    </Head>

    <Link href="/login">로그인</Link>

    <main className="min-h-screen mt-32 flex justify-center">      
      <div>
        <h2 className="font-bold text-2xl px-10 
          ml-28">계정 찾기</h2>                
        <div className="flex mt-4">
          <Link href="/registerSearch"
            className="px-14 border-slate-300 border-b-2">
            아이디 찾기</Link>

          <Link href="/registerSearch/resetpsw"
            className="px-14 font-semibold
            border-slate-800 border-b-4">비밀번호 찾기</Link>
        </div>

        { newForm ? (                  
        <div>
        {/* 입력한 아이디가 있을 시 나오기(비번변경 폼) */}
          <p className="ml-2 mt-10 pl-2 py-2 w-96
          font-bold bg-slate-300 rounded-md">
            {userID}
          </p>
          <form onSubmit={handleResetPSW}>
            <input  
              name="new_password"             
              type="password"
              value={newPSW}
              onChange={(e)=>setNewPSW(e.target.value)}
              required
              maxLength="12" minLength="8"
              placeholder="새 비밀번호"
              className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-96 mt-4 ml-2"
            /><br/>          
            <input 
              type="password"
              value={newPSWConfirm}
              onChange={(e)=>setNewPSWConfirm(e.target.value)}
              required
              maxLength="12" minLength="8"
              placeholder="새 비밀번호 확인"
              className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-96 mt-4 ml-2"
            /><br/>
                        
            {error && <p>{error}</p>}

            <button type="submit"
              className="py-2 px-44 mt-5 ml-2
              bg-custom-blue text-white
                font-light rounded-full shadow-md"
            >확인</button>
          </form>
        </div>
        ) : (                  
        <div> {/* 기본 */}
          <p className="ml-4 mt-10 font-bold">
            아이디를 확인 후<br />
            비밀번호를 재설정 할 수 있어요.
          </p>
          <form onSubmit={handleCheckUser}>
            <input 
              value={userID}
              onChange={(e)=>setUserID(e.target.value)}
              required
              placeholder="아이디"
              className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-96 mt-8 ml-2"
            /><br/>      

            {error && <p>{error}</p>}

            <button type="submit"
              className="py-2 px-36 mt-5 ml-4
              bg-custom-blue text-white
                font-light rounded-full shadow-md"
            >아이디 확인</button>
          </form>
        </div>)}                
      </div>
    </main>      
    </div>
  );
}
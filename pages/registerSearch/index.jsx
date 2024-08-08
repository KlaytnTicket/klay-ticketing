import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [userNICKNAME, setUserNICKNAME] = useState('');
  const [userEMAIL, setUserEMAIL] = useState('');
  const [userID, setUserID] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        '/api/accounts/find-id',
        {userNICKNAME, userEMAIL}
      );

      if(res.status === 200){
        setSuccess(true);
        setUserID(res.data.userID);
        setError('');
      }
    } catch (error) {
      setError(error.res?.data?.message || '아이디 찾기 실패. 다시 시도해라.');
      setSuccess(false);
    }
  };

  return (
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
              className="px-14 font-semibold
              border-slate-800 border-b-4">아이디 찾기</Link>

            <Link href="/registerSearch/resetpsw"
              className="px-14 border-slate-300 border-b-2">
              비밀번호 찾기</Link>
          </div>
          

          {/* 아이디 찾은 결과 */}
          {success  ? (<div>
            <input type="radio"
              checked ="true"
              className="ml-4 mt-10"
            />
            <label
              className="ml-2"
            >아이디: {userID}</label>
            <div className="mt-12">
              <Link href="/registerSearch/resetpsw"
                className="mr-20 py-3 px-5
                border-slate-300 border-2 rounded-full"
              >비밀번호 찾기</Link>

              <Link href="/login"
                className="ml-3 py-3 px-12
                bg-custom-blue text-white rounded-full"
              >로그인</Link>
            </div>
          </div>) : (<>
            <input type="radio"
              name="search"
              className="ml-4 mt-10"
              checked="true"
            />
            <label
              className="font-semibold ml-2"
            >이메일로 찾기</label>
            <div>
              <p className="ml-9 text-gray-400">
                입력하신 이름과 이메일 주소가 회원 정보와<br />
                일치한 경우 인증번호가 발송돼요.
              </p>
              <form onSubmit={handleSubmit}>
                <input
                  value={userNICKNAME}
                  onChange={(e) => setUserNICKNAME(e.target.value)}
                  required
                  placeholder="이름"
                  className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-80 mt-5 ml-8"
                /><br />
                <input
                  value={userEMAIL}
                  onChange={(e) => setUserEMAIL(e.target.value)}
                  required
                  placeholder="이메일 주소"
                  className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-80 mt-4 ml-8"
                /><br />
                
                {error && <p>{error}</p>}

                <button type="submit"
                  className="py-2 px-36 mt-5 ml-8
              bg-custom-blue text-white
                font-light rounded-full shadow-md"
                >확인</button>
              </form>
            </div></>)}
        </div>
      </main>
    </div>
  );
}
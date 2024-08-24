import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [userNICKNAME, setUserNICKNAME] = useState('');
  const [userEMAIL, setUserEMAIL] = useState('');
  const [userID, setUserID] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post('/api/accounts/find-id', { userNICKNAME, userEMAIL });

      if (res.status === 200) {
        setSuccess(true);
        setUserID(res.data.userID);
        setError('');
      }
    } catch (err) {
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

      <main className="mt-32 flex min-h-screen justify-center">
        <div>
          <h2 className="ml-28 px-10 text-2xl font-bold">계정 찾기</h2>

          <div className="mt-4 flex">
            <Link href="/registerSearch" className="border-b-4 border-slate-800 px-14 font-semibold">
              아이디 찾기
            </Link>

            <Link href="/registerSearch/resetpsw" className="border-b-2 border-slate-300 px-14">
              비밀번호 찾기
            </Link>
          </div>

          {/* 아이디 찾은 결과 */}
          {success ? (
            <div>
              <input type="radio" checked="true" className="ml-4 mt-10" />
              <label className="ml-2">아이디: {userID}</label>
              <div className="mt-12">
                <Link href="/registerSearch/resetpsw" className="mr-20 rounded-full border-2 border-slate-300 px-5 py-3">
                  비밀번호 찾기
                </Link>

                <Link href="/login" className="ml-3 rounded-full bg-custom-blue px-12 py-3 text-white">
                  로그인
                </Link>
              </div>
            </div>
          ) : (
            <>
              <input type="radio" name="search" className="ml-4 mt-10" checked="true" />
              <label className="ml-2 font-semibold">이메일로 찾기</label>
              <div>
                <p className="ml-9 text-gray-400">
                  입력하신 이름과 이메일 주소가 회원 정보와
                  <br />
                  일치한 경우 인증번호가 발송돼요.
                </p>
                <form onSubmit={handleSubmit}>
                  <input
                    value={userNICKNAME}
                    onChange={(e) => setUserNICKNAME(e.target.value)}
                    required
                    placeholder="이름"
                    className="ml-8 mt-5 w-80 rounded-md border-2 border-slate-300 py-2 pl-2"
                  />
                  <br />
                  <input
                    value={userEMAIL}
                    onChange={(e) => setUserEMAIL(e.target.value)}
                    required
                    placeholder="이메일 주소"
                    className="ml-8 mt-4 w-80 rounded-md border-2 border-slate-300 py-2 pl-2"
                  />
                  <br />

                  {error && <p>{error}</p>}

                  <button type="submit" className="ml-8 mt-5 rounded-full bg-custom-blue px-36 py-2 font-light text-white shadow-md">
                    확인
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

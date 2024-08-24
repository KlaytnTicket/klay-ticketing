import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function PasswordSearch() {
  const [userID, setUserID] = useState('');
  const [newPSW, setNewPSW] = useState('');
  const [newPSWConfirm, setNewPSWConfirm] = useState('');

  const [newForm, setNewForm] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCheckUser = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post('/api/accounts/resetpsw', { userID });

      if (res.status === 200) {
        setNewForm(true);
        setError('');
      }
    } catch (err) {
      setError(error.res?.data?.message || '아이디 확인 실패. 다시 시도하세요.');
      setNewForm(false);
    }
  };

  const handleResetPSW = async (event) => {
    event.preventDefault();

    if (newPSW !== newPSWConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('/api/accounts/resetpsw', { userID, newPSW });

      if (res.status === 200) {
        router.push('/login');
        setError('');
      }
    } catch (err) {
      setError(error.res?.data?.message || '비밀번호 변경 실패');
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
            <Link href="/registerSearch" className="border-b-2 border-slate-300 px-14">
              아이디 찾기
            </Link>

            <Link href="/registerSearch/resetpsw" className="border-b-4 border-slate-800 px-14 font-semibold">
              비밀번호 찾기
            </Link>
          </div>

          {newForm ? (
            <div>
              {/* 입력한 아이디가 있을 시 나오기(비번변경 폼) */}
              <p className="ml-2 mt-10 w-96 rounded-md bg-slate-300 py-2 pl-2 font-bold">{userID}</p>
              <form onSubmit={handleResetPSW}>
                <input
                  name="new_password"
                  type="password"
                  value={newPSW}
                  onChange={(e) => setNewPSW(e.target.value)}
                  required
                  maxLength="12"
                  minLength="8"
                  placeholder="새 비밀번호"
                  className="ml-2 mt-4 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
                />
                <br />
                <input
                  type="password"
                  value={newPSWConfirm}
                  onChange={(e) => setNewPSWConfirm(e.target.value)}
                  required
                  maxLength="12"
                  minLength="8"
                  placeholder="새 비밀번호 확인"
                  className="ml-2 mt-4 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
                />
                <br />

                {error && <p>{error}</p>}

                <button type="submit" className="ml-2 mt-5 rounded-full bg-custom-blue px-44 py-2 font-light text-white shadow-md">
                  확인
                </button>
              </form>
            </div>
          ) : (
            <div>
              {' '}
              {/* 기본 */}
              <p className="ml-4 mt-10 font-bold">
                아이디를 확인 후<br />
                비밀번호를 재설정 할 수 있어요.
              </p>
              <form onSubmit={handleCheckUser}>
                <input
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  required
                  placeholder="아이디"
                  className="ml-2 mt-8 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
                />
                <br />

                {error && <p>{error}</p>}

                <button type="submit" className="ml-4 mt-5 rounded-full bg-custom-blue px-36 py-2 font-light text-white shadow-md">
                  아이디 확인
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

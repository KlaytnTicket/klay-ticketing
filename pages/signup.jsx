import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Register() {
  const [userID, setUserID] = useState('');
  const [userPSW, setUserPSW] = useState('');
  const [userNICKNAME, setUserNICKNAME] = useState('');
  const [userWALLET, setUserWALLET] = useState('');
  const [userEMAIL, setUserEMAIL] = useState('');

  const [PSWConfirm, setPSWConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (userPSW !== PSWConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axios.post('/api/accounts/signup', { userID, userPSW, userNICKNAME, userWALLET, userEMAIL });

      if (res.status === 201) {
        setSuccess('유저 가입 성공');
        setError('');
        router.push('/login');
      }
    } catch (err) {
      setError(error.res?.data?.message || '회원가입 실패. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  return (
    <div className="bg-white">
      <Head>
        <title>회원가입</title>
      </Head>

      <main className="mt-8 flex min-h-screen justify-center">
        <form onSubmit={handleSubmit}>
          <div className="rounded-lg p-8 pb-14 pr-24 shadow-md">
            <div className="font-semibold">
              <label>아이디</label>
              <br />
              <input
                name="USER_ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                required
                maxLength="20"
                placeholder="최대 20자 이내의 영문, 숫자"
                className="mb-3 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />

              <label>비밀번호</label>
              <br />
              <input
                name="USER_PSW"
                value={userPSW}
                onChange={(e) => setUserPSW(e.target.value)}
                required
                type="password"
                maxLength="12"
                minLength="8"
                placeholder="8~12자 영문, 숫자, 특수문자"
                className="mb-3 mt-1 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />

              <label>비밀번호 확인</label>
              <br />
              <input
                name="USER_PSW_CONFIRM"
                value={PSWConfirm}
                onChange={(e) => setPSWConfirm(e.target.value)}
                required
                type="password"
                maxLength="12"
                minLength="8"
                placeholder="8~12자 영문, 숫자, 특수문자"
                className="mb-3 mt-1 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />

              <label>이름(닉네임)</label>
              <br />
              <input
                name="USER_NICKNAME"
                value={userNICKNAME}
                onChange={(e) => setUserNICKNAME(e.target.value)}
                required
                className="mb-3 mt-1 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />

              <label>Wallet 지갑 주소</label>
              <br />
              <input
                name="USER_WALLET"
                value={userWALLET}
                onChange={(e) => setUserWALLET(e.target.value)}
                required
                placeholder="자신의 지갑 주소를 꼭 써주세요!"
                className="mb-3 mt-1 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />

              <label>E-mail</label>
              <br />
              <input
                name="USER_EMAIL"
                value={userEMAIL}
                onChange={(e) => setUserEMAIL(e.target.value)}
                required
                placeholder="티켓팅 결과 내용을 전송받는 용도"
                className="mb-3 mt-1 w-96 rounded-md border-2 border-slate-300 py-2 pl-2"
              />
              <br />
            </div>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
          </div>

          <div className="grid justify-items-end">
            <button type="submit" className="mt-4 rounded-full bg-custom-blue px-4 py-2 font-light text-white shadow-md">
              회원 가입
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

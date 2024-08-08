import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register(){
  const [userID, setUserID] = useState('');
  const [userPSW, setUserPSW] = useState('');
  const [userNICKNAME, setUserNICKNAME] = useState('');
  const [userWALLET, setUserWALLET] = useState('');
  const [userEMAIL, setUserEMAIL] = useState('');

  const [PSWConfirm, setPSWConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) =>{
    event.preventDefault();
    
    if(userPSW !== PSWConfirm){
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const res = await axios.post(
        '/api/accounts/signup',
        { userID: userID, userPSW: userPSW,
          userNICKNAME: userNICKNAME, 
          userWALLET: userWALLET, userEMAIL: userEMAIL}
      );

      if(res.status === 201){
        setSuccess('유저 가입 성공');
        setError('');
        router.push('/login');
      }
    } catch (error) {
      setError(error.res?.data?.message || '회원가입 실패. 다시 시도해주세요.');
      setSuccess('');
    }
  };

  return(
    <div className="bg-white">
      <Head>
        <title>회원가입</title>
      </Head>

      <main className="min-h-screen flex mt-8 justify-center">
        <form onSubmit={handleSubmit}>
          <div className="shadow-md p-8 rounded-lg pr-24 pb-14">
            <div className="font-semibold">
              <label>아이디</label><br />
              <input 
                name="USER_ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                required
                maxLength="20"
                placeholder="최대 20자 이내의 영문, 숫자"
                className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-96 mb-3"                
              /><br />

              <label>비밀번호</label><br />
              <input
                name="USER_PSW"
                value={userPSW}
                onChange={(e) => setUserPSW(e.target.value)}
                required
                type="password"
                maxLength="12" minLength="8"
                placeholder="8~12자 영문, 숫자, 특수문자"
                className="border-slate-300 border-2 
                rounded-md pl-2 py-2 w-96 mt-1 mb-3"
              /><br />

              <label>비밀번호 확인</label><br />
              <input 
                name="USER_PSW_CONFIRM"
                value={PSWConfirm}
                onChange={(e) => setPSWConfirm(e.target.value)}
                required
                type="password"
                maxLength="12" minLength="8"
                placeholder="8~12자 영문, 숫자, 특수문자"
                className="border-slate-300 border-2 
                rounded-md  pl-2 py-2 w-96 mt-1 mb-3"
              /><br />

              <label>이름(닉네임)</label><br />
              <input 
                name="USER_NICKNAME"
                value={userNICKNAME}
                onChange={(e) => setUserNICKNAME(e.target.value)}
                required
                className="border-slate-300 border-2 
                rounded-md  pl-2 py-2 w-96 mt-1 mb-3"
              /><br />

              <label>Wallet 지갑 주소</label><br />
              <input 
                name="USER_WALLET"
                value={userWALLET}
                onChange={(e) => setUserWALLET(e.target.value)}
                required
                placeholder="자신의 지갑 주소를 꼭 써주세요!"
                className="border-slate-300 border-2 
                rounded-md  pl-2 py-2 w-96 mt-1 mb-3"
              /><br />

              <label>E-mail</label><br />
              <input 
                name="USER_EMAIL"
                value={userEMAIL}
                onChange={(e) => setUserEMAIL(e.target.value)}
                required
                placeholder="티켓팅 결과 내용을 전송받는 용도"
                className="border-slate-300 border-2 
                rounded-md  pl-2 py-2 w-96 mt-1 mb-3"
              /><br />              
            </div>
            {error && <p>{error}</p>}
            {success && <p>{success}</p>}
          </div>

          <div className="grid justify-items-end">
            <button type="submit"
              className="mt-4 py-2 px-4        
            bg-custom-blue text-white
              font-light rounded-full shadow-md">
              회원 가입</button>
          </div>
        </form>
      </main>
    </div>
  );
}
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [requestKey, setRequestKey] = useState('');

  const [events, setEvents] = useState([]); // 이벤트 선택
  const [cA, setCA] = useState('');
  const [address, setAddress] = useState('');
  const [tokenResult, setTokenResult] = useState(null); // 통과 여부

  // Klip API 요청
  const requestKlip = async () => {
    try {
      const res = await axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', {
        bapp: {
          name: 'klaytn_ticketing',
        },
        type: 'auth',
      });

      const { request_key } = res.data;
      setRequestKey(request_key);

      // Klip Wallet에서 서명 진행
      window.open(`https://klipwallet.com/?target=/a2a?request_key=${request_key}`, '_blank');

      // 서명 체크 확인
      const checkResult = setInterval(async () => {
        try {
          const response = await axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`);

          if (response.data.result) {
            clearInterval(checkResult); // 서명 완료 시 체크 중지
            const userAddress = response.data.result.klaytn_address;
            setAddress(userAddress);
          }
        } catch (err) {
          /* 에러 처리 */
        }
      }, 1000); // 1초 간격 체크

      setTimeout(() => clearInterval(checkResult), 60000);
    } catch (error) {
      /* blank */
    }
  };

  // 이벤트 가져오기
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await axios.get('/api/events/events', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      setEvents(res.data);
    };

    fetchEvents();
  }, []);

  // 토큰 조회
  const searchToken = async () => {
    try {
      const res = await axios.post('/api/caver/nftsearch', { cA, address });

      if (res.data.hasToken) {
        setTokenResult('티켓 통과.');
      } else {
        setTokenResult('토큰 없다.');
      }
    } catch (error) {
      setTokenResult('오류 발생');
    }
  };

  return (
    <div className='min-h-screen p-4 flex flex-col items-center'>
      <h1 className='text-2xl font-bold text-center mb-2'>Klip 확인</h1>
      <p className='mb-4 italic font-light text-sm'>해당 버튼을 눌러주세요.</p>
      <button onClick={requestKlip}
        className='w-full max-w-xs bg-blue-400 text-white py-2 px-4 rounded-lg mb-4 hover:bg-blue-600 transition'>
          Klip 지갑 조회
      </button> <br /><br />

      <div className='w-full max-w-xs mb-4'>
        <label className='block text-gray-700 text-sm mb-2 font-bold'>이벤트 선택</label>
        <select value={cA}
          onChange={(e) => setCA(e.target.value)}
          className='w-full bg-white border border-gray-300 rounded-lg p-1'
        >
          <option value="">EVENT 목록</option>
          {events.map((event) => (
            <option key={event.ID} value={event.CONTRACT_ADDRESS}>
              {event.NAME}
            </option>
          ))}
        </select>
      </div>

      <div className='w-full max-w-xs text-gray-700 mb-4'>
        선택된 컨트랙트 주소: {cA || '선택되지 않음'}
      </div> <br />

      {address && (
        <div className='w-full max-w-xs text-center'>
          <p className='text-gray-700 mb-2'>지갑 주소: {address}</p>
          <button onClick={searchToken}
            className='w-full bg-blue-400 text-white py-2 px-4  rounded-lg hover:bg-blue-600 transition'
          >
            NFT 토큰 조회
          </button>
          {tokenResult && <p className='mt-4 text-gray-700'>결과: {tokenResult}</p>}
        </div>
      )}
    </div>
  );
}

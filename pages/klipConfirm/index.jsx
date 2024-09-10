import axios from 'axios';
import { useState, useEffect } from 'react';

export default function ConfirmSetting() {
  const [requestKey, setRequestKey] = useState('');
  const [events, setEvents] = useState([]); // 이벤트 선택
  const [cA, setCA] = useState('');
  const [address, setAddress] = useState('');
  const [tokenResult, setTokenResult] = useState(null); // 통과 여부

  // 모바일 접속 여부 확인
  const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

  // Klip API 요청 (자동 서명 요청)
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
          const response = await axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${request_key}`);

          if (response.data.result) {
            clearInterval(checkResult); // 서명 완료 시 체크 중지
            const userAddress = response.data.result.klaytn_address;
            setAddress(userAddress);

            // 주소를 받아온 후 자동으로 NFT 조회
            searchToken(userAddress, cA);
          }
        } catch (err) {
          /* 에러 처리 */
        }
      }, 1000); // 1초 간격 체크

      setTimeout(() => clearInterval(checkResult), 60000);
    } catch (error) {
      /* 에러 처리 */
    }
  };

  // 토큰 조회
  const searchToken = async (userAddress, contractAddress) => {
    try {
      const res = await axios.post('/api/caver/nftsearch', { cA: contractAddress, address: userAddress });

      if (res.data.hasToken) {
        setTokenResult('티켓 통과.');
      } else {
        setTokenResult('토큰 없다.');
      }
    } catch (error) {
      setTokenResult('오류 발생');
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
      setCA(res.data[0].CONTRACT_ADDRESS); // 이걸로 default 이벤트 설정

      // 모바일 접속 시 자동으로 Klip 요청
      if (isMobile()) {
        requestKlip();
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 이벤트 선택 시마다 NFT 조회
  useEffect(() => {
    if (address && cA) {
      searchToken(address, cA);
    }
  }, [cA, address]);

  // 배경색 결정(가시성)
  const getBgColor = () => {
    switch (tokenResult) {
    case '티켓 통과':
      return 'bg-blue-200';
    case '토큰 없다.':
      return 'bg-red-200';
    case '오류 발생':
      return 'bg-gray-200';
    default:
      return 'bg-white';
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center p-4">
      <h1 className="mb-2 text-center text-2xl font-bold">Klip 확인</h1>
      <p className="mb-4 text-sm font-light italic">모바일에서 자동으로 토큰 확인이 진행됩니다.</p>

      <div className="mb-4 w-full max-w-xs">
        <label className="mb-2 block text-sm font-bold text-gray-700">이벤트 선택</label>
        <select value={cA} onChange={(e) => setCA(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-1">
          {events.map((event) => (
            <option key={event.ID} value={event.CONTRACT_ADDRESS}>
              {event.NAME}
            </option>
          ))}
        </select>
      </div>

      {/* <div className='w-full max-w-xs text-gray-700 mb-4'>
        선택된 컨트랙트 주소: {cA}
      </div> */}

      {address && (
        <div className={`w-full max-w-xs rounded-lg p-4 text-center ${getBgColor()}`}>
          {/* <p className='text-gray-700 mb-2'>지갑 주소: {address}</p> */}
          {tokenResult && <p className="mt-4 text-gray-700">결과: {tokenResult}</p>}
        </div>
      )}
    </div>
  );
}

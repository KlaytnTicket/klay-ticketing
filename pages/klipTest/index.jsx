import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [qrValue, setQrvalue] = useState('');
  const [requestKey, setRequestKey] = useState('');

  const [events, setEvents] = useState([]); // 이벤트 선택
  const [cA, setCA] = useState('');
  const [address, setAddress] = useState('');
  const [tokenResult, setTokenResult] = useState(null); // 통과 여부

  // Klip API로 QR 코드 요청
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
      setQrvalue(`https://klipwallet.com/?target=/a2a?request_key=${request_key}`);
    } catch (error) {
      // console.error('Klip 요청 실패', error);
    }
  };

  // Klip API로 지갑 주소 조회
  const getResult = async () => {
    try {
      const res = await axios.get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`);

      if (res.data.result) {
        const userAddress = res.data.result.klaytn_address;
        setAddress(userAddress);
      } else {
        // console.log('보류 중...');
      }
    } catch (err) {
      // console.error('Klip 결과 체크 실패', err);
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
    <div>
      <h1>Klip 지갑 주소 조회</h1>
      <button onClick={requestKlip}>Klip 지갑 연결</button>
      <br />
      {qrValue && (
        <div>
          <p>스캔</p>
          <p>{qrValue}</p>
          {/* <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrValue}`} /> */}
        </div>
      )}

      <br />
      <div>
        <label>
          이벤트 선택 :
          <select value={cA} onChange={(e) => setCA(e.target.value)}>
            <option value="">EVENT 목록</option>
            {events.map((event) => (
              <option key={event.ID} value={event.CONTRACT_ADDRESS}>
                {event.NAME}
              </option>
            ))}
          </select>
        </label><br />
        선택된 컨트랙트 주소 : {cA}
      </div><br />

      <button onClick={getResult}>지갑 주소 확인</button>
      {address && (
        <div>
          <p>지갑 주소: {address}</p>
          <button onClick={searchToken}>NFT 토큰 조회</button>
          {tokenResult && <p>결과: {tokenResult}</p>}
        </div>
      )}
    </div>
  );
}

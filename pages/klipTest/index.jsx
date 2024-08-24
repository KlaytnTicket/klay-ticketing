import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Home() {
  const [qrValue, setQrvalue] = useState('');
  const [address, setAddress] = useState('');
  const [requestKey, setRequestKey] = useState('');
  const [nfts, setNfts] = useState([]);
  const [getCardList, setGetCardList] = useState(null);

  // 클라이언트사이드에서 동적으로 getCardList 함수 로드  (window 어쩌구 오류 해결)
  useEffect(() => {
    const loadGetCardList = async () => {
      const { getCardList: getCards } = await import('klip-sdk');
      setGetCardList(() => getCards);
    };
    loadGetCardList();
  }, []);

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

  // getcardlist 이용해서 가지고있는 nft 검색하는 기능 contract 주소에 대해서는 질문 예정
  const fetchNfts = async () => {
    if (!getCardList) {
      // console.error('getCardList 함수가 로드되지 않았습니다.');
      return;
    }

    try {
      const response = await getCardList({
        contract: '0xb26e09db6656b998d2913f13870e06c151c37900',
        eoa: address,
        cursor: '',
      });

      if (response && response.cards) {
        setNfts(response.cards);
        // console.log(nfts);
      } else {
        // console.error('No NFTs found.');
      }
    } catch (error) {
      // console.error('Error fetching NFTs:', error);
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
      <button onClick={getResult}>지갑 주소 확인</button>
      {address && (
        <div>
          <p>지갑 주소: {address}</p>
          <button onClick={fetchNfts}>NFT 목록 조회</button>
          {nfts.length > 0 && (
            <div>
              <h2>NFTs</h2>
              <ul>
                {nfts.map((nft, index) => (
                  <li key={index}>{nft.card_id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

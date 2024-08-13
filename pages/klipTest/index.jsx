import axios from "node_modules/axios/index";
import { useState } from "react";

export default function Home(){
  const [qrValue, setQrvalue] = useState('');
  const [address, setAddress] = useState('');
  const [requestKey, setRequestKey] = useState('');
  const [nfts, setNfts] = useState([]);
  const [error, setError] = useState('');

  
  //Klip API로 qr 코드 요청
  const requestKlip = async () => {
    try {
      const res = await axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare',{
        bapp: {
          name: 'klaytn_ticketing'
        },
        type: 'auth',
      });

      const {request_key} = res.data;
      setRequestKey(request_key);
      setQrvalue(`https://klipwallet.com/?target=/a2a?request_key=${request_key}`);
    } catch (error) {
      console.error('Klip 요청 실패', error);
    }
  };
  
  // Klip API로 지갑 주소 조회
  const getResult = async () =>{
    try{
      const res = await axios.get(
        `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
      );

      
      if(res.data.result){
        const userAddress = res.data.result.klaytn_address;
        setAddress(userAddress);
      } else {
        console.log('보류 중...');
      }      
    } catch (error) {
      console.error('Klip 결과 체크 실패', error);
    }
  };
  
  const fetchNFTs = async (address) =>{
    try {
      const res = await axios.get(`/api/klipApi/fetchNFTs?address=${address}`);
      setNfts(res.data);
    } catch (error) {
      console.error('NFT 패치 실패', error);
    }
  };

  return(
    <div>
      <h1>Klip 지갑 주소 조회</h1>
      <button onClick={requestKlip}>Klip 지갑 연결</button><br/>
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
        </div>
      )}
    </div>
  );
}
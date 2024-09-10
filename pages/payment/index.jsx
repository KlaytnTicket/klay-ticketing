import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useEffect, useState } from 'react';

// ------  SDK 초기화 ------
// TODO: clientKey는 개발자센터의 API 개별 연동 키 > 결제창 연동에 사용하려할 MID > 클라이언트 키로 바꾸세요.
// TODO: server.js 의 secretKey 또한 결제위젯 연동 키가 아닌 API 개별 연동 키의 시크릿 키로 변경해야 합니다.
// TODO: 구매자의 고유 아이디를 불러와서 customerKey로 설정하세요. 이메일・전화번호와 같이 유추가 가능한 값은 안전하지 않습니다.
// @docs https://docs.tosspayments.com/sdk/v2/js#토스페이먼츠-초기화
function generateRandomString() {
  return Buffer.from(Math.random().toString()).toString('base64').slice(0, 20);
}
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
const customerKey = generateRandomString();

export default function PaymentCheckoutPage() {
  const [payment, setPayment] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('CARD');

  const [point, setPoint] = useState(10); // 기본값을 10로 설정

  function selectPaymentMethod(method) {
    setSelectedPaymentMethod(method);
  }

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);

        // 회원 결제
        // @docs https://docs.tosspayments.com/sdk/v2/js#tosspaymentspayment
        const tossPayment = tossPayments.payment({
          customerKey,
        });
        // 비회원 결제
        // const payment = tossPayments.payment({ customerKey: ANONYMOUS });
        setPayment(tossPayment);
      } catch (error) {
        /* 빈 내용 */
      }
    }

    fetchPayment();
  }, []);

  // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
  async function requestPayment() {
    // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
    // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
    const amount = {
      currency: 'KRW',
      value: point,
    };

    switch (selectedPaymentMethod) {
    case 'CARD':
      await payment.requestPayment({
        method: 'CARD', // 카드 및 간편결제
        amount,
        orderId: generateRandomString(), // 고유 주문번호
        orderName: '토스 티셔츠 외 2건',
        successUrl: `${window.location.origin}/payment/success`, // 결제 요청이 성공하면 리다이렉트되는 URL
        failUrl: `${window.location.origin}/fail`, // 결제 요청이 실패하면 리다이렉트되는 URL
        customerEmail: 'customer123@gmail.com',
        customerName: '김토스',
        customerMobilePhone: '01012341234',
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
      break;
    default:
      break;
    }
  }

  async function requestBillingAuth() {
    await payment.requestBillingAuth({
      method: 'CARD', // 자동결제(빌링)은 카드만 지원합니다
      successUrl: `${window.location.origin}/payment/billing`, // 요청이 성공하면 리다이렉트되는 URL
      failUrl: `${window.location.origin}/fail`, // 요청이 실패하면 리다이렉트되는 URL
      customerEmail: 'customer123@gmail.com',
      customerName: '김토스',
    });
  }

  return (
    <div className="wrapper ml-4 mt-4">
      <div className="box_section">
        <h1 className="font-bold">일반 결제</h1>
        <input type="number" value={point} onChange={(e) => setPoint(Number(e.target.value))} className="mr-4 mt-2 rounded-md border-2 border-slate-300 py-2 pl-2" /> 포인트
        <p className="ml-2 mt-2 text-xs font-bold italic">1포인트에 1원 입니다.</p>
        <br />
        <div id="payment-method" style={{ display: 'flex' }}>
          <p className="mr-2">결제 수단: </p>
          <button
            id="CARD"
            className={`button2 ${selectedPaymentMethod === 'CARD' ? 'active' : ''} rounded-md border-2 border-black px-2`}
            onClick={() => selectPaymentMethod('CARD')}
          >
            카드
          </button>{' '}
          <br />
        </div>{' '}
        <br />
        <button className="button rounded-lg border-2 bg-blue-400 px-4 py-2 hover:bg-blue-700" onClick={() => requestPayment()}>
          결제하기
        </button>
      </div>{' '}
      <br />
      <div className="h-[1px] w-20 bg-black"></div>
      <div className="box_section mt-4">
        <h1 className="font-bold">정기 결제</h1>
        <button className="button mt-4 rounded-lg border-2 bg-blue-400 p-2 hover:bg-blue-700" onClick={() => requestBillingAuth()}>
          빌링키 발급
        </button>
      </div>
    </div>
  );
}

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  const [user, setUser] = useState(null); // 로그인 유저 가져오기
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);
  }, []);

  const updatePaymentInDB = async (paymentKey, orderId, amount, customerKey) => {
    try {
      const response = await fetch('/api/payment/chargepoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount,
          customerKey,
          userID: user.userID,
        }),
      });

      if (!response.ok) {
        throw new Error('결제 정보 업데이트 실패');
      }

      // console.log('결제 정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      // console.error('DB 업데이트 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    // URL에서 쿼리 파라미터 가져오기
    const { paymentKey, orderId, amount, customerKey } = router.query;

    if (paymentKey && orderId && amount) {
      // 결제 성공 시 DB 업데이트 API 호출
      updatePaymentInDB(paymentKey, orderId, amount, customerKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query]);

  return (
    <div>
      <h1>결제가 성공적으로 완료되었습니다!</h1>
    </div>
  );
}

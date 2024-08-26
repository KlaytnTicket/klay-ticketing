import { executeQuery } from '@lib/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { paymentKey, orderId, amount, customerKey, userID } = req.body;

    try {
      // 1. USER 테이블의 USER_POINT 업데이트
      const updateUserPointQuery = `
        UPDATE "USER"
        SET "USER_POINT" = "USER_POINT" + ${amount}
        WHERE "USER_ID" = '${userID}'
      `;

      await executeQuery(updateUserPointQuery);

      // 2. POINT 테이블에 새로운 결제 데이터 추가
      const insertPointQuery = `
        INSERT INTO "POINT" ("USER_ID", "PAY_DATE", "PAY_AMOUNT", "PAY_KIND", "PAY_STATUS")
        VALUES ('${userID}', NOW(), ${amount}, 'CARD', true)
      `;

      await executeQuery(insertPointQuery);

      return res.status(200).json({ message: '결제 정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      return res.status(500).json({ message: 'DB 업데이트 중 오류 발생' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

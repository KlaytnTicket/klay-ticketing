// pages/api/update-payment.js

import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { paymentKey, orderId, amount, customerKey, userID } = req.body;

    const client = new Client({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    try {
      await client.connect();

      // 1. USER 테이블의 USER_POINT 업데이트
      const updateUserPointQuery = `
        UPDATE "USER"
        SET "USER_POINT" = "USER_POINT" + $1
        WHERE "USER_ID" = $2
      `;
      const updateUserPointValues = [amount, userID];
      await client.query(updateUserPointQuery, updateUserPointValues);

      // 2. POINT 테이블에 새로운 결제 데이터 추가
      const insertPointQuery = `
        INSERT INTO "POINT" ("USER_ID", "PAY_DATE", "PAY_AMOUNT", "PAY_KIND", "PAY_STATUS")
        VALUES ($1, NOW(), $2, $3, $4)
      `;
      const insertPointValues = [userID, amount, 'CARD', true];
      await client.query(insertPointQuery, insertPointValues);

      await client.end();

      res.status(200).json({ message: '결제 정보가 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      console.error('DB 업데이트 중 오류 발생:', error);
      res.status(500).json({ message: 'DB 업데이트 중 오류 발생' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

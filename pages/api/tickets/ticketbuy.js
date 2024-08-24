import { Client } from 'pg';

async function POST(req, res) {
  const { userID, totalPrice, ticketIDs } = req.body;

  if (!userID || !totalPrice || ticketIDs.length === 0) {
    return res.status(400).json({ message: '필요 정보 누락' });
  }

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    // 트랜잭션 시작
    await client.query('BEGIN');

    const updateUserPoint = `
        UPDATE "USER"
        SET "USER_POINT" = "USER_POINT" - $1
        WHERE "USER_ID" = $2
      `;
    await client.query(updateUserPoint, [totalPrice, userID]);

    const updateTicket = `
        UPDATE "TICKET"
        SET "USER_ID" = $1, "IS_USED" = TRUE
        WHERE "ID" = ANY($2::int[])
      `;
    await client.query(updateTicket, [userID, ticketIDs]);

    // 트랜잭션 커밋
    await client.query('COMMIT');

    return res.status(200).json({ message: '결제 성공적 완료' });
  } catch (error) {
    // 트랜잭션 롤백
    await client.query('ROLLBACK');
    // console.error('DB 쿼리 에러', error);
    return res.status(500).json({ message: '서버 에러' });
  } finally {
    await client.end();
  }
}
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'POST':
    return POST(req, res);
  default:
    return res.status(405).json({
      message: 'Not Support Method',
    });
  }
}

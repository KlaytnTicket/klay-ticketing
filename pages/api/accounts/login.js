import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userPSW } = req.body;

    const client = new Client({
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    try {
      await client.connect();
      const query = `
        SELECT * FROM "USER" 
        WHERE "USER_ID" = $1 
        AND "USER_PSW" = $2 
        AND "ENABLE" = true 
      `;
      const values = [userID, userPSW];
      const result = await client.query(query, values);
      await client.end();

      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.status(200).json({ message: '로그인 성공', user: { userID: user.USER_ID, nickname: user.USER_NICKNAME } });
      } else {
        res.status(401).json({ message: '유효하지 않은 값' });
      }
    } catch (error) {
      // console.error(error);
      res.status(500).json({ message: '내부 서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, newPSW } = req.body;

    if (!userID) {
      res.status(400).json({ message: '아이디를 입력하세요.' });
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

      const checkUser = await client.query('SELECT * FROM "USER" WHERE "USER_ID" = $1', [userID]);

      if (checkUser.rows.length === 0) {
        await client.end();
        res.status(404).json({ message: '유령이다.' });
      }

      if (newPSW) {
        await client.query('UPDATE "USER" SET "USER_PSW" = $1 WHERE "USER_ID" = $2', [newPSW, userID]);
        await client.end();

        res.status(200).json({ message: '비밀번호 변경 성공' });
      }

      await client.end();
      res.status(200).json({ message: '아이디 확인 성공' });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      res.status(500).json({ message: '서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

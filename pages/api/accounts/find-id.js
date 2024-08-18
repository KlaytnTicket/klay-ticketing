import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userNICKNAME, userEMAIL } = req.body;

    if (!userNICKNAME || !userEMAIL) {
      res.status(400).json({ message: '닉네임과 이메일을 모두 입력하세요.' });
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

      const query = 'SELECT "USER_ID" FROM "USER" WHERE "USER_NICKNAME" = $1 AND "USER_EMAIL" = $2';
      const values = [userNICKNAME, userEMAIL];
      const result = await client.query(query, values);

      await client.end();

      if (result.rows.length === 0) {
        // console.error('사용자를 찾을 수 없음');
        res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      res.status(200).json({ userID: result.rows[0].USER_ID });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      res.status(500).json({ message: '서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

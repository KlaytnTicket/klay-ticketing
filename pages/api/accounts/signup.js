import { Client } from 'pg';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userPSW, userNICKNAME, userWALLET, userEMAIL } = req.body;

    if (!userID || !userPSW || !userNICKNAME || !userWALLET || !userEMAIL) {
      // console.error('요구 필드 미스');
      res.status(400).json({ message: '정보를 모두 입력하세요.' });
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

      // 계정 존재 여부 확인
      const checkQuery = 'SELECT * FROM "USER" WHERE "USER_ID" = $1';
      const checkUser = await client.query(checkQuery, [userID]);

      if (checkUser.rows.length > 0) {
        // console.error('이미 존재하는 아이디');
        await client.end();
        res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
      }

      const insertUser = `
        INSERT INTO "USER" ("USER_ID", "USER_PSW", "USER_NICKNAME", "USER_WALLET", "USER_EMAIL", "USER_POINT", "ENABLE")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;
      const values = [userID, userPSW, userNICKNAME, userWALLET, userEMAIL, 0, true];

      await client.query(insertUser, values);
      await client.end();

      // console.log('회원가입 성공');
      res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      res.status(500).json({ message: '서버 에러' });
    }
  } else {
    // console.error('메서드 오류');
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

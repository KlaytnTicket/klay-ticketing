import { executeQuery } from '@lib/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userPSW, userNICKNAME, userWALLET, userEMAIL } = req.body;

    if (!userID || !userPSW || !userNICKNAME || !userWALLET || !userEMAIL) {
      // console.error('요구 필드 미스');
      return res.status(400).json({ message: '정보를 모두 입력하세요.' });
    }

    try {
      // 계정 존재 여부 확인
      const checkUser = await executeQuery(`SELECT * FROM "USER" WHERE "USER_ID" = '${userID}'`);

      if (checkUser.rows.length > 0) {
        // console.error('이미 존재하는 아이디');
        return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
      }

      await executeQuery(
        'INSERT INTO "USER" ("USER_ID", "USER_PSW", "USER_NICKNAME", "USER_WALLET", "USER_EMAIL", "USER_POINT", "ENABLE") ',
        `VALUES('${userID}', '${userPSW}', '${userNICKNAME}', '${userWALLET}', '${userEMAIL}', 0, true)`,
      );
      // console.log('회원가입 성공');
      return res.status(201).json({ message: '회원가입 성공' });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      return res.status(500).json({ message: '서버 에러' });
    }
  } else {
    // console.error('메서드 오류');
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

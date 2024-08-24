import { executeQuery } from '@lib/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, newPSW } = req.body;

    if (!userID) {
      return res.status(400).json({ message: '아이디를 입력하세요.' });
    }
    try {
      const checkUser = await executeQuery(`SELECT * FROM "USER" WHERE "USER_ID" = '${userID}'`);

      if (checkUser.length === 0) {
        return res.status(404).json({ message: '유령이다.' });
      }

      if (newPSW) {
        await executeQuery(`UPDATE "USER" SET "USER_PSW" = '${newPSW}' WHERE "USER_ID = '${userID}'`);

        return res.status(200).json({ message: '비밀번호 변경 성공' });
      }

      return res.status(200).json({ message: '아이디 확인 성공' });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      return res.status(500).json({ message: '서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

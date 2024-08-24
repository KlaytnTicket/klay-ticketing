import { executeQuery } from '@lib/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userNICKNAME, userEMAIL } = req.body;

    if (!userNICKNAME || !userEMAIL) {
      return res.status(400).json({ message: '닉네임과 이메일을 모두 입력하세요.' });
    }
    try {
      const result = await executeQuery(`SELECT "USER_ID" FROM "USER" WHERE "USER_NICKNAME" = '${userNICKNAME}' AND "USER_EMAIL" = '${userEMAIL}'`);

      if (result.length === 0) {
        // console.error('사용자를 찾을 수 없음');
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }

      return res.status(200).json({ userID: result[0].USER_ID });
    } catch (error) {
      // console.error('DB 쿼리 에러', error);
      return res.status(500).json({ message: '서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

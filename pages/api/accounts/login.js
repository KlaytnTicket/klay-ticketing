import { executeQuery } from '@lib/postgres';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, userPSW } = req.body;

    try {
      const result = await executeQuery(`SELECT * FROM "USER" WHERE "USER_ID" = '${userID}' AND "USER_PSW" = '${userPSW}' AND "ENABLE" = true`);

      if (result.length > 0) {
        const user = result[0];
        return res.status(200).json({ message: '로그인 성공', user: { userID: user.USER_ID, nickname: user.USER_NICKNAME } });
      }
      return res.status(401).json({ message: '유효하지 않은 값' });
    } catch (error) {
      // console.error(error);
      return res.status(500).json({ message: '내부 서버 에러' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`메서드 ${req.method}는 허용되지 않음`);
  }
}

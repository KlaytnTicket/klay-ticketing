import { executeQuery } from '@lib/postgres';

async function POST(req, res) {
  const b = req.body;
  try {
    await executeQuery(`UPDATE "USER" SET "USER_NICKNAME" = '${b.USER_NICKNAME}', "USER_WALLET" = '${b.USER_WALLET}' WHERE "USER_ID" = '${b.USER_ID}'`);
    res.status(200).json({ message: '회원정보가 수정되었습니다.' });
  } catch (error) {
    res.status(500).json({ error });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'POST':
    await POST(req, res);
    break;
  default:
    res.status(405).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}

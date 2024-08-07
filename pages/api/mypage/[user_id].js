import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { user_id } = req.query;
  const result = await executeQuery(`SELECT * FROM public."USER" WHERE "USER_ID" = '${user_id}'`);
  res.status(200).json({ result });
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    await GET(req, res);
    break;
  default:
    res.status(405).json({
      ok: false,
      message: 'Not Support Method',
    });
  }
}

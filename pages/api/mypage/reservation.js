import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { user_id } = req.query;
  try {
    const r = await executeQuery(
      `SELECT * FROM "TICKET" AS t JOIN "EVENT" AS e ON t."ID" = e."ID" WHERE "USER_ID" = '${user_id}'`,
    );
    res.status(200).json({ r });
  } catch (error) {
    res.status(500).json({ error });
  }
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

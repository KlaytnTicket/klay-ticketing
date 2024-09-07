import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { user_id } = req.query;
  try {
    const r = await executeQuery(`SELECT * FROM "TICKET" AS t JOIN "EVENT" AS e ON t."EVENT_ID" = e."ID" WHERE "USER_ID" = '${user_id}'`);
    return res.status(200).json({ r });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
  case 'GET':
    return GET(req, res);
  default:
    return res.status(405).json({
      message: 'Not Support Method',
    });
  }
}

import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { userID } = req.query;

  try {
    const result = [];
    if (userID) {
      const r = await executeQuery(`SELECT "USER_POINT" FROM "USER" WHERE "USER_ID" = '${userID}'`);
      result.push(r[0]);
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    // console.error('Database query error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
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

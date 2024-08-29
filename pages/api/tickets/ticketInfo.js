import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { floor, event_pk } = req.query;

  try {
    const ticketInfoRows = [];
    if (event_pk) {
      const result = await executeQuery(`SELECT * FROM "EVENT" WHERE "ID" = '${String(event_pk)}'`);
      ticketInfoRows.push(result[0]);
    }

    const ticketsRows = [];
    if (floor) {
      const result = await executeQuery(`SELECT * FROM "TICKET" WHERE "SEAT_FLOOR" = ${Number(floor)}`);
      ticketsRows.push(result);
    }

    return res.status(200).json({
      ticketInfo: ticketInfoRows[0],
      tickets: ticketsRows.flat(),
    });
  } catch (error) {
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

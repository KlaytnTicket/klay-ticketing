import { executeQuery } from '@lib/postgres';

async function GET(req, res) {
  const { floor, event_pk, ticket_time } = req.query;

  try {
    const ticketInfoRows = [];
    if (event_pk && ticket_time) {
      const result = await executeQuery(
        `SELECT "NFT_NAME", "TICKET_DATE", "TICKET_TIME", "PLACE" FROM "TICKET" WHERE "EVENT_ID" = '${String(event_pk)}' AND "TICKET_TIME" = '${String(ticket_time)}'`,
      );
      ticketInfoRows.push(result);
    }

    const ticketsRows = [];
    if (floor) {
      const result = await executeQuery(`SELECT * FROM "TICKET" WHERE "SEAT_FLOOR" = ${Number(floor)}`);
      ticketsRows.push(result);
    }

    return res.status(200).json({
      ticketInfo: ticketInfoRows[0],
      tickets: ticketsRows,
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

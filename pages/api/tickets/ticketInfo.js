import { Client } from 'pg';

export default async function handler(req, res) {
  const { floor, event_pk, ticket_time } = req.query;

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();

    const ticketInfoQuery = `
      SELECT "TICKET_NAME", "TICKET_DATE", "TICKET_TIME", "TICKET_PLACE" 
      FROM "TICKET" 
      WHERE "EVENT_PK" = $1 AND "TICKET_TIME" = $2
    `;
    const ticketParams = [event_pk, ticket_time];

    const ticketInfoRows = await client.query(ticketInfoQuery, ticketParams);

    const ticketsRows = await client.query('SELECT * FROM "TICKET" WHERE "TICKET_FLOOR" = $1', [floor]);

    await client.end();

    res.status(200).json({
      ticketInfo: ticketInfoRows.rows[0],
      tickets: ticketsRows.rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

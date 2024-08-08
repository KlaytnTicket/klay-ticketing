import { Client } from 'pg';

export default async function handler(req, res) {
  const { floor } = req.body;
  //query 쓰면 안 됨

  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    const query = `
    SELECT * FROM "USER" `;
    const result = await client.query(query);
    await client.end();

    if (result.rows.length > 0) {
      const user = result.rows[0];
      res.status(200).json({ message: '로그인 성공', user });
    } else {
      res.status(401).json({ message: '유효하지 않은 값' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '내부 서버 에러' });
  }
}
/*try {
    await client.connect();

    const ticketInfoRows = await client.query('SELECT "TICKET_NAME", "TICKET_DATE", "TICKET_TIME", "TICKET_PLACE" FROM "TICKET" LIMIT 1');
    const ticketsRows = await client.query('SELECT * FROM "TICKET"');

    await client.end();

    res.status(200).json({
      ticketInfo: ticketInfoRows[0],
      tickets: ticketsRows,
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }*/

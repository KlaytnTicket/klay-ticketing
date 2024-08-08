import { Client } from 'pg';

export default async function handler(req, res) {
  const client = new Client({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await client.connect();
    const [rows] = await client.query('SELECT "USER_POINT" FROM "USER" LIMIT 1');
    await client.end();

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

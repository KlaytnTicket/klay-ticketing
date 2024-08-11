import pg from 'pg';

const Config = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PW,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

export async function executeTransaction(queries) {
  const pool = new pg.Pool(Config);
  const tx = await pool.connect();
  try {
    await tx.query('BEGIN');
    const result = [];
    queries.forEach(async (query) => {
      const res = await tx.query(query);
      result.push(res.rows);
    });
    await tx.query('COMMIT');
    await tx.release();
    await pool.end();
    return result;
  } catch (error) {
    await tx.query('ROLLBACK');
    await tx.release();
    await pool.end();
    return error.message;
  }
}

export async function executeQuery(query) {
  const client = new pg.Client(Config);
  try {
    await client.connect();
    const result = await client.query(query);
    await client.end();
    return result.rows;
  } catch (error) {
    await client.end();
    return error.message;
  }
}

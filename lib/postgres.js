import pg from 'pg';

const config = {
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PW,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

const pool = new pg.Pool(config);

export async function executeTransaction(args) {
  const client = await pool.connect();
  async function tx(...query) {
    const q = query.join('');
    const res = await client.query(q);
    return res.rows;
  }
  try {
    await client.query('BEGIN');
    if (Array.isArray(args)) {
      const result = await Promise.all(
        args.map(async (query) => {
          let q = new Array(query);
          q = query.join('');
          const res = await client.query(q);
          return res.rows;
        }),
      );
      await client.query('COMMIT');
      await client.release();
      return result;
    }
    if (typeof args === 'function') {
      const result = await args(tx);
      await client.query('COMMIT');
      await client.release();
      return result;
    }
    return 'fail to execute transaction';
  } catch (error) {
    await client.query('ROLLBACK');
    await client.release();
    return error.message;
  }
}

export async function executeQuery(...query) {
  const q = query.join('');
  try {
    const result = await pool.query(q);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

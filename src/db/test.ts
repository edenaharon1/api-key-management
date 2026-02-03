import { pool } from './index';

async function test() {
  const res = await pool.query('SELECT NOW()');
  console.log(res.rows);
  process.exit(0);
}

test();

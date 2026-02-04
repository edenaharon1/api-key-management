import { pool } from './index';
import fs from 'fs';
import path from 'path';

async function setupDB() {
  try {
    const filePath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await pool.end();
  }
}

setupDB();//this file is for running INIT.sql according to the code

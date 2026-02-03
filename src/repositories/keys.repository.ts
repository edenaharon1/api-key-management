import { pool } from '../db';

export interface ApiKeyRecord {
  id: string;
  account_id: string;
  name: string;
  prefix: string;
  secret_hash: string;
  created_at: Date;
  revoked_at: Date | null;
}

export const KeysRepository = {
  async create(key: Omit<ApiKeyRecord, 'id' | 'created_at' | 'revoked_at'>) {
    const result = await pool.query(
      `INSERT INTO api_keys (account_id, name, prefix, secret_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [key.account_id, key.name, key.prefix, key.secret_hash]
    );
    return result.rows[0];
  },

  async list(accountId: string) {
    const result = await pool.query(
      `SELECT id, account_id, name, prefix, created_at, revoked_at
       FROM api_keys
       WHERE account_id = $1
       ORDER BY created_at DESC`,
      [accountId]
    );
    return result.rows;
  },

  async findById(id: string) {
    const result = await pool.query(
      `SELECT * FROM api_keys WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  },

  async updateRevoked(id: string, revokedAt: Date) {
    const result = await pool.query(
      `UPDATE api_keys SET revoked_at = $1 WHERE id = $2 RETURNING *`,
      [revokedAt, id]
    );
    return result.rows[0];
  },

  async findByPrefix(prefix: string) {
    const result = await pool.query(
      `SELECT * FROM api_keys WHERE prefix = $1`,
      [prefix]
    );
    return result.rows[0];
  }
};

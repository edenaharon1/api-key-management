import { KeysRepository, ApiKeyRecord } from '../repositories/keys.repository';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

function generateRandomString(length: number) {
  return randomBytes(length).toString('base64url').slice(0, length);
}

export const KeysService = {
  async create(accountId: string, name: string) {
    const prefix = generateRandomString(6);
    const secret = generateRandomString(24);
    const secretHash = await bcrypt.hash(secret, 10);

    const record = await KeysRepository.create({
      account_id: accountId,
      name,
      prefix,
      secret_hash: secretHash
    });

    // מחזירים את המידע + apiKey מלא רק כאן
    return {
      id: record.id,
      account_id: record.account_id,
      name: record.name,
      prefix: record.prefix,
      created_at: record.created_at,
      revoked_at: record.revoked_at,
      apiKey: `${prefix}.${secret}`
    };
  },

  async list(accountId: string) {
    return KeysRepository.list(accountId);
  }
};

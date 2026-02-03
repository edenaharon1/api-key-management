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
  },

  async revoke(id: string) {
  const existingKey = await KeysRepository.findById(id);
  if (!existingKey) return null;

  if (existingKey.revoked_at) return existingKey;

  const revokedAt = new Date();
  const updatedKey = await KeysRepository.updateRevoked(id, revokedAt);
  return updatedKey;
},

  async verify(apiKey: string) {
  const [prefix, secret] = apiKey.split('.');
  if (!prefix || !secret) return null;

  const keyRecord = await KeysRepository.findByPrefix(prefix);
  if (!keyRecord) return null;
  if (keyRecord.revoked_at) return null;

  const match = await bcrypt.compare(secret, keyRecord.secret_hash);
  if (!match) return null;

  return {
    accountId: keyRecord.account_id,
    keyId: keyRecord.id
  };
}


};



import { KeysService } from '../services/keys.service';

describe('API Key Endpoints (E2E)', () => {
  const accountId = 'test-account-e2e';

  let createdKey: ReturnType<typeof KeysService.create> extends Promise<infer R> ? R : any;

  it('should create a new API key', async () => {
    createdKey = await KeysService.create(accountId, 'E2E Test Key');

    expect(createdKey).toHaveProperty('id');
    expect(createdKey).toHaveProperty('apiKey');
    expect(createdKey.account_id).toBe(accountId);
  });

  it('should verify the created API key', async () => {
    const verification = await KeysService.verify(createdKey.apiKey);
    expect(verification).not.toBeNull();
    if (verification) {
      expect(verification.accountId).toBe(accountId);
      expect(verification.keyId).toBe(createdKey.id);
    }
  });

it('should list keys for the account', async () => {
  const keys = await KeysService.list(accountId);

  expect(keys.length).toBeGreaterThanOrEqual(1);
  expect(keys[0]).toHaveProperty('id');
  expect(keys[0]).toHaveProperty('created_at');

  // בדיקה שהמערך ממויין בסדר יורד לפי created_at
  for (let i = 1; i < keys.length; i++) {
    expect(keys[i - 1].created_at.getTime()).toBeGreaterThanOrEqual(keys[i].created_at.getTime());
  }
});


it('should revoke the key and not return secretHash', async () => {
  // קריאה ראשונה ל-revoke
  const revoked = await KeysService.revoke(createdKey.id, accountId);

  expect(revoked).not.toBeNull();
  expect(revoked.revoked_at).toBeTruthy();

  // בדיקה שה-secretHash לא מוחזר ל-client
  expect(revoked).not.toHaveProperty('secretHash');

  // בדיקה idempotency: קריאה נוספת ל-revoke לא משנה דבר
  const revokedAgain = await KeysService.revoke(createdKey.id, accountId);
  expect(revokedAgain.revoked_at).toEqual(revoked.revoked_at);
  expect(revokedAgain).not.toHaveProperty('secretHash');
});

it('should fail verification for revoked key', async () => {
  const verificationAfterRevoke = await KeysService.verify(createdKey.apiKey);
  expect(verificationAfterRevoke).toBeNull();
});
});

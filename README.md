# API Key Management Service

Backend service in **Node.js + Express + TypeScript + Postgres**.  
Manages API keys for accounts: **create, list, revoke, verify**.

---

## Setup

1. **Clone repository**  
git clone https://github.com/edenaharon1/api-key-management.git  
cd api-key-management

2. **Install dependencies**  
npm install

3. **Start Postgres and server via Docker**  
docker-compose up -d

4. **Initialize database**  
docker exec -i api-key-db psql -U postgres -d api_key_db < ./src/db/init.sql

5. **Start server**  
npm run dev  
Server runs on http://localhost:3000

---

## Endpoints

### Create Key
POST /accounts/:accountId/keys  
Body: { "name": "Prod key" }  
Response 201: key metadata + apiKey (full key only once)  
Example:  
curl -X POST http://localhost:3000/accounts/test-account/keys -H "Content-Type: application/json" -d '{"name":"My Prod Key"}'

### List Keys
GET /accounts/:accountId/keys  
Response 200: list of key metadata (id, prefix, name, created_at, revoked_at)  
Sorted by created_at descending  
Example:  
curl http://localhost:3000/accounts/test-account/keys

### Revoke Key
POST /accounts/:accountId/keys/:id/revoke  
Response 200: updated key metadata (idempotent)  
Example:  
curl -X POST http://localhost:3000/accounts/test-account/keys/<key-id>/revoke

### Verify Key
GET /auth/verify  
Header: x-api-key: <prefix.secret>  
Response 200: { accountId, keyId } if valid  
Response 401: if invalid or revoked  
Example:  
curl -H "x-api-key: <prefix.secret>" http://localhost:3000/auth/verify

---

## Notes
- Secrets are stored **hashed with bcrypt**, never in plaintext.  
- The full API key is returned **only once during creation**.  
- Code is structured with clear separation: **Controllers → Services → Repository → DB**.

## Next steps

- Additional input validation:
  - Ensure `accountId` exists before creating a key.
  - Prevent duplicate key names per account.
- Add a PATCH endpoint to renew a key or update its permissions.
- Implement expiration for API keys.
- Implement rate limiting to prevent abuse.

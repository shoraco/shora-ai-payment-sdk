# Usage notes

## Base URL and environments
- The SDK resolves API base URL from `config.baseUrl` first, then environment variable `SHORA_API_BASE_URL`, and finally an environment-specific default.
- Defaults:
 - `environment: 'sandbox'` → `https://shora-core.onrender.com`
 - `environment: 'staging'` → `https://shora-core.onrender.com`
 - `environment: 'production'` → `https://api.shora.cloud`
- Override the base URL via `config.baseUrl` or `SHORA_API_BASE_URL` if your deployment differs from these defaults.

## Sandbox and CI
- In CI set `SHORA_API_BASE_URL` and test API keys as env vars.

## Audit logging
- Enable audit logs using `enableAuditLogging: true` and provide `auditLogEndpoint` if you want the SDK to POST audit entries to your endpoint.
- Use `sdk.setRequestContext({ ip, userAgent })` before calling SDK methods from server request handlers to capture realistic IP/UA in audit logs.

## Idempotency for payment sessions
- `createPaymentSession(request, { idempotencyKey })` supports sending `Idempotency-Key` header (if backend supports it).

## Tests
- Run `npm test` for unit tests. Integration tests should use sandbox/staging baseUrl and test API keys.

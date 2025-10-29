import { createSecurityEnhancement, generateEncryptionKey } from '../src/security_enhance';

describe('SecurityEnhancement encrypt/decrypt', () => {
  test('encrypts and decrypts JSON payload with colons', () => {
    const key = generateEncryptionKey();
    const sec = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-test',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    const payload = { foo: 'value:with:colons', num: 42 };
    const tokenStr = JSON.stringify(payload);
    const encrypted = sec.encryptToken(tokenStr);
    expect(encrypted).toHaveProperty('encrypted');
    const decrypted = sec.decryptToken(encrypted);
    expect(decrypted).not.toBeNull();
    expect(JSON.parse(decrypted as string)).toEqual(payload);
  });
});

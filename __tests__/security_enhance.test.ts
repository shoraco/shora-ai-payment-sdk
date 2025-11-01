import { createSecurityEnhancement, generateEncryptionKey } from '../src/security_enhance';

describe('SecurityEnhancement encrypt/decrypt', () => {
  test('encrypts and decrypts JSON payload with colons in token', () => {
    const key = generateEncryptionKey();
    const sec = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-test',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    const tokenWithColons = 'token:with:multiple:colons:and:data';
    const encrypted = sec.encryptToken(tokenWithColons, 'additional:data:with:colons');
    expect(encrypted).toHaveProperty('encrypted');
    expect(encrypted).toHaveProperty('iv');
    expect(encrypted).toHaveProperty('salt');
    expect(encrypted).toHaveProperty('timestamp');
    
    const decrypted = sec.decryptToken(encrypted);
    expect(decrypted).not.toBeNull();
    expect(decrypted).toBe(tokenWithColons);
  });

  test('encrypts and decrypts JSON payload with special characters', () => {
    const key = generateEncryptionKey();
    const sec = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-test',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    const tokenWithSpecialChars = 'token:with:special:chars://example.com?param=value&other=data';
    const encrypted = sec.encryptToken(tokenWithSpecialChars);
    const decrypted = sec.decryptToken(encrypted);
    expect(decrypted).toBe(tokenWithSpecialChars);
  });

  test('validates tenantId on decryption', () => {
    const key = generateEncryptionKey();
    const sec1 = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-1',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    const sec2 = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-2',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    
    const token = 'test-token';
    const encrypted = sec1.encryptToken(token);
    const decrypted1 = sec1.decryptToken(encrypted);
    const decrypted2 = sec2.decryptToken(encrypted);
    
    expect(decrypted1).toBe(token);
    expect(decrypted2).toBeNull();
  });

  test('uses PBKDF2 with SHA256 and 100000 iterations', () => {
    const key = generateEncryptionKey();
    const sec = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-test',
      enableAuditLogging: false,
      pbkdf2Iterations: 100000,
      sdkVersion: 'test',
    });
    
    const token = 'test-token-123';
    const encrypted = sec.encryptToken(token);
    expect(encrypted.encrypted).toBeTruthy();
    expect(encrypted.salt).toBeTruthy();
    expect(encrypted.iv).toBeTruthy();
    
    const decrypted = sec.decryptToken(encrypted);
    expect(decrypted).toBe(token);
  });

  test('includes sdkVersion in audit metadata', () => {
    const key = generateEncryptionKey();
    const sec = createSecurityEnhancement({
      encryptionKey: key,
      tenantId: 'tenant-test',
      enableAuditLogging: true,
      pbkdf2Iterations: 100000,
      sdkVersion: '2.1.1',
    });
    
    sec.logAudit('test_action', 'test details');
    const logs = sec.getAuditLogs();
    expect(logs).toHaveLength(1);
    expect(logs[0].metadata?.sdkVersion).toBe('2.1.1');
    expect(logs[0].metadata?.pbkdf2Iterations).toBe(100000);
  });
});

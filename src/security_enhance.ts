import CryptoJS from 'crypto-js';
import axios from 'axios';

export interface AuditLogEntry {
  timestamp: string;
  tenantId: string;
  transactionId?: string;
  action: string;
  userId?: string;
  agentId?: string;
  amount?: number;
  currency?: string;
  status: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export interface EncryptedToken {
  encrypted: string;
  iv: string;
  salt: string;
  timestamp: number;
}

export interface SecurityConfig {
  encryptionKey: string;
  auditLogEndpoint?: string;
  enableAuditLogging?: boolean;
  tenantId: string;
  sdkVersion?: string;
  pbkdf2Iterations?: number;
}

export class SecurityEnhancement {
  private config: SecurityConfig;
  private auditLogs: AuditLogEntry[] = [];
  private requestContext: { ip?: string; userAgent?: string } | null = null;

  constructor(config: SecurityConfig) {
    this.config = { pbkdf2Iterations: 100000, ...config };
  }

  setRequestContext(ctx: { ip?: string; userAgent?: string }) {
    this.requestContext = ctx;
  }

  private getClientIP(): string {
    return this.requestContext?.ip || '127.0.0.1';
  }

  private getUserAgent(): string {
    return this.requestContext?.userAgent || `ShoraAI-PaymentSDK/${this.config.sdkVersion || 'unknown'}`;
  }

  encryptToken(token: string, additionalData?: string): EncryptedToken {
    const salt = CryptoJS.lib.WordArray.random(256 / 8);
    const iv = CryptoJS.lib.WordArray.random(128 / 8);
    const iterations = this.config.pbkdf2Iterations || 100000;
    const key = CryptoJS.PBKDF2(this.config.encryptionKey, salt, {
      keySize: 256 / 32,
      iterations,
      hasher: CryptoJS.algo.SHA256 as any,
    });
    const payload = {
      token,
      additionalData: additionalData || null,
      tenantId: this.config.tenantId,
      ts: Date.now(),
    };
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(payload), key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return {
      encrypted: encrypted.toString(),
      iv: iv.toString(CryptoJS.enc.Hex),
      salt: salt.toString(CryptoJS.enc.Hex),
      timestamp: Date.now(),
    };
  }

  decryptToken(encryptedToken: EncryptedToken): string | null {
    try {
      const salt = CryptoJS.enc.Hex.parse(encryptedToken.salt);
      const iv = CryptoJS.enc.Hex.parse(encryptedToken.iv);
      const iterations = this.config.pbkdf2Iterations || 100000;
      const key = CryptoJS.PBKDF2(this.config.encryptionKey, salt, {
        keySize: 256 / 32,
        iterations,
        hasher: CryptoJS.algo.SHA256 as any,
      });
      const decrypted = CryptoJS.AES.decrypt(encryptedToken.encrypted, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      if (!decryptedString) {
        this.logAudit('decrypt_failed', 'Token decryption failed - invalid data');
        return null;
      }
      const payload = JSON.parse(decryptedString);
      if (!payload || payload.tenantId !== this.config.tenantId) {
        this.logAudit('decrypt_failed', 'Token decryption failed - tenant mismatch');
        return null;
      }
      this.logAudit('decrypt_success', 'Token decrypted successfully');
      return payload.token;
    } catch (error) {
      this.logAudit('decrypt_error', 'Token decryption error: ' + String(error));
      return null;
    }
  }

  logAudit(
    action: string,
    details: string,
    transactionId?: string,
    userId?: string,
    agentId?: string,
    amount?: number,
    currency?: string,
    status: 'success' | 'failed' | 'pending' = 'success',
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enableAuditLogging) return;
    const auditEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      tenantId: this.config.tenantId,
      transactionId,
      action,
      userId,
      agentId,
      amount,
      currency,
      status,
      metadata: {
        ...metadata,
        details,
        sdkVersion: this.config.sdkVersion || 'unknown',
        pbkdf2Iterations: this.config.pbkdf2Iterations || 100000,
        environment: process.env.NODE_ENV || 'production',
      },
      ipAddress: this.getClientIP(),
      userAgent: this.getUserAgent(),
    };
    this.auditLogs.push(auditEntry);
    if (this.config.auditLogEndpoint) {
      this.sendAuditLog(auditEntry).catch((error) => {
        console.warn('sendAuditLog failed', error);
      });
    }
  }

  getAuditLogs(startDate?: string, endDate?: string, action?: string): AuditLogEntry[] {
    let filtered = this.auditLogs.filter((log) => log.tenantId === this.config.tenantId);
    if (startDate) {
      const start = new Date(startDate).getTime();
      filtered = filtered.filter((log) => new Date(log.timestamp).getTime() >= start);
    }
    if (endDate) {
      const end = new Date(endDate).getTime();
      filtered = filtered.filter((log) => new Date(log.timestamp).getTime() <= end);
    }
    if (action) {
      filtered = filtered.filter((log) => log.action === action);
    }
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async sendAuditLog(auditEntry: AuditLogEntry): Promise<void> {
    if (!this.config.auditLogEndpoint) return;
    try {
      await axios.post(this.config.auditLogEndpoint, auditEntry, {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.warn('Failed to POST audit log:', error);
    }
  }

  generateSecurePaymentToken(paymentData: { amount: number; currency: string; userId: string; agentId?: string }): EncryptedToken {
    const tokenData = {
      ...paymentData,
      tenantId: this.config.tenantId,
      nonce: CryptoJS.lib.WordArray.random(128 / 8).toString(),
      expires: Date.now() + 30 * 60 * 1000,
    };
    const encrypted = this.encryptToken(JSON.stringify(tokenData));
    this.logAudit(
      'payment_token_generated',
      `Secure payment token generated for ${paymentData.amount} ${paymentData.currency}`,
      undefined,
      paymentData.userId,
      paymentData.agentId,
      paymentData.amount,
      paymentData.currency,
      'success',
      { tokenExpires: new Date(Date.now() + 30 * 60 * 1000).toISOString() }
    );
    return encrypted;
  }

  validatePaymentToken(encryptedToken: EncryptedToken) {
    const decrypted = this.decryptToken(encryptedToken);
    if (!decrypted) {
      this.logAudit('payment_token_validation_failed', 'Token decryption failed');
      return { valid: false, error: 'Invalid token' };
    }
    try {
      const data = JSON.parse(decrypted);
      if (data.expires && Date.now() > data.expires) {
        this.logAudit('payment_token_validation_failed', 'Token expired');
        return { valid: false, error: 'Token expired' };
      }
      if (data.tenantId !== this.config.tenantId) {
        this.logAudit('payment_token_validation_failed', 'Tenant mismatch');
        return { valid: false, error: 'Tenant mismatch' };
      }
      this.logAudit(
        'payment_token_validated',
        'Payment token validated successfully',
        undefined,
        data.userId,
        data.agentId,
        data.amount,
        data.currency
      );
      return { valid: true, data };
    } catch (error) {
      this.logAudit('payment_token_validation_failed', 'Token parsing error: ' + String(error));
      return { valid: false, error: 'Invalid token format' };
    }
  }
}

export function createSecurityEnhancement(config: SecurityConfig) {
  return new SecurityEnhancement(config as any);
}

export function generateEncryptionKey() {
  return CryptoJS.lib.WordArray.random(256 / 8).toString(CryptoJS.enc.Hex);
}

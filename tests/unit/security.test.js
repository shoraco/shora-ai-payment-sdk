/**
 * Unit Tests for Security Manager
 */

const SecurityManager = require('../../src/security');
const assert = require('assert');

describe('SecurityManager', () => {
  let securityManager;

  beforeEach(() => {
    securityManager = new SecurityManager({
      apiKey: 'shora_pro_test123456789',
      secretKey: 'test-secret-key-12345678901234567890123456789012'
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key format', () => {
      const result = securityManager.validateApiKey('shora_pro_test123456789');
      assert.strictEqual(result.valid, true);
      assert.strictEqual(result.tier, 'pro');
    });

    it('should reject invalid API key format', () => {
      assert.throws(() => {
        securityManager.validateApiKey('invalid-key');
      }, /Invalid API key format/);
    });

    it('should reject empty API key', () => {
      assert.throws(() => {
        securityManager.validateApiKey('');
      }, /API key is required/);
    });

    it('should identify different tiers correctly', () => {
      const freeResult = securityManager.validateApiKey('shora_free_test123456789');
      const enterpriseResult = securityManager.validateApiKey('shora_enterprise_test123456789');
      const masterResult = securityManager.validateApiKey('shora_master_test123456789');

      assert.strictEqual(freeResult.tier, 'free');
      assert.strictEqual(enterpriseResult.tier, 'enterprise');
      assert.strictEqual(masterResult.tier, 'master');
    });
  });

  describe('generateToken', () => {
    it('should generate valid JWT token', () => {
      const payload = { agent_id: 'test-agent', user_id: 'test-user' };
      const token = securityManager.generateToken(payload);
      
      assert(typeof token === 'string');
      assert(token.length > 0);
    });

    it('should generate token with custom expiry', () => {
      const payload = { agent_id: 'test-agent' };
      const token = securityManager.generateToken(payload, '2h');
      
      assert(typeof token === 'string');
    });
  });

  describe('verifyToken', () => {
    it('should verify valid token', () => {
      const payload = { agent_id: 'test-agent' };
      const token = securityManager.generateToken(payload);
      const decoded = securityManager.verifyToken(token);
      
      assert.strictEqual(decoded.agent_id, 'test-agent');
    });

    it('should reject invalid token', () => {
      assert.throws(() => {
        securityManager.verifyToken('invalid-token');
      }, /Token verification failed/);
    });
  });

  describe('sanitizeInput', () => {
    it('should sanitize string input', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = securityManager.sanitizeInput(input);
      
      assert.strictEqual(sanitized, 'scriptalert(xss)/script');
    });

    it('should sanitize object input', () => {
      const input = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com'
      };
      const sanitized = securityManager.sanitizeInput(input);
      
      assert.strictEqual(sanitized.name, 'scriptalert(xss)/script');
      assert.strictEqual(sanitized.email, 'test@example.com');
    });
  });

  describe('validatePaymentData', () => {
    it('should validate correct payment data', () => {
      const data = {
        amount: 100.50,
        currency: 'TRY',
        agent_id: 'test-agent-123'
      };
      
      assert.strictEqual(securityManager.validatePaymentData(data), true);
    });

    it('should reject missing required fields', () => {
      const data = {
        amount: 100.50,
        currency: 'TRY'
        // missing agent_id
      };
      
      assert.throws(() => {
        securityManager.validatePaymentData(data);
      }, /Missing required fields/);
    });

    it('should reject invalid amount', () => {
      const data = {
        amount: -100,
        currency: 'TRY',
        agent_id: 'test-agent'
      };
      
      assert.throws(() => {
        securityManager.validatePaymentData(data);
      }, /Amount must be a positive number/);
    });

    it('should reject invalid currency', () => {
      const data = {
        amount: 100,
        currency: 'INVALID',
        agent_id: 'test-agent'
      };
      
      assert.throws(() => {
        securityManager.validatePaymentData(data);
      }, /Invalid currency/);
    });
  });

  describe('generateSignature', () => {
    it('should generate consistent signature', () => {
      const payload = { test: 'data' };
      const secret = 'test-secret';
      
      const sig1 = securityManager.generateSignature(payload, secret);
      const sig2 = securityManager.generateSignature(payload, secret);
      
      assert.strictEqual(sig1, sig2);
    });

    it('should generate different signatures for different payloads', () => {
      const payload1 = { test: 'data1' };
      const payload2 = { test: 'data2' };
      const secret = 'test-secret';
      
      const sig1 = securityManager.generateSignature(payload1, secret);
      const sig2 = securityManager.generateSignature(payload2, secret);
      
      assert.notStrictEqual(sig1, sig2);
    });
  });

  describe('verifySignature', () => {
    it('should verify correct signature', () => {
      const payload = { test: 'data' };
      const secret = 'test-secret';
      const signature = securityManager.generateSignature(payload, secret);
      
      assert.strictEqual(securityManager.verifySignature(payload, signature, secret), true);
    });

    it('should reject incorrect signature', () => {
      const payload = { test: 'data' };
      const secret = 'test-secret';
      const wrongSignature = 'wrong-signature';
      
      assert.strictEqual(securityManager.verifySignature(payload, wrongSignature, secret), false);
    });
  });
});

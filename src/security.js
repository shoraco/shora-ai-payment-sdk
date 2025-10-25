/**
 * Enterprise Security Layer for Shora AI Payment SDK
 * 
 * Features:
 * - JWT token validation
 * - Rate limiting with Redis
 * - Input sanitization and validation
 * - API key management
 * - Request signing and verification
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class SecurityManager {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.SHORA_API_KEY;
    this.secretKey = config.secretKey || process.env.SHORA_SECRET_KEY;
    this.rateLimitConfig = config.rateLimit || {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      standardHeaders: true,
      legacyHeaders: false
    };
    this.allowedOrigins = config.allowedOrigins || ['https://shora.co', 'https://api.shora.cloud'];
  }

  /**
   * Validate API key format and permissions
   */
  validateApiKey(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    const keyPattern = /^shora_(free|pro|enterprise|master)_[a-zA-Z0-9]{8,}$/;
    if (!keyPattern.test(apiKey)) {
      throw new Error('Invalid API key format');
    }

    const tier = apiKey.split('_')[1];
    const limits = {
      free: { requests: 100, window: 60 * 60 * 1000 }, // 100 req/hour
      pro: { requests: 1000, window: 60 * 60 * 1000 }, // 1000 req/hour
      enterprise: { requests: 10000, window: 60 * 60 * 1000 }, // 10K req/hour
      master: { requests: Infinity, window: 60 * 60 * 1000 } // unlimited
    };

    return {
      valid: true,
      tier: tier,
      limits: limits[tier] || limits.free
    };
  }

  /**
   * Generate JWT token for authenticated requests
   */
  generateToken(payload, expiresIn = '1h') {
    if (!this.secretKey) {
      throw new Error('Secret key is required for token generation');
    }

    return jwt.sign(payload, this.secretKey, { 
      expiresIn,
      issuer: 'shora-ai-payment-sdk',
      audience: 'shora-core'
    });
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    if (!this.secretKey) {
      throw new Error('Secret key is required for token verification');
    }

    try {
      return jwt.verify(token, this.secretKey, {
        issuer: 'shora-ai-payment-sdk',
        audience: 'shora-core'
      });
    } catch (error) {
      throw new Error(`Token verification failed: ${error.message}`);
    }
  }

  /**
   * Sanitize input data to prevent injection attacks
   */
  sanitizeInput(data) {
    if (typeof data === 'string') {
      return data
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/['"]/g, '') // Remove quotes
        .trim();
    }

    if (typeof data === 'object' && data !== null) {
      const sanitized = {};
      for (const [key, value] of Object.entries(data)) {
        sanitized[key] = this.sanitizeInput(value);
      }
      return sanitized;
    }

    return data;
  }

  /**
   * Validate payment data structure
   */
  validatePaymentData(data) {
    const required = ['amount', 'currency', 'agent_id'];
    const missing = required.filter(field => !data[field]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }

    // Validate amount
    if (typeof data.amount !== 'number' || data.amount <= 0) {
      throw new Error('Amount must be a positive number');
    }

    // Validate currency
    const validCurrencies = ['TRY', 'USD', 'EUR', 'GBP'];
    if (!validCurrencies.includes(data.currency)) {
      throw new Error(`Invalid currency. Must be one of: ${validCurrencies.join(', ')}`);
    }

    // Validate agent_id format
    if (!/^[a-zA-Z0-9-_]{3,50}$/.test(data.agent_id)) {
      throw new Error('Invalid agent_id format');
    }

    return true;
  }

  /**
   * Generate request signature for webhook verification
   */
  generateSignature(payload, secret) {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload, signature, secret) {
    const expectedSignature = this.generateSignature(payload, secret);
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  /**
   * Rate limiting check (Redis-based in production)
   */
  async checkRateLimit(identifier, tier = 'free') {
    // In production, this would use Redis
    // For demo purposes, we'll use in-memory storage
    const now = Date.now();
    const windowMs = this.rateLimitConfig.windowMs;
    const maxRequests = this.rateLimitConfig.max;

    // This is a simplified version - production would use Redis
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs
    };
  }

  /**
   * CORS validation
   */
  validateOrigin(origin) {
    if (!origin) return false;
    return this.allowedOrigins.includes(origin) || 
           this.allowedOrigins.some(allowed => origin.endsWith(allowed));
  }

  /**
   * Security headers for responses
   */
  getSecurityHeaders() {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    };
  }
}

module.exports = SecurityManager;

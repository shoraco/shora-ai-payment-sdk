/**
 * Enterprise Configuration Manager for Shora AI Payment SDK
 * 
 * Features:
 * - Environment-based configuration
 * - Health checks and monitoring
 * - Circuit breaker pattern
 * - Retry logic with exponential backoff
 * - Logging and metrics
 */

const os = require('os');

class ConfigManager {
  constructor() {
    this.environment = process.env.NODE_ENV || 'development';
    this.config = this.loadConfiguration();
    this.healthStatus = {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: os.cpus().length
    };
  }

  loadConfiguration() {
    const baseConfig = {
      api: {
        baseUrl: process.env.SHORA_BASE_URL || 'https://api.shora.cloud',
        timeout: parseInt(process.env.API_TIMEOUT) || 30000,
        retries: parseInt(process.env.API_RETRIES) || 3,
        retryDelay: parseInt(process.env.API_RETRY_DELAY) || 1000
      },
      security: {
        apiKey: process.env.SHORA_API_KEY,
        secretKey: process.env.SHORA_SECRET_KEY,
        webhookSecret: process.env.SHORA_WEBHOOK_SECRET,
        jwtExpiry: process.env.JWT_EXPIRY || '1h'
      },
      rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
        max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
        skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true'
      },
      monitoring: {
        enabled: process.env.MONITORING_ENABLED === 'true',
        metricsEndpoint: process.env.METRICS_ENDPOINT || '/metrics',
        healthEndpoint: process.env.HEALTH_ENDPOINT || '/health',
        logLevel: process.env.LOG_LEVEL || 'info'
      },
      circuitBreaker: {
        enabled: process.env.CIRCUIT_BREAKER_ENABLED === 'true',
        failureThreshold: parseInt(process.env.CB_FAILURE_THRESHOLD) || 5,
        timeout: parseInt(process.env.CB_TIMEOUT) || 60000,
        resetTimeout: parseInt(process.env.CB_RESET_TIMEOUT) || 30000
      },
      logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'json',
        destination: process.env.LOG_DESTINATION || 'console'
      }
    };

    // Environment-specific overrides
    if (this.environment === 'production') {
      baseConfig.api.timeout = 60000;
      baseConfig.api.retries = 5;
      baseConfig.rateLimit.max = 1000;
      baseConfig.monitoring.enabled = true;
      baseConfig.circuitBreaker.enabled = true;
    }

    return baseConfig;
  }

  /**
   * Get configuration value with fallback
   */
  get(key, defaultValue = null) {
    const keys = key.split('.');
    let value = this.config;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }
    
    return value !== undefined ? value : defaultValue;
  }

  /**
   * Update configuration at runtime
   */
  set(key, value) {
    const keys = key.split('.');
    let config = this.config;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!config[keys[i]]) config[keys[i]] = {};
      config = config[keys[i]];
    }
    
    config[keys[keys.length - 1]] = value;
  }

  /**
   * Validate required configuration
   */
  validate() {
    const required = [
      'security.apiKey',
      'api.baseUrl'
    ];

    const missing = required.filter(key => !this.get(key));
    
    if (missing.length > 0) {
      throw new Error(`Missing required configuration: ${missing.join(', ')}`);
    }

    return true;
  }

  /**
   * Health check endpoint data
   */
  getHealthStatus() {
    this.healthStatus = {
      status: 'healthy',
      timestamp: Date.now(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg()
      },
      environment: this.environment,
      version: process.env.npm_package_version || '1.0.0'
    };

    return this.healthStatus;
  }

  /**
   * Circuit breaker state management
   */
  getCircuitBreakerState() {
    return {
      enabled: this.get('circuitBreaker.enabled'),
      state: 'closed', // closed, open, half-open
      failureCount: 0,
      lastFailureTime: null,
      nextAttempt: null
    };
  }

  /**
   * Get retry configuration
   */
  getRetryConfig() {
    return {
      maxRetries: this.get('api.retries'),
      baseDelay: this.get('api.retryDelay'),
      maxDelay: 30000,
      backoffMultiplier: 2
    };
  }

  /**
   * Get rate limiting configuration
   */
  getRateLimitConfig() {
    return {
      windowMs: this.get('rateLimit.windowMs'),
      max: this.get('rateLimit.max'),
      skipSuccessfulRequests: this.get('rateLimit.skipSuccessfulRequests')
    };
  }

  /**
   * Get monitoring configuration
   */
  getMonitoringConfig() {
    return {
      enabled: this.get('monitoring.enabled'),
      metricsEndpoint: this.get('monitoring.metricsEndpoint'),
      healthEndpoint: this.get('monitoring.healthEndpoint'),
      logLevel: this.get('monitoring.logLevel')
    };
  }

  /**
   * Get security configuration
   */
  getSecurityConfig() {
    return {
      apiKey: this.get('security.apiKey'),
      secretKey: this.get('security.secretKey'),
      webhookSecret: this.get('security.webhookSecret'),
      jwtExpiry: this.get('security.jwtExpiry')
    };
  }

  /**
   * Check if running in production
   */
  isProduction() {
    return this.environment === 'production';
  }

  /**
   * Check if monitoring is enabled
   */
  isMonitoringEnabled() {
    return this.get('monitoring.enabled');
  }

  /**
   * Get API configuration
   */
  getApiConfig() {
    return {
      baseUrl: this.get('api.baseUrl'),
      timeout: this.get('api.timeout'),
      retries: this.get('api.retries'),
      retryDelay: this.get('api.retryDelay')
    };
  }
}

module.exports = ConfigManager;

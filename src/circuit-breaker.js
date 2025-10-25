/**
 * Enterprise Circuit Breaker Implementation
 * 
 * Features:
 * - Circuit breaker pattern
 * - Exponential backoff retry
 * - Health monitoring
 * - Automatic recovery
 */

class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.timeout = options.timeout || 60000;
    this.resetTimeout = options.resetTimeout || 30000;
    this.monitoringPeriod = options.monitoringPeriod || 10000;
    
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = null;
    this.successCount = 0;
    
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      circuitOpened: 0,
      circuitClosed: 0
    };
  }

  /**
   * Execute function with circuit breaker protection
   */
  async execute(fn, ...args) {
    this.metrics.totalRequests++;
    
    // Check if circuit is open
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN - request blocked');
      }
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }

    try {
      const result = await fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  /**
   * Handle successful request
   */
  onSuccess() {
    this.metrics.successfulRequests++;
    this.failureCount = 0;
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 3) { // Require 3 successes to close
        this.state = 'CLOSED';
        this.metrics.circuitClosed++;
        this.successCount = 0;
      }
    }
  }

  /**
   * Handle failed request
   */
  onFailure() {
    this.metrics.failedRequests++;
    this.failureCount++;
    this.lastFailureTime = Date.now();
    
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      this.metrics.circuitOpened++;
    }
  }

  /**
   * Get current state
   */
  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime,
      nextAttempt: this.nextAttempt,
      metrics: this.metrics
    };
  }

  /**
   * Reset circuit breaker
   */
  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.nextAttempt = null;
    this.successCount = 0;
  }

  /**
   * Check if circuit is healthy
   */
  isHealthy() {
    return this.state === 'CLOSED' || 
           (this.state === 'HALF_OPEN' && this.successCount > 0);
  }
}

/**
 * Retry Logic with Exponential Backoff
 */
class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 3;
    this.baseDelay = options.baseDelay || 1000;
    this.maxDelay = options.maxDelay || 30000;
    this.backoffMultiplier = options.backoffMultiplier || 2;
    this.jitter = options.jitter || 0.1;
  }

  /**
   * Execute function with retry logic
   */
  async execute(fn, ...args) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === this.maxRetries) {
          throw error;
        }
        
        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  calculateDelay(attempt) {
    const exponentialDelay = this.baseDelay * Math.pow(this.backoffMultiplier, attempt);
    const jitterAmount = exponentialDelay * this.jitter * Math.random();
    const delay = Math.min(exponentialDelay + jitterAmount, this.maxDelay);
    
    return Math.floor(delay);
  }

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Health Monitor for Circuit Breaker
 */
class HealthMonitor {
  constructor(circuitBreaker, options = {}) {
    this.circuitBreaker = circuitBreaker;
    this.interval = options.interval || 10000;
    this.threshold = options.threshold || 0.5; // 50% failure rate
    this.isRunning = false;
    this.intervalId = null;
  }

  /**
   * Start health monitoring
   */
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.checkHealth();
    }, this.interval);
  }

  /**
   * Stop health monitoring
   */
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Check circuit breaker health
   */
  checkHealth() {
    const state = this.circuitBreaker.getState();
    const failureRate = state.metrics.failedRequests / state.metrics.totalRequests;
    
    if (failureRate > this.threshold && this.circuitBreaker.state === 'CLOSED') {
      console.warn(`High failure rate detected: ${(failureRate * 100).toFixed(2)}%`);
    }
  }
}

module.exports = {
  CircuitBreaker,
  RetryManager,
  HealthMonitor
};

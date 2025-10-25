/**
 * Enterprise Monitoring & Metrics for Shora AI Payment SDK
 * 
 * Features:
 * - Prometheus-compatible metrics
 * - Health checks
 * - Performance monitoring
 * - Error tracking
 * - Request/response logging
 */

const os = require('os');

class MetricsCollector {
  constructor() {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        duration: []
      },
      payments: {
        total: 0,
        successful: 0,
        failed: 0,
        amount: 0
      },
      agents: {
        active: 0,
        mandates: 0,
        tokens: 0
      },
      system: {
        uptime: 0,
        memory: 0,
        cpu: 0
      }
    };
    
    this.startTime = Date.now();
    this.requestLog = [];
    this.errorLog = [];
  }

  /**
   * Record API request
   */
  recordRequest(endpoint, method, statusCode, duration, error = null) {
    this.metrics.requests.total++;
    
    if (statusCode >= 200 && statusCode < 300) {
      this.metrics.requests.successful++;
    } else {
      this.metrics.requests.failed++;
    }
    
    this.metrics.requests.duration.push(duration);
    
    // Keep only last 1000 requests for memory efficiency
    if (this.metrics.requests.duration.length > 1000) {
      this.metrics.requests.duration.shift();
    }
    
    this.requestLog.push({
      timestamp: Date.now(),
      endpoint,
      method,
      statusCode,
      duration,
      error: error?.message
    });
  }

  /**
   * Record payment transaction
   */
  recordPayment(amount, currency, status, agentId = null) {
    this.metrics.payments.total++;
    
    if (status === 'success') {
      this.metrics.payments.successful++;
      this.metrics.payments.amount += amount;
    } else {
      this.metrics.payments.failed++;
    }
  }

  /**
   * Record agent activity
   */
  recordAgentActivity(type, count = 1) {
    switch (type) {
      case 'mandate_created':
        this.metrics.agents.mandates += count;
        break;
      case 'token_generated':
        this.metrics.agents.tokens += count;
        break;
      case 'agent_active':
        this.metrics.agents.active += count;
        break;
    }
  }

  /**
   * Record system metrics
   */
  recordSystemMetrics() {
    const memUsage = process.memoryUsage();
    this.metrics.system = {
      uptime: process.uptime(),
      memory: {
        rss: memUsage.rss,
        heapTotal: memUsage.heapTotal,
        heapUsed: memUsage.heapUsed,
        external: memUsage.external
      },
      cpu: {
        cores: os.cpus().length,
        loadAverage: os.loadavg()
      }
    };
  }

  /**
   * Get current metrics
   */
  getMetrics() {
    this.recordSystemMetrics();
    return {
      ...this.metrics,
      timestamp: Date.now(),
      uptime: Date.now() - this.startTime
    };
  }

  /**
   * Get Prometheus-formatted metrics
   */
  getPrometheusMetrics() {
    const metrics = this.getMetrics();
    
    return `
# HELP shora_requests_total Total number of API requests
# TYPE shora_requests_total counter
shora_requests_total ${metrics.requests.total}

# HELP shora_requests_successful Total number of successful requests
# TYPE shora_requests_successful counter
shora_requests_successful ${metrics.requests.successful}

# HELP shora_requests_failed Total number of failed requests
# TYPE shora_requests_failed counter
shora_requests_failed ${metrics.requests.failed}

# HELP shora_payments_total Total number of payments
# TYPE shora_payments_total counter
shora_payments_total ${metrics.payments.total}

# HELP shora_payments_amount_total Total payment amount
# TYPE shora_payments_amount_total counter
shora_payments_amount_total ${metrics.payments.amount}

# HELP shora_agents_active Number of active agents
# TYPE shora_agents_active gauge
shora_agents_active ${metrics.agents.active}

# HELP shora_agents_mandates Number of active mandates
# TYPE shora_agents_mandates gauge
shora_agents_mandates ${metrics.agents.mandates}

# HELP shora_agents_tokens Number of active tokens
# TYPE shora_agents_tokens gauge
shora_agents_tokens ${metrics.agents.tokens}

# HELP shora_system_uptime System uptime in seconds
# TYPE shora_system_uptime gauge
shora_system_uptime ${metrics.system.uptime}

# HELP shora_system_memory_rss Resident set size in bytes
# TYPE shora_system_memory_rss gauge
shora_system_memory_rss ${metrics.system.memory.rss}

# HELP shora_system_memory_heap_total Total heap size in bytes
# TYPE shora_system_memory_heap_total gauge
shora_system_memory_heap_total ${metrics.system.memory.heapTotal}

# HELP shora_system_memory_heap_used Used heap size in bytes
# TYPE shora_system_memory_heap_used gauge
shora_system_memory_heap_used ${metrics.system.memory.heapUsed}
`.trim();
  }

  /**
   * Get health status
   */
  getHealthStatus() {
    const metrics = this.getMetrics();
    const successRate = metrics.requests.total > 0 
      ? (metrics.requests.successful / metrics.requests.total) * 100 
      : 100;
    
    const avgResponseTime = metrics.requests.duration.length > 0
      ? metrics.requests.duration.reduce((a, b) => a + b, 0) / metrics.requests.duration.length
      : 0;
    
    return {
      status: successRate >= 95 ? 'healthy' : 'degraded',
      timestamp: Date.now(),
      uptime: metrics.uptime,
      successRate: Math.round(successRate * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      totalRequests: metrics.requests.total,
      totalPayments: metrics.payments.total,
      activeAgents: metrics.agents.active,
      system: metrics.system
    };
  }

  /**
   * Get error summary
   */
  getErrorSummary() {
    const errors = this.errorLog.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalErrors: this.errorLog.length,
      errorTypes: errors,
      recentErrors: this.errorLog.slice(-10)
    };
  }

  /**
   * Record error
   */
  recordError(type, message, context = {}) {
    this.errorLog.push({
      timestamp: Date.now(),
      type,
      message,
      context
    });
    
    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
  }

  /**
   * Clear metrics (for testing)
   */
  clear() {
    this.metrics = {
      requests: { total: 0, successful: 0, failed: 0, duration: [] },
      payments: { total: 0, successful: 0, failed: 0, amount: 0 },
      agents: { active: 0, mandates: 0, tokens: 0 },
      system: { uptime: 0, memory: 0, cpu: 0 }
    };
    this.requestLog = [];
    this.errorLog = [];
    this.startTime = Date.now();
  }
}

/**
 * Logger with structured output
 */
class Logger {
  constructor(level = 'info') {
    this.level = level;
    this.levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };
  }

  log(level, message, data = {}) {
    if (this.levels[level] > this.levels[this.level]) {
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      data,
      pid: process.pid,
      hostname: os.hostname()
    };

    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify(logEntry));
    } else {
      console.log(`[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}`);
      if (Object.keys(data).length > 0) {
        console.log(JSON.stringify(data, null, 2));
      }
    }
  }

  error(message, data = {}) {
    this.log('error', message, data);
  }

  warn(message, data = {}) {
    this.log('warn', message, data);
  }

  info(message, data = {}) {
    this.log('info', message, data);
  }

  debug(message, data = {}) {
    this.log('debug', message, data);
  }
}

module.exports = {
  MetricsCollector,
  Logger
};

/**
 * K6 Load Test Script for Shora AI Payment SDK
 * Tests 1000+ req/s scalability with Celery auto-scale hooks
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const agentPayRate = new Rate('agent_pay_success');

// Test configuration
export const options = {
  stages: [
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '1m', target: 500 },    // Ramp up to 500 users
    { duration: '2m', target: 1000 },   // Ramp up to 1000 users
    { duration: '3m', target: 1000 },   // Stay at 1000 users
    { duration: '1m', target: 0 },      // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests under 500ms
    http_req_failed: ['rate<0.05'],   // Error rate under 5%
    errors: ['rate<0.05'],            // Custom error rate under 5%
    agent_pay_success: ['rate>0.95'], // Agent pay success rate over 95%
  },
};

// Test data
const API_BASE = 'https://api.shora.cloud';
const API_KEY = __ENV.API_KEY || 'test-api-key';
const TENANT_ID = __ENV.TENANT_ID || 'test-tenant';

// Headers
const headers = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
  'X-Tenant-ID': TENANT_ID,
};

// Test scenarios
export function testAgentPay() {
  const payload = {
    intent: {
      amount: Math.floor(Math.random() * 1000) + 100,
      currency: 'TRY',
      description: `Load test payment ${Date.now()}`,
    },
    agentId: 'agent_load_test_001',
    tenantId: TENANT_ID,
    tapTrustEnabled: true,
  };

  const response = http.post(`${API_BASE}/v2/agents/pay`, JSON.stringify(payload), {
    headers,
    tags: { endpoint: 'agent_pay' },
  });

  const success = check(response, {
    'agent pay status is 200': (r) => r.status === 200,
    'agent pay response time < 500ms': (r) => r.timings.duration < 500,
    'agent pay has transaction ID': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.transactionId && body.transactionId.length > 0;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!success);
  agentPayRate.add(success);

  return response;
}

export function testHealthCheck() {
  const response = http.get(`${API_BASE}/v2/health`, {
    headers,
    tags: { endpoint: 'health' },
  });

  const success = check(response, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 100ms': (r) => r.timings.duration < 100,
  });

  errorRate.add(!success);
  return response;
}

export function testCryptoPay() {
  const payload = {
    network: 'ethereum',
    amount: {
      value: '1',
      currency: 'USDC',
    },
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    tenantId: TENANT_ID,
    pspFallback: true,
  };

  const response = http.post(`${API_BASE}/v2/agents/a2a/crypto-pay`, JSON.stringify(payload), {
    headers,
    tags: { endpoint: 'crypto_pay' },
  });

  const success = check(response, {
    'crypto pay status is 200 or 202': (r) => r.status === 200 || r.status === 202,
    'crypto pay response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  errorRate.add(!success);
  return response;
}

// Celery auto-scale hook simulation
export function triggerCeleryScale() {
  const scalePayload = {
    action: 'scale_workers',
    tenantId: TENANT_ID,
    currentLoad: __VU, // Virtual users
    targetLoad: 1000,
    timestamp: new Date().toISOString(),
  };

  const response = http.post(`${API_BASE}/v2/celery/scale`, JSON.stringify(scalePayload), {
    headers: {
      ...headers,
      'X-Scale-Hook': 'true',
    },
    tags: { endpoint: 'celery_scale' },
  });

  check(response, {
    'celery scale triggered': (r) => r.status === 200 || r.status === 202,
  });
}

// Main test function
export default function() {
  // Random test selection for realistic load
  const testType = Math.random();
  
  if (testType < 0.6) {
    // 60% agent payments
    testAgentPay();
  } else if (testType < 0.8) {
    // 20% health checks
    testHealthCheck();
  } else if (testType < 0.95) {
    // 15% crypto payments
    testCryptoPay();
  } else {
    // 5% scale triggers
    triggerCeleryScale();
  }

  // Random sleep between 0.1-0.5 seconds
  sleep(Math.random() * 0.4 + 0.1);
}

// Setup function - runs once before all VUs
export function setup() {
  console.log('Starting K6 load test for Shora AI Payment SDK');
  console.log(`Target: 1000 req/s for 3 minutes`);
  console.log(`API Base: ${API_BASE}`);
  console.log(`Tenant ID: ${TENANT_ID}`);
  
  // Warm-up request
  const warmup = http.get(`${API_BASE}/v2/health`, { headers });
  if (warmup.status !== 200) {
    console.warn('Warm-up failed - API may not be available');
  }
  
  return { startTime: Date.now() };
}

// Teardown function - runs once after all VUs
export function teardown(data) {
  const duration = (Date.now() - data.startTime) / 1000;
  console.log(`Load test completed in ${duration}s`);
  console.log('Check results for scalability insights');
}

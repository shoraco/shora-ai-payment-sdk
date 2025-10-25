/**
 * Integration Tests for Shora AI Payment SDK API
 */

const assert = require('assert');
const https = require('https');

class ApiTester {
  constructor(baseUrl = 'https://api.shora.cloud', apiKey = 'shora_free_123456789') {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.apiKey,
          'User-Agent': 'Shora-SDK-Test/1.0'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(body);
            resolve({ status: res.statusCode, data: result });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      });

      req.on('error', reject);
      
      if (data) {
        req.write(JSON.stringify(data));
      }
      
      req.end();
    });
  }

  async testHealthCheck() {
    console.log('Testing health check endpoint...');
    const response = await this.makeRequest('/v2/test/health');
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.status, 'healthy');
    console.log('✅ Health check passed');
  }

  async testApiAuthentication() {
    console.log('Testing API authentication...');
    const response = await this.makeRequest('/v2/test/test');
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.status, 'success');
    console.log('✅ API authentication passed');
  }

  async testRateLimiting() {
    console.log('Testing rate limiting...');
    
    // Make multiple requests to test rate limiting
    const requests = [];
    for (let i = 0; i < 5; i++) {
      requests.push(this.makeRequest('/v2/test/rate-limit'));
    }
    
    const responses = await Promise.all(requests);
    const successCount = responses.filter(r => r.status === 200).length;
    
    assert(successCount > 0, 'At least one request should succeed');
    console.log('✅ Rate limiting test passed');
  }

  async testSecurityHeaders() {
    console.log('Testing security headers...');
    const response = await this.makeRequest('/v2/test/security');
    
    assert.strictEqual(response.status, 200);
    assert(response.data.data.security_headers);
    console.log('✅ Security headers test passed');
  }

  async testDatabaseConnection() {
    console.log('Testing database connection...');
    const response = await this.makeRequest('/v2/test/database');
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.status, 'success');
    console.log('✅ Database connection test passed');
  }

  async testEchoEndpoint() {
    console.log('Testing echo endpoint...');
    const testData = {
      test: 'integration',
      timestamp: Date.now(),
      message: 'Hello Shora API'
    };
    
    const response = await this.makeRequest('/v2/test/echo', 'POST', testData);
    
    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.data.data.echo.test, 'integration');
    console.log('✅ Echo endpoint test passed');
  }

  async runAllTests() {
    console.log('🚀 Starting Shora AI Payment SDK Integration Tests');
    console.log('================================================\n');

    try {
      await this.testHealthCheck();
      await this.testApiAuthentication();
      await this.testRateLimiting();
      await this.testSecurityHeaders();
      await this.testDatabaseConnection();
      await this.testEchoEndpoint();

      console.log('\n✅ All integration tests passed!');
      return true;
    } catch (error) {
      console.log(`\n❌ Integration test failed: ${error.message}`);
      return false;
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new ApiTester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = ApiTester;

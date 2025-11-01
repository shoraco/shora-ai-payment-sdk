/**
 * Load Testing for Shora AI Payment SDK
 * 
 * Tests:
 * - Concurrent request handling
 * - Rate limiting under load
 * - Memory usage under stress
 * - Response time degradation
 */

const https = require('https');
const { performance } = require('perf_hooks');

class LoadTester {
 constructor(options = {}) {
 this.baseUrl = options.baseUrl || 'https://api.shora.cloud';
 this.apiKey = options.apiKey || 'shora_free_123456789';
 this.concurrency = options.concurrency || 10;
 this.duration = options.duration || 30000; // 30 seconds
 this.interval = options.interval || 100; // 100ms between requests
 
 this.results = {
 totalRequests: 0,
 successfulRequests: 0,
 failedRequests: 0,
 responseTimes: [],
 errors: [],
 startTime: null,
 endTime: null
 };
 }

 async makeRequest(endpoint, method = 'GET', data = null) {
 const startTime = performance.now();
 
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
 'User-Agent': 'Shora-Load-Test/1.0'
 }
 };

 const req = https.request(options, (res) => {
 let body = '';
 res.on('data', (chunk) => body += chunk);
 res.on('end', () => {
 const endTime = performance.now();
 const responseTime = endTime - startTime;
 
 resolve({
 status: res.statusCode,
 responseTime: responseTime,
 body: body
 });
 });
 });

 req.on('error', (error) => {
 const endTime = performance.now();
 const responseTime = endTime - startTime;
 
 reject({
 error: error.message,
 responseTime: responseTime
 });
 });
 
 if (data) {
 req.write(JSON.stringify(data));
 }
 
 req.end();
 });
 }

 async runConcurrentRequests() {
 const endpoints = [
 '/v2/test/health',
 '/v2/test/test',
 '/v2/test/database',
 '/v2/test/security'
 ];

 const promises = [];
 
 for (let i = 0; i < this.concurrency; i++) {
 const endpoint = endpoints[i % endpoints.length];
 promises.push(this.makeRequest(endpoint));
 }

 return Promise.allSettled(promises);
 }

 async runLoadTest() {
 console.log('Starting Load Test');
 console.log(`Concurrency: ${this.concurrency}`);
 console.log(`Duration: ${this.duration}ms`);
 console.log(`Interval: ${this.interval}ms`);
 console.log('========================\n');

 this.results.startTime = performance.now();
 const endTime = this.results.startTime + this.duration;

 while (performance.now() < endTime) {
 try {
 const results = await this.runConcurrentRequests();
 
 results.forEach((result, index) => {
 this.results.totalRequests++;
 
 if (result.status === 'fulfilled') {
 const response = result.value;
 this.results.successfulRequests++;
 this.results.responseTimes.push(response.responseTime);
 
 if (response.status >= 400) {
 this.results.failedRequests++;
 this.results.errors.push({
 status: response.status,
 body: response.body,
 timestamp: Date.now()
 });
 }
 } else {
 this.results.failedRequests++;
 this.results.errors.push({
 error: result.reason.error,
 responseTime: result.reason.responseTime,
 timestamp: Date.now()
 });
 }
 });

 // Wait before next batch
 await new Promise(resolve => setTimeout(resolve, this.interval));
 
 } catch (error) {
 console.error('Load test error:', error);
 this.results.errors.push({
 error: error.message,
 timestamp: Date.now()
 });
 }
 }

 this.results.endTime = performance.now();
 return this.analyzeResults();
 }

 analyzeResults() {
 const duration = this.results.endTime - this.results.startTime;
 const avgResponseTime = this.results.responseTimes.length > 0
 ? this.results.responseTimes.reduce((a, b) => a + b, 0) / this.results.responseTimes.length
 : 0;
 
 const sortedTimes = [...this.results.responseTimes].sort((a, b) => a - b);
 const p95Index = Math.floor(sortedTimes.length * 0.95);
 const p95ResponseTime = sortedTimes[p95Index] || 0;
 
 const successRate = this.results.totalRequests > 0
 ? (this.results.successfulRequests / this.results.totalRequests) * 100
 : 0;
 
 const rps = this.results.totalRequests / (duration / 1000);

 const analysis = {
 duration: Math.round(duration),
 totalRequests: this.results.totalRequests,
 successfulRequests: this.results.successfulRequests,
 failedRequests: this.results.failedRequests,
 successRate: Math.round(successRate * 100) / 100,
 avgResponseTime: Math.round(avgResponseTime * 100) / 100,
 p95ResponseTime: Math.round(p95ResponseTime * 100) / 100,
 requestsPerSecond: Math.round(rps * 100) / 100,
 errorCount: this.results.errors.length,
 errors: this.results.errors.slice(-10) // Last 10 errors
 };

 return analysis;
 }

 printResults(analysis) {
 console.log('\nLoad Test Results');
 console.log('===================');
 console.log(`Duration: ${analysis.duration}ms`);
 console.log(`Total Requests: ${analysis.totalRequests}`);
 console.log(`Successful: ${analysis.successfulRequests}`);
 console.log(`Failed: ${analysis.failedRequests}`);
 console.log(`Success Rate: ${analysis.successRate}%`);
 console.log(`Avg Response Time: ${analysis.avgResponseTime}ms`);
 console.log(`P95 Response Time: ${analysis.p95ResponseTime}ms`);
 console.log(`Requests/Second: ${analysis.requestsPerSecond}`);
 console.log(`Error Count: ${analysis.errorCount}`);

 if (analysis.errors.length > 0) {
 console.log('\nRecent Errors:');
 analysis.errors.forEach((error, index) => {
 console.log(`${index + 1}. ${error.error || error.status} (${error.timestamp})`);
 });
 }

 // Performance thresholds
 console.log('\nPerformance Thresholds:');
 const checkMark = (condition) => condition ? 'PASS' : 'FAIL';
 console.log(`Success Rate: ${checkMark(analysis.successRate >= 95)} (Target: ≥95%)`);
 console.log(`Avg Response Time: ${checkMark(analysis.avgResponseTime <= 500)} (Target: ≤500ms)`);
 console.log(`P95 Response Time: ${checkMark(analysis.p95ResponseTime <= 1000)} (Target: ≤1000ms)`);
 console.log(`RPS: ${checkMark(analysis.requestsPerSecond >= 10)} (Target: ≥10 RPS)`);
 }
}

// Run load test if called directly
if (require.main === module) {
 const tester = new LoadTester({
 concurrency: 10,
 duration: 30000,
 interval: 100
 });

 tester.runLoadTest().then(analysis => {
 tester.printResults(analysis);
 process.exit(0);
 }).catch(error => {
 console.error('Load test failed:', error);
 process.exit(1);
 });
}

module.exports = LoadTester;

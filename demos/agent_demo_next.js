/**
 * Shora AI Payment SDK - Agent Demo
 * 
 * Complete AI agent payment flow demonstration:
 * 1. Chat interface simulation
 * 2. Payment intent creation
 * 3. Mandate creation for AI agent
 * 4. Token generation
 * 5. Payment processing
 * 6. Webhook confirmation
 */

const https = require('https');
const http = require('http');

class ShoraAgentDemo {
 constructor() {
 this.baseUrl = process.env.SHORA_BASE_URL || 'https://api.shora.cloud';
 this.apiKey = process.env.SHORA_API_KEY || 'shora_free_123456789';
 this.agentId = 'demo-agent-' + Date.now();
 this.sessionId = 'session-' + Date.now();
 }

 async makeRequest(endpoint, method = 'GET', data = null) {
 return new Promise((resolve, reject) => {
 const url = new URL(endpoint, this.baseUrl);
 const options = {
 hostname: url.hostname,
 port: url.port || (url.protocol === 'https:' ? 443 : 80),
 path: url.pathname + url.search,
 method: method,
 headers: {
 'Content-Type': 'application/json',
 'X-API-Key': this.apiKey,
 'User-Agent': 'Shora-Agent-Demo/1.0'
 }
 };

 const client = url.protocol === 'https:' ? https : http;
 const req = client.request(options, (res) => {
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

 log(message, data = null) {
 console.log(`\n${message}`);
 if (data) {
 console.log(JSON.stringify(data, null, 2));
 }
 }

 async step1_ChatInterface() {
 this.log('Step 1: Chat Interface - User requests payment');
 
 // Simulate chat interaction
 const chatMessages = [
 "User: I want to buy a laptop for 2500 TL",
 "Agent: I can help you with that! Let me create a payment for 2500 TL.",
 "Agent: Creating payment intent..."
 ];
 
 chatMessages.forEach((msg, index) => {
 setTimeout(() => {
 console.log(msg);
 }, index * 1000);
 });

 await new Promise(resolve => setTimeout(resolve, 3000));
 return { amount: 2500.00, currency: 'TRY', product: 'Laptop' };
 }

 async step2_CreatePaymentIntent(paymentData) {
 this.log('Step 2: Creating Payment Intent');
 
 const intentData = {
 amount: paymentData.amount,
 currency: paymentData.currency,
 buyer: {
 name: 'Demo User',
 email: 'demo@example.com',
 phone: '+905551234567'
 },
 payment_method: 'card',
 merchant_order_id: `DEMO-${Date.now()}`,
 metadata: {
 agent_id: this.agentId,
 session_id: this.sessionId,
 product: paymentData.product
 }
 };

 try {
 const response = await this.makeRequest('/v2/agents/checkout-sessions', 'POST', intentData);
 
 if (response.status === 200) {
 this.log('Payment intent created successfully', response.data);
 return response.data;
 } else {
 throw new Error(`Intent creation failed: ${response.status}`);
 }
 } catch (error) {
 this.log('Payment intent creation failed', { error: error.message });
 throw error;
 }
 }

 async step3_CreateMandate() {
 this.log('Step 3: Creating Payment Mandate for AI Agent');
 
 const mandateData = {
 agent_id: this.agentId,
 max_amount: 5000.00,
 currency: 'TRY',
 expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
 metadata: {
 session_id: this.sessionId,
 agent_type: 'chatbot',
 permissions: ['payment', 'refund']
 }
 };

 try {
 const response = await this.makeRequest('/v2/agents/mandates', 'POST', mandateData);
 
 if (response.status === 200) {
 this.log('Payment mandate created successfully', response.data);
 return response.data;
 } else {
 throw new Error(`Mandate creation failed: ${response.status}`);
 }
 } catch (error) {
 this.log('Mandate creation failed', { error: error.message });
 throw error;
 }
 }

 async step4_GenerateToken(mandateId, amount) {
 this.log('Step 4: Generating Payment Token');
 
 const tokenData = {
 mandate_id: mandateId,
 amount: amount,
 currency: 'TRY',
 expires_in: 300, // 5 minutes
 metadata: {
 agent_id: this.agentId,
 session_id: this.sessionId
 }
 };

 try {
 const response = await this.makeRequest('/v2/agents/tokens', 'POST', tokenData);
 
 if (response.status === 200) {
 this.log('Payment token generated successfully', response.data);
 return response.data;
 } else {
 throw new Error(`Token generation failed: ${response.status}`);
 }
 } catch (error) {
 this.log('Token generation failed', { error: error.message });
 throw error;
 }
 }

 async step5_ProcessPayment(token, amount) {
 this.log('Step 5: Processing Payment with Token');
 
 const paymentData = {
 token: token,
 amount: amount,
 currency: 'TRY',
 payment_method: {
 type: 'card',
 card_holder: 'DEMO USER',
 card_number: '4111111111111111',
 expiry_month: '12',
 expiry_year: '2025',
 cvv: '123'
 },
 metadata: {
 agent_id: this.agentId,
 session_id: this.sessionId
 }
 };

 try {
 const response = await this.makeRequest('/v2/agents/pay', 'POST', paymentData);
 
 if (response.status === 200) {
 this.log('Payment processed successfully', response.data);
 return response.data;
 } else {
 throw new Error(`Payment processing failed: ${response.status}`);
 }
 } catch (error) {
 this.log('Payment processing failed', { error: error.message });
 throw error;
 }
 }

 async step6_WebhookConfirmation(paymentId) {
 this.log('Step 6: Webhook Confirmation');
 
 // Simulate webhook payload
 const webhookData = {
 event: 'payment.success',
 payment_id: paymentId,
 timestamp: Math.floor(Date.now() / 1000),
 data: {
 amount: 2500.00,
 currency: 'TRY',
 status: 'completed',
 agent_id: this.agentId,
 session_id: this.sessionId
 }
 };

 this.log('Webhook received', webhookData);
 
 // Simulate webhook processing
 await new Promise(resolve => setTimeout(resolve, 1000));
 
 this.log('Payment confirmed via webhook');
 return webhookData;
 }

 async runDemo() {
 console.log('\nStarting Shora AI Payment SDK Demo');
 console.log('=====================================\n');

 try {
 // Step 1: Chat Interface
 const paymentData = await this.step1_ChatInterface();
 
 // Step 2: Create Payment Intent
 const intent = await this.step2_CreatePaymentIntent(paymentData);
 
 // Step 3: Create Mandate
 const mandate = await this.step3_CreateMandate();
 
 // Step 4: Generate Token
 const token = await this.step4_GenerateToken(mandate.id, paymentData.amount);
 
 // Step 5: Process Payment
 const payment = await this.step5_ProcessPayment(token.value, paymentData.amount);
 
 // Step 6: Webhook Confirmation
 const webhook = await this.step6_WebhookConfirmation(payment.payment_id);

 // Summary
 console.log('\nDemo Completed Successfully!');
 console.log('==============================');
 console.log(`Agent ID: ${this.agentId}`);
 console.log(`Session ID: ${this.sessionId}`);
 console.log(`Amount: ${paymentData.amount} ${paymentData.currency}`);
 console.log(`Payment ID: ${payment.payment_id}`);
 console.log(`Status: ${webhook.data.status}`);

 } catch (error) {
 console.log('\nDemo Failed');
 console.log('==============');
 console.log(`Error: ${error.message}`);
 process.exit(1);
 }
 }
}

// Run the demo
if (require.main === module) {
 const demo = new ShoraAgentDemo();
 demo.runDemo().catch(console.error);
}

module.exports = ShoraAgentDemo;

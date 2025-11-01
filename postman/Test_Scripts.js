// Shora AI Payment SDK - Postman Test Scripts
// Comprehensive test suite for API validation

// Global Pre-request Script
pm.globals.set("request_timestamp", new Date().toISOString());

// Global Test Script
pm.test("Response time is acceptable", function () {
 pm.expect(pm.response.responseTime).to.be.below(5000);
});

pm.test("Response has valid JSON", function () {
 pm.response.to.be.json;
});

pm.test("Response has proper headers", function () {
 pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});

// Authentication Tests
pm.test("Health check returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Health check response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData.status).to.eql("healthy");
});

// OAuth2 Login Tests
pm.test("OAuth2 login returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("OAuth2 response contains access token", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("access_token");
 pm.expect(jsonData).to.have.property("token_type");
 pm.expect(jsonData.token_type).to.eql("Bearer");
 pm.expect(jsonData).to.have.property("expires_in");
});

pm.test("Store access token for subsequent requests", function () {
 if (pm.response.code === 200) {
 const jsonData = pm.response.json();
 pm.environment.set("access_token", jsonData.access_token);
 pm.environment.set("token_expires_at", new Date(Date.now() + jsonData.expires_in * 1000).toISOString());
 }
});

// Payment Session Tests
pm.test("Payment session creation returns 201", function () {
 pm.response.to.have.status(201);
});

pm.test("Payment session response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("id");
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData).to.have.property("amount");
 pm.expect(jsonData).to.have.property("currency");
 pm.expect(jsonData).to.have.property("payment_url");
 pm.expect(jsonData.status).to.eql("pending");
});

pm.test("Store session data for payment processing", function () {
 if (pm.response.code === 201) {
 const jsonData = pm.response.json();
 pm.environment.set("session_id", jsonData.id);
 pm.environment.set("payment_url", jsonData.payment_url);
 pm.environment.set("session_amount", jsonData.amount);
 pm.environment.set("session_currency", jsonData.currency);
 }
});

// Payment Processing Tests
pm.test("Payment processing returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Payment response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("id");
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData).to.have.property("amount");
 pm.expect(jsonData).to.have.property("currency");
 pm.expect(jsonData.status).to.be.oneOf(["completed", "pending", "failed"]);
});

pm.test("Store payment data for audit logs", function () {
 if (pm.response.code === 200) {
 const jsonData = pm.response.json();
 pm.environment.set("payment_id", jsonData.id);
 pm.environment.set("payment_status", jsonData.status);
 }
});

// Agent Mandate Tests
pm.test("Mandate creation returns 201", function () {
 pm.response.to.have.status(201);
});

pm.test("Mandate response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("id");
 pm.expect(jsonData).to.have.property("agent_id");
 pm.expect(jsonData).to.have.property("max_amount");
 pm.expect(jsonData).to.have.property("currency");
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData).to.have.property("expires_at");
 pm.expect(jsonData.status).to.eql("active");
});

pm.test("Store mandate data for token generation", function () {
 if (pm.response.code === 201) {
 const jsonData = pm.response.json();
 pm.environment.set("mandate_id", jsonData.id);
 pm.environment.set("mandate_max_amount", jsonData.max_amount);
 pm.environment.set("mandate_currency", jsonData.currency);
 }
});

// Token Generation Tests
pm.test("Token generation returns 201", function () {
 pm.response.to.have.status(201);
});

pm.test("Token response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("id");
 pm.expect(jsonData).to.have.property("mandate_id");
 pm.expect(jsonData).to.have.property("value");
 pm.expect(jsonData).to.have.property("expires_at");
 pm.expect(jsonData.value).to.be.a("string");
 pm.expect(jsonData.value.length).to.be.above(10);
});

pm.test("Store token for agent payment", function () {
 if (pm.response.code === 201) {
 const jsonData = pm.response.json();
 pm.environment.set("payment_token", jsonData.value);
 pm.environment.set("token_id", jsonData.id);
 pm.environment.set("token_expires_at", jsonData.expires_at);
 }
});

// Agent Payment Tests
pm.test("Agent payment returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Agent payment response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("id");
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData).to.have.property("amount");
 pm.expect(jsonData).to.have.property("currency");
 pm.expect(jsonData.status).to.be.oneOf(["completed", "failed"]);
});

// Audit Logs Tests
pm.test("Audit logs returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Audit logs response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("logs");
 pm.expect(jsonData).to.have.property("total");
 pm.expect(jsonData).to.have.property("limit");
 pm.expect(jsonData).to.have.property("offset");
 pm.expect(jsonData.logs).to.be.an("array");
});

pm.test("Audit log entries have required fields", function () {
 const jsonData = pm.response.json();
 if (jsonData.logs.length > 0) {
 const logEntry = jsonData.logs[0];
 pm.expect(logEntry).to.have.property("id");
 pm.expect(logEntry).to.have.property("action");
 pm.expect(logEntry).to.have.property("tenant_id");
 pm.expect(logEntry).to.have.property("timestamp");
 }
});

// Feed Items Tests
pm.test("Feed items returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Feed items response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("items");
 pm.expect(jsonData).to.have.property("total");
 pm.expect(jsonData).to.have.property("limit");
 pm.expect(jsonData).to.have.property("offset");
 pm.expect(jsonData.items).to.be.an("array");
});

pm.test("Feed item entries have required fields", function () {
 const jsonData = pm.response.json();
 if (jsonData.items.length > 0) {
 const feedItem = jsonData.items[0];
 pm.expect(feedItem).to.have.property("id");
 pm.expect(feedItem).to.have.property("title");
 pm.expect(feedItem).to.have.property("status");
 pm.expect(feedItem).to.have.property("tenant_id");
 pm.expect(feedItem).to.have.property("created_at");
 }
});

// Webhook Tests
pm.test("Webhook event returns 200", function () {
 pm.response.to.have.status(200);
});

pm.test("Webhook response structure", function () {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("status");
 pm.expect(jsonData).to.have.property("event_id");
 pm.expect(jsonData).to.have.property("processed_at");
 pm.expect(jsonData.status).to.eql("received");
});

// Rate Limiting Tests
pm.test("Rate limit headers present", function () {
 const remaining = pm.response.headers.get("X-RateLimit-Remaining");
 const reset = pm.response.headers.get("X-RateLimit-Reset");
 
 if (remaining) {
 pm.expect(parseInt(remaining)).to.be.a("number");
 pm.expect(parseInt(remaining)).to.be.at.least(0);
 }
 
 if (reset) {
 pm.expect(parseInt(reset)).to.be.a("number");
 pm.expect(parseInt(reset)).to.be.at.least(Date.now() / 1000);
 }
});

// Security Tests
pm.test("Security headers present", function () {
 const hsts = pm.response.headers.get("Strict-Transport-Security");
 const csp = pm.response.headers.get("Content-Security-Policy");
 const xss = pm.response.headers.get("X-XSS-Protection");
 
 if (hsts) {
 pm.expect(hsts).to.include("max-age");
 }
 
 if (csp) {
 pm.expect(csp).to.be.a("string");
 }
 
 if (xss) {
 pm.expect(xss).to.include("1");
 }
});

// Error Handling Tests
pm.test("Error responses have proper structure", function () {
 if (pm.response.code >= 400) {
 const jsonData = pm.response.json();
 pm.expect(jsonData).to.have.property("error");
 pm.expect(jsonData).to.have.property("code");
 pm.expect(jsonData).to.have.property("timestamp");
 }
});

// Data Validation Tests
pm.test("Amount values are positive", function () {
 const jsonData = pm.response.json();
 if (jsonData.amount) {
 pm.expect(jsonData.amount).to.be.at.least(0);
 }
});

pm.test("Currency codes are valid", function () {
 const jsonData = pm.response.json();
 if (jsonData.currency) {
 const validCurrencies = ["USD", "EUR", "TRY", "GBP"];
 pm.expect(validCurrencies).to.include(jsonData.currency);
 }
});

pm.test("Timestamps are valid ISO format", function () {
 const jsonData = pm.response.json();
 const timestampFields = ["created_at", "updated_at", "expires_at", "timestamp"];
 
 timestampFields.forEach(field => {
 if (jsonData[field]) {
 const date = new Date(jsonData[field]);
 pm.expect(date.getTime()).to.not.be.NaN;
 }
 });
});

// Performance Tests
pm.test("Response time under 2 seconds", function () {
 pm.expect(pm.response.responseTime).to.be.below(2000);
});

pm.test("Response size is reasonable", function () {
 const responseSize = pm.response.responseSize;
 pm.expect(responseSize).to.be.below(100000); // 100KB limit
});

// Business Logic Tests
pm.test("Payment amounts match session amounts", function () {
 const sessionAmount = pm.environment.get("session_amount");
 const jsonData = pm.response.json();
 
 if (sessionAmount && jsonData.amount) {
 pm.expect(parseInt(jsonData.amount)).to.eql(parseInt(sessionAmount));
 }
});

pm.test("Currency consistency", function () {
 const sessionCurrency = pm.environment.get("session_currency");
 const jsonData = pm.response.json();
 
 if (sessionCurrency && jsonData.currency) {
 pm.expect(jsonData.currency).to.eql(sessionCurrency);
 }
});

// Cleanup and Logging
pm.test("Log request details for debugging", function () {
 console.log("Request URL:", pm.request.url.toString());
 console.log("Request Method:", pm.request.method);
 console.log("Response Status:", pm.response.status);
 console.log("Response Time:", pm.response.responseTime + "ms");
 console.log("Response Size:", pm.response.responseSize + " bytes");
});

pm.test("Update environment variables", function () {
 // Update request counter
 const requestCount = parseInt(pm.environment.get("request_count") || "0") + 1;
 pm.environment.set("request_count", requestCount.toString());
 
 // Update last request time
 pm.environment.set("last_request_time", new Date().toISOString());
});

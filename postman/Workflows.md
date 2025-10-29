# Shora AI Payment SDK - Postman Workflows

## Overview

This document outlines common workflows and use cases for testing the Shora AI Payment SDK API using Postman collections.

## Prerequisites

1. Import the Shora AI Payment SDK Collection
2. Import the Shora AI Payment SDK Environment
3. Set up your API key in the environment variables
4. Configure your tenant ID and other required variables

## Workflow 1: Basic Payment Processing

### Step 1: Health Check
- **Endpoint:** `GET /v2/test/health`
- **Purpose:** Verify API connectivity
- **Expected:** 200 OK with `{"status": "healthy"}`

### Step 2: Create Payment Session
- **Endpoint:** `POST /v2/payments/sessions`
- **Purpose:** Create a new payment session
- **Request Body:**
  ```json
  {
    "amount": 2999,
    "currency": "USD",
    "description": "Test Payment",
    "customer": {
      "email": "test@example.com",
      "name": "Test User"
    }
  }
  ```
- **Expected:** 201 Created with session ID and payment URL

### Step 3: Process Payment
- **Endpoint:** `POST /v2/payments/process`
- **Purpose:** Process the payment using the session
- **Request Body:**
  ```json
  {
    "sessionId": "{{session_id}}",
    "paymentMethod": "card",
    "cardToken": "tok_test_123456789"
  }
  ```
- **Expected:** 200 OK with payment details

## Workflow 2: AI Agent Payment Flow

### Step 1: Create Agent Mandate
- **Endpoint:** `POST /v2/agents/mandates`
- **Purpose:** Create a payment mandate for AI agents
- **Request Body:**
  ```json
  {
    "agent_id": "agent_123",
    "max_amount": 10000,
    "currency": "USD",
    "expires_at": "2024-12-31T23:59:59Z",
    "description": "AI Agent Payment Mandate"
  }
  ```
- **Expected:** 201 Created with mandate ID

### Step 2: Generate Payment Token
- **Endpoint:** `POST /v2/agents/tokens`
- **Purpose:** Generate a payment token from the mandate
- **Request Body:**
  ```json
  {
    "mandate_id": "{{mandate_id}}",
    "amount": 500,
    "currency": "USD",
    "description": "AI Service Payment"
  }
  ```
- **Expected:** 201 Created with payment token

### Step 3: Process Agent Payment
- **Endpoint:** `POST /v2/agents/pay`
- **Purpose:** Process payment using the agent token
- **Request Body:**
  ```json
  {
    "token": "{{payment_token}}",
    "amount": 500,
    "currency": "USD",
    "description": "AI Service Payment"
  }
  ```
- **Expected:** 200 OK with payment completion

## Workflow 3: Enterprise OAuth2 Flow

### Step 1: OAuth2 Login
- **Endpoint:** `POST /v2/auth/login`
- **Purpose:** Authenticate with OAuth2 credentials
- **Request Body:**
  ```json
  {
    "username": "{{oauth_username}}",
    "password": "{{oauth_password}}",
    "grant_type": "password"
  }
  ```
- **Expected:** 200 OK with access token

### Step 2: Use OAuth2 Token
- **Headers:** `Authorization: Bearer {{access_token}}`
- **Purpose:** Use OAuth2 token for subsequent requests
- **Note:** Token is automatically stored in environment variables

## Workflow 4: Enterprise Features Testing

### Step 1: Get Audit Logs
- **Endpoint:** `GET /v2/audit?tenant_id={{tenant_id}}&limit=10&offset=0`
- **Purpose:** Retrieve audit logs for compliance
- **Expected:** 200 OK with paginated audit logs

### Step 2: Get Feed Items
- **Endpoint:** `GET /v2/feed/list?tenant_id={{tenant_id}}&limit=10&offset=0&filter=status:active`
- **Purpose:** Retrieve paginated feed items
- **Expected:** 200 OK with filtered feed items

### Step 3: Send Webhook Event
- **Endpoint:** `POST /v2/webhooks/custom`
- **Purpose:** Send custom webhook events
- **Request Body:**
  ```json
  {
    "event": "audit_tx",
    "data": {
      "payment_id": "{{payment_id}}",
      "amount": 500,
      "currency": "USD",
      "status": "completed"
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }
  ```
- **Expected:** 200 OK with webhook confirmation

## Workflow 5: Error Handling Testing

### Step 1: Invalid API Key
- **Headers:** `X-API-Key: invalid_key`
- **Purpose:** Test authentication failure
- **Expected:** 401 Unauthorized

### Step 2: Invalid Payment Data
- **Endpoint:** `POST /v2/payments/sessions`
- **Request Body:** Invalid amount or missing required fields
- **Expected:** 400 Bad Request with error details

### Step 3: Rate Limit Testing
- **Purpose:** Test rate limiting behavior
- **Method:** Make multiple requests quickly
- **Expected:** 429 Too Many Requests when limit exceeded

## Workflow 6: Performance Testing

### Step 1: Load Testing
- **Purpose:** Test API performance under load
- **Method:** Run collection multiple times
- **Metrics:** Response time, success rate, error rate

### Step 2: Stress Testing
- **Purpose:** Test API behavior under stress
- **Method:** Concurrent requests with high frequency
- **Expected:** Graceful degradation, proper error handling

## Workflow 7: Security Testing

### Step 1: Security Headers
- **Purpose:** Verify security headers are present
- **Headers to Check:**
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-XSS-Protection`
  - `X-Frame-Options`

### Step 2: Input Validation
- **Purpose:** Test input validation and sanitization
- **Method:** Send malicious or malformed data
- **Expected:** Proper validation and sanitization

## Workflow 8: Integration Testing

### Step 1: End-to-End Payment Flow
1. Health Check
2. Create Payment Session
3. Process Payment
4. Verify Payment Status
5. Check Audit Logs

### Step 2: Agent Payment Flow
1. Create Agent Mandate
2. Generate Payment Token
3. Process Agent Payment
4. Verify Payment Completion
5. Check Feed Items

## Environment Variables

### Required Variables
- `api_key`: Your Shora API key
- `tenant_id`: Your tenant ID
- `base_url`: API base URL

### Auto-Populated Variables
- `access_token`: OAuth2 access token
- `session_id`: Payment session ID
- `payment_id`: Payment ID
- `mandate_id`: Agent mandate ID
- `payment_token`: Agent payment token

### Test Variables
- `test_amount`: Test payment amount
- `test_currency`: Test currency
- `customer_email`: Test customer email
- `customer_name`: Test customer name

## Best Practices

### 1. Environment Management
- Use separate environments for sandbox and production
- Never commit API keys to version control
- Rotate API keys regularly

### 2. Test Data Management
- Use consistent test data across workflows
- Clean up test data after testing
- Use realistic test scenarios

### 3. Error Handling
- Test both success and failure scenarios
- Verify error messages are helpful
- Test edge cases and boundary conditions

### 4. Performance Monitoring
- Monitor response times
- Track success rates
- Set up alerts for failures

### 5. Security Considerations
- Use HTTPS for all requests
- Validate all inputs
- Implement proper authentication
- Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API key is correct
   - Check token expiration
   - Ensure proper headers

2. **Rate Limiting**
   - Check rate limit headers
   - Implement exponential backoff
   - Monitor usage patterns

3. **Data Validation**
   - Verify request format
   - Check required fields
   - Validate data types

4. **Network Issues**
   - Check connectivity
   - Verify SSL certificates
   - Monitor timeouts

### Debug Tips

1. **Enable Request/Response Logging**
2. **Use Postman Console for debugging**
3. **Check environment variables**
4. **Verify collection and environment imports**
5. **Test individual requests before running workflows**

## Support

For additional help:
- **Documentation:** https://developer.shora.cloud
- **API Reference:** https://api.shora.cloud/docs
- **Support Email:** dev@shora.co
- **GitHub Issues:** https://github.com/shoraco/shora-ai-payment-sdk/issues

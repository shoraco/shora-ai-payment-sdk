# Shora AI Payment SDK - API Documentation

## Overview

The Shora AI Payment SDK provides a comprehensive API for payment processing, AI agent payments, and enterprise features. This documentation covers all endpoints, authentication methods, and integration patterns.

## Base URLs

- **Production:** `https://api.shora.cloud`
- **Sandbox:** `https://api.sandbox.shora.cloud`

## Authentication

### API Key Authentication
All requests require an API key in the header:
```
X-API-Key: your_api_key_here
```

### OAuth2 Authentication (Enterprise)
For enterprise users, OAuth2 authentication is available:
```
Authorization: Bearer your_access_token
```

## Rate Limits

- **Free Tier (KOBİ):** 100 requests/day
- **Enterprise Pro:** Unlimited
- **Enterprise Custom:** Custom limits

Rate limit headers are included in all responses:
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## Endpoints

### Health Check
```
GET /v2/test/health
```
Returns API health status and version information.

### Authentication

#### OAuth2 Login
```
POST /v2/auth/login
```
Authenticate with username/password to get access token.

**Request Body:**
```json
{
  "username": "enterprise@shora.co",
  "password": "secure_password",
  "grant_type": "password"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "refresh_token_here",
  "scope": "payment:write agent:write"
}
```

### Payment Processing

#### Create Payment Session
```
POST /v2/payments/sessions
```
Create a new payment session for processing payments.

**Request Body:**
```json
{
  "amount": 2999,
  "currency": "USD",
  "description": "AI Service Subscription",
  "customer": {
    "email": "customer@example.com",
    "name": "John Doe"
  },
  "metadata": {
    "source": "ai_agent",
    "agent_id": "agent_123"
  }
}
```

**Response:**
```json
{
  "id": "session_123456789",
  "status": "pending",
  "amount": 2999,
  "currency": "USD",
  "payment_url": "https://checkout.shora.cloud/session_123456789",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Process Payment
```
POST /v2/payments/process
```
Process a payment using a payment session.

**Request Body:**
```json
{
  "sessionId": "session_123456789",
  "paymentMethod": "card",
  "cardToken": "tok_123456789"
}
```

**Response:**
```json
{
  "id": "payment_123456789",
  "status": "completed",
  "amount": 2999,
  "currency": "USD",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### AI Agent Payments

#### Create Agent Mandate
```
POST /v2/agents/mandates
```
Create a payment mandate for AI agents.

**Request Body:**
```json
{
  "agent_id": "agent_123",
  "max_amount": 10000,
  "currency": "USD",
  "expires_at": "2024-12-31T23:59:59Z",
  "description": "AI Agent Payment Mandate"
}
```

**Response:**
```json
{
  "id": "mandate_123456789",
  "agent_id": "agent_123",
  "max_amount": 10000,
  "currency": "USD",
  "status": "active",
  "expires_at": "2024-12-31T23:59:59Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Generate Payment Token
```
POST /v2/agents/tokens
```
Generate a payment token from a mandate.

**Request Body:**
```json
{
  "mandate_id": "mandate_123456789",
  "amount": 500,
  "currency": "USD",
  "description": "AI Service Payment"
}
```

**Response:**
```json
{
  "id": "token_123456789",
  "mandate_id": "mandate_123456789",
  "value": "secure_token_value_here",
  "expires_at": "2024-01-02T00:00:00Z",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Process Agent Payment
```
POST /v2/agents/pay
```
Process a payment using an agent token.

**Request Body:**
```json
{
  "token": "secure_token_value_here",
  "amount": 500,
  "currency": "USD",
  "description": "AI Service Payment"
}
```

**Response:**
```json
{
  "id": "agent_payment_123456789",
  "status": "completed",
  "amount": 500,
  "currency": "USD",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### Enterprise Features

#### Get Audit Logs
```
GET /v2/audit?tenant_id=1&limit=10&offset=0
```
Retrieve audit logs for compliance and monitoring.

**Query Parameters:**
- `tenant_id`: Tenant ID for multi-tenant operations
- `limit`: Number of records to return (default: 10)
- `offset`: Number of records to skip (default: 0)

**Response:**
```json
{
  "logs": [
    {
      "id": "audit_123456789",
      "action": "payment_created",
      "tenant_id": 1,
      "user_id": "user_123",
      "details": {
        "payment_id": "payment_123456789",
        "amount": 500,
        "currency": "USD"
      },
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

#### Get Feed Items
```
GET /v2/feed/list?tenant_id=1&limit=10&offset=0&filter=status:active
```
Get paginated feed items with filtering.

**Query Parameters:**
- `tenant_id`: Tenant ID for multi-tenant operations
- `limit`: Number of records to return (default: 10)
- `offset`: Number of records to skip (default: 0)
- `filter`: Filter criteria (e.g., `status:active`)

**Response:**
```json
{
  "items": [
    {
      "id": "feed_123456789",
      "title": "Payment Processed",
      "description": "Payment of $500 completed successfully",
      "status": "active",
      "tenant_id": 1,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Webhooks

#### Custom Webhook Event
```
POST /v2/webhooks/custom
```
Send custom webhook events for enterprise integrations.

**Headers:**
```
Content-Type: application/json
X-Webhook-Signature: sha256=signature_here
```

**Request Body:**
```json
{
  "event": "audit_tx",
  "data": {
    "payment_id": "payment_123456789",
    "amount": 500,
    "currency": "USD",
    "status": "completed"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "status": "received",
  "event_id": "webhook_123456789",
  "processed_at": "2024-01-01T00:00:00Z"
}
```

## Error Handling

All API endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Additional error details"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## SDK Integration

### JavaScript/TypeScript
```javascript
import ShoraSDK from 'shora-ai-payment-sdk';

const shora = new ShoraSDK({
  apiKey: process.env.SHORA_API_KEY,
  environment: 'sandbox'
});

// Create payment session
const session = await shora.createPaymentSession({
  amount: 2999,
  currency: 'USD',
  description: 'AI Service Subscription',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe'
  }
});
```

### Python
```python
import requests

headers = {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json'
}

response = requests.post(
    'https://api.shora.cloud/v2/payments/sessions',
    headers=headers,
    json={
        'amount': 2999,
        'currency': 'USD',
        'description': 'AI Service Subscription'
    }
)
```

## Testing

### Test Cards
For sandbox testing, use these test card numbers:
- **Visa:** 4242424242424242
- **Mastercard:** 5555555555554444
- **American Express:** 378282246310005

### Test Scenarios
1. **Successful Payment:** Use valid test card
2. **Declined Payment:** Use 4000000000000002
3. **Insufficient Funds:** Use 4000000000009995
4. **Expired Card:** Use 4000000000000069

## Support

- **Documentation:** https://docs.shora.co
- **API Reference:** https://api.shora.cloud/docs
- **Support Email:** dev@shora.co
- **GitHub Issues:** https://github.com/shoraco/shora-ai-payment-sdk/issues

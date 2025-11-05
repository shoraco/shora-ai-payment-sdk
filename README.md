# Shora AI Payment SDK

Commerce infrastructure for the AI era.

## Quick Start

Install the SDK and start processing payments in under 2 minutes.

```bash
npm install shora-ai-payment-sdk
```

### Get Your API Key

**👉 [Get Your API Key →](https://app.shora.cloud/dashboard/dev/api-management)**

1. Visit [app.shora.cloud](https://app.shora.cloud) and sign up/login
2. Go to **Developer Dashboard** → **API Management**
3. Click **Generate API Key** (one-click, uses your account info)
4. Copy your API key and start coding!

**Need help?** Check our [Developer Documentation](https://developer.shora.cloud)

---

### Alternative: Generate Test Keys (Development Only)

For development and testing, you can use generated API keys:

```bash
# Generate test API keys
node -e "
const crypto = require('crypto');
console.log('Sandbox Key:', 'shora_test_' + crypto.randomBytes(32).toString('base64url'));
console.log('Production Key:', 'shora_live_' + crypto.randomBytes(32).toString('base64url'));
"
```

For production, register a merchant to get official API keys:

```bash
curl -X POST https://api.shora.cloud/merchants/register \
 -H "Content-Type: application/json" \
 -d '{
 "business_name": "Your Store",
 "business_type": "ecommerce",
 "contact_name": "Your Name",
 "contact_email": "your@email.com"
 }'
```

### Basic Usage

```typescript
import ShoraSDK from 'shora-ai-payment-sdk';

// Use your API key from app.shora.cloud
const sdk = new ShoraSDK({
 apiKey: 'your_api_key_from_shora_app', // Get it from app.shora.cloud
 environment: 'production' // or 'sandbox' for testing
});

// Create a payment session
const payment = await sdk.createPaymentSession({
 amount: 100,
 currency: 'TRY',
 description: 'Test payment',
 customer: { email: 'test@example.com' }
});

console.log('Payment created:', payment.id);
```

## What This SDK Does

The Shora AI Payment SDK handles payment processing for modern applications. It provides secure payment sessions, automatic retry logic, and enterprise-grade security features. Built for developers who need reliable payment infrastructure without the complexity.

Core features include payment session management, WooCommerce integration, AES-256 encryption for sensitive data, and comprehensive audit logging. The SDK automatically retries failed requests and includes circuit breaker patterns for production reliability.

## API Key Management

### Development Keys

For development and testing, use generated API keys:

```javascript
// Generate a test API key
const crypto = require('crypto');
const testKey = 'shora_test_' + crypto.randomBytes(32).toString('base64url');
console.log('Test API Key:', testKey);
```

### Production Keys

For production, register a merchant to get official API keys:

```bash
# Register a new merchant
curl -X POST https://api.shora.cloud/merchants/register \
 -H "Content-Type: application/json" \
 -d '{
 "business_name": "Your Store",
 "business_type": "ecommerce",
 "contact_name": "Your Name",
 "contact_email": "your@email.com",
 "contact_phone": "+1-555-0123",
 "address_line1": "123 Main St",
 "city": "Your City",
 "state": "Your State",
 "postal_code": "12345",
 "country": "US"
 }'
```

### API Key Security

- Store API keys in environment variables
- Never commit API keys to version control
- Use different keys for development and production
- Rotate keys regularly for security

```bash
# Environment variables
export SHORA_API_KEY="shora_test_your_key_here"
export SHORA_ENVIRONMENT="sandbox"
```

## Configuration

### BaseUrl Resolution

The SDK resolves the API base URL in the following order:

1. `config.baseUrl` - Explicit baseUrl in SDK configuration (highest priority)
2. `SHORA_API_BASE_URL` - Environment variable
3. Production default - `https://api.shora.cloud` (only for `environment: 'production'`)

**Important:** For `sandbox` or `staging` environments, you **must** provide an explicit `baseUrl` or set `SHORA_API_BASE_URL`. The SDK will throw an error if you attempt to use sandbox/staging without an explicit baseUrl to prevent accidental production calls.

```typescript
// Production (uses default if no baseUrl provided)
const sdk = new ShoraSDK({
  apiKey: 'your-key',
  environment: 'production'
});

// Sandbox requires explicit baseUrl
const sandboxSdk = new ShoraSDK({
  apiKey: 'your-key',
  environment: 'sandbox',
  baseUrl: 'https://sandbox.api.shora.cloud' // Required!
});

// Or use environment variable
process.env.SHORA_API_BASE_URL = 'https://sandbox.api.shora.cloud';
const sandboxSdk2 = new ShoraSDK({
  apiKey: 'your-key',
  environment: 'sandbox'
});
```

### Configuration
The SDK accepts a simple configuration object:

```typescript
interface ShoraConfig {
 apiKey: string; // Your Shora API key
 baseUrl?: string; // Custom API endpoint
 environment?: 'sandbox' | 'production';
 timeout?: number; // Request timeout in ms
 tenantId?: string; // Multi-tenant support
 encryptionKey?: string; // AES-256 encryption key
 enableAuditLogging?: boolean; // Enable audit logs
 auditLogEndpoint?: string; // Custom audit endpoint
}
```

## Payment Processing

Create payment sessions and process payments with automatic retry logic:

```typescript
// Create a payment session
const session = await sdk.createPaymentSession({
 amount: 250,
 currency: 'TRY',
 description: 'Product purchase',
 customer: { email: 'customer@example.com' }
});

// Process the payment
const result = await sdk.processPayment(session.paymentId, 'card', 'tok_123');
```

## WooCommerce Integration

For e-commerce applications, use the ACP checkout method:

```typescript
const checkout = await sdk.payWithACP({
 woo_product_id: 123,
 amount: 99.99,
 currency: 'USD',
 customer_email: 'customer@store.com',
 order_id: 'WC-12345'
});

// Redirect user to checkout.checkout_url
```

## Security Features

The SDK includes enterprise-grade security features:

```typescript
// Encrypt sensitive tokens
const encrypted = sdk.encryptToken('sensitive-token');
const decrypted = sdk.decryptToken(encrypted);

// Generate secure payment tokens
const paymentToken = sdk.generateSecurePaymentToken({
 amount: 100,
 currency: 'TRY',
 userId: 'user_123'
});

// Audit logging
sdk.logAudit('payment_created', 'Payment session created', 'session_123');
const logs = sdk.getAuditLogs('2024-01-01', '2024-12-31');
```

## Error Handling

The SDK provides clear error handling with automatic retries:

```typescript
try {
 const payment = await sdk.createPaymentSession(request);
 console.log('Success:', payment.paymentId);
} catch (error) {
 if (error instanceof ShoraError) {
 console.log('Error Code:', error.code);
 console.log('Status:', error.status);
 console.log('Message:', error.message);
 }
}
```

## Troubleshooting

**Import Error?** Check your module type in package.json. For CommonJS use `require('shora-ai-payment-sdk').default`, for ESM use `import ShoraSDK from 'shora-ai-payment-sdk'`.

**Network Issues?** The SDK automatically retries failed requests with exponential backoff. Increase the timeout if needed: `new ShoraSDK({ timeout: 30000 })`.

**TypeScript Issues?** Install types with `npm install @types/node` and use proper imports: `import ShoraSDK, { PaymentRequest } from 'shora-ai-payment-sdk'`.

## Testing

Run the test suite to verify everything works:

```bash
npm test
```

For load testing with k6:

```bash
npm run test:load
```

## Development

Build the SDK from source:

```bash
npm install
npm run build
npm run lint
```

## Performance

The SDK is optimized for production use with automatic retry logic, circuit breaker patterns, and in-memory caching. It handles 1000+ requests per second and includes comprehensive error recovery mechanisms.

## Production Optimized

This SDK has been optimized for production use with a clean dist folder, core payment functionality only, and enterprise-ready security features. The bundle size is kept minimal at 144K total.

## Troubleshooting

### Common Issues

**API Key Errors**
```javascript
// Error: Invalid API key
// Solution: Check your API key format
const sdk = new ShoraSDK({
 apiKey: 'shora_test_your_key_here', // Must start with 'shora_test_' or 'shora_live_'
 environment: 'sandbox'
});
```

**Connection Errors**
```javascript
// Error: Request failed with status code 404
// Solution: Check your base URL
const sdk = new ShoraSDK({
 apiKey: 'your-key',
 baseUrl: 'https://api.shora.cloud', // Use correct API endpoint
 environment: 'sandbox'
});
```

**Payment Endpoint Errors**
```javascript
// Error: Payment session creation failed
// Solution: Ensure merchant registration is complete
// For development, use generated API keys
// For production, register a merchant first
```

### Debug Mode

Enable debug logging to troubleshoot issues:

```javascript
const sdk = new ShoraSDK({
 apiKey: 'your-key',
 environment: 'sandbox',
 debug: true // Enable debug logging
});
```

### Health Check

Always check API health before processing payments:

```javascript
const health = await sdk.healthCheck();
console.log('API Status:', health.status);
console.log('Database:', health.database);
console.log('Redis:', health.redis);
```

## Community & Feedback

We believe the SDK grows stronger with community input:

- **Join our Reddit community**: [r/shora](https://www.reddit.com/r/shora/) - Get help, share ideas, and connect with other developers
- **Star the repository** and follow updates at [github.com/shoraco/shora-ai-payment-sdk](https://github.com/shoraco/shora-ai-payment-sdk)
- **Share improvements** by opening pull requests—check the open issues or start a discussion if you need guidance
- **Every installation** triggers a friendly reminder to send feedback; you can respond by filing an issue, starting a GitHub Discussion, or emailing [dev@shora.co](mailto:dev@shora.co)
- **Tell us how you are using the SDK** so we can feature your use-case and shape the roadmap together

## Performance

The SDK is optimized for production use with automatic retry logic, circuit breaker patterns, and in-memory caching. It handles 1000+ requests per second and includes comprehensive error recovery mechanisms.

## Production Optimized

This SDK has been optimized for production use with a clean dist folder, core payment functionality only, and enterprise-ready security features. The bundle size is kept minimal at 144K total.

## License

MIT

## Support

- **Documentation**: [developer.shora.cloud](https://developer.shora.cloud)
- **Developer Panel**: [app.shora.cloud](https://app.shora.cloud)
- **Community**: [Reddit r/shora](https://www.reddit.com/r/shora/)
- **Issues**: [GitHub Issues](https://github.com/shoraco/shora-ai-payment-sdk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/shoraco/shora-ai-payment-sdk/discussions)
- **Email**: [dev@shora.co](mailto:dev@shora.co)
- **Website**: [shora.co](https://shora.co)

The SDK is designed for developer productivity with automatic retry logic, clear error messages, and comprehensive TypeScript support. Get started in 2 minutes and scale to production with confidence.
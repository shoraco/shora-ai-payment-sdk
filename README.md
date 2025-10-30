# Shora AI Payment SDK

Commerce infrastructure for the AI era.

## Quick Start

Install the SDK and start processing payments in under 2 minutes.

```bash
npm install shora-ai-payment-sdk
```

```typescript
import ShoraSDK from 'shora-ai-payment-sdk';

const sdk = new ShoraSDK({
  apiKey: 'your-api-key',
  environment: 'sandbox'
});

// Create a payment session
const payment = await sdk.createPaymentSession({
  amount: 100,
  currency: 'TRY',
  description: 'Test payment',
  customer: { email: 'test@example.com' }
});

console.log('Payment created:', payment.paymentId);
```

## What This SDK Does

The Shora AI Payment SDK handles payment processing for modern applications. It provides secure payment sessions, automatic retry logic, and enterprise-grade security features. Built for developers who need reliable payment infrastructure without the complexity.

Core features include payment session management, WooCommerce integration, AES-256 encryption for sensitive data, and comprehensive audit logging. The SDK automatically retries failed requests and includes circuit breaker patterns for production reliability.

## Configuration

The SDK accepts a simple configuration object:

```typescript
interface ShoraConfig {
  apiKey: string;                    // Your Shora API key
  baseUrl?: string;                  // Custom API endpoint
  environment?: 'sandbox' | 'production';
  timeout?: number;                  // Request timeout in ms
  tenantId?: string;                 // Multi-tenant support
  encryptionKey?: string;            // AES-256 encryption key
  enableAuditLogging?: boolean;      // Enable audit logs
  auditLogEndpoint?: string;         // Custom audit endpoint
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

## Community & Feedback

We believe the SDK grows stronger with community input:

- ⭐️ Star the repository and follow updates at [github.com/shoraco/shora-ai-payment-sdk](https://github.com/shoraco/shora-ai-payment-sdk).
- 🛠️ Share improvements by opening pull requests—check the open issues or start a discussion if you need guidance.
- 💬 Every installation triggers a friendly reminder to send feedback; you can respond by filing an issue, starting a GitHub Discussion, or emailing [dev@shora.co](mailto:dev@shora.co).
- 📣 Tell us how you are using the SDK so we can feature your use-case and shape the roadmap together.

## Performance

The SDK is optimized for production use with automatic retry logic, circuit breaker patterns, and in-memory caching. It handles 1000+ requests per second and includes comprehensive error recovery mechanisms.

## Production Optimized

This SDK has been optimized for production use with a clean dist folder, core payment functionality only, and enterprise-ready security features. The bundle size is kept minimal at 144K total.

## License

MIT

## Support

- Documentation: [developer.shora.cloud](https://developer.shora.cloud)
- Developer Panel: [app.shora.cloud](https://app.shora.cloud)
- Marketing Site: [shora.co](https://shora.co)
- Issues: [GitHub Issues](https://github.com/shoraco/shora-ai-payment-sdk/issues)

The SDK is designed for developer productivity with automatic retry logic, clear error messages, and comprehensive TypeScript support. Get started in 2 minutes and scale to production with confidence.
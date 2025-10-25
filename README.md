# 🚀 Shora AI Payment SDK

<div align="center">

**Commerce infrastructure for the AI era**

[![npm version](https://badge.fury.io/js/shora-ai-payment-sdk.svg)](https://www.npmjs.com/package/shora-ai-payment-sdk)
[![GitHub stars](https://img.shields.io/github/stars/shoraco/shora-ai-payment-sdk.svg)](https://github.com/shoraco/shora-ai-payment-sdk/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**The first open-source payment SDK designed specifically for AI agents and chatbots**

[📖 Documentation](https://docs.shora.co) • [🎮 Live Demo](https://demo.shora.co) • [💬 Discord](https://discord.gg/shora) • [🐦 Twitter](https://twitter.com/shora_co)

</div>

## ⚡ Quickstart (30 seconds)

```bash
# Install the SDK
npm install shora-ai-payment-sdk

# Or with yarn
yarn add shora-ai-payment-sdk
```

```javascript
import ShoraSDK from 'shora-ai-payment-sdk';

// Initialize with your API key
const shora = new ShoraSDK({
  apiKey: 'your_api_key_here',
  environment: 'sandbox' // or 'production'
});

// Create a payment session for your AI agent
const session = await shora.createPaymentSession({
  amount: 2999, // $29.99 in cents
  currency: 'USD',
  description: 'AI Agent Subscription',
  customer: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});

console.log('Payment URL:', session.payment_url);
```

## 🎮 Live Demo

**Try it now:** [demo.shora.co](https://demo.shora.co)

- 🤖 **AI Chatbot Integration** - See how AI agents process payments
- 💳 **Real Payment Flow** - Complete checkout experience
- 🔧 **Developer Tools** - API explorer and code examples
- 📊 **Analytics Dashboard** - Transaction monitoring

## 🚀 Why Shora?

<div align="center">

| Feature | Traditional SDKs | **Shora SDK** |
|---------|------------------|---------------|
| AI Agent Ready | ❌ | ✅ **Built for AI** |
| Mandate Management | ❌ | ✅ **Agent Authorization** |
| Token-based Payments | ❌ | ✅ **Secure Tokens** |
| Real-time Webhooks | ❌ | ✅ **Instant Notifications** |
| Multi-currency | Limited | ✅ **Global Support** |
| Open Source | ❌ | ✅ **MIT License** |

</div>

## ✨ Features

### 🤖 AI Agent Features
- **Mandate Management**: Create, activate, and cancel payment mandates for AI agents
- **Token Generation**: Secure payment tokens with TTL for agent transactions
- **Checkout Sessions**: Complete shopping cart management for AI agents
- **Payment Processing**: Token-based payments with PSP routing and failover
- **Agent Integration**: Direct integration with AI agents and chatbots

### 🔒 Enterprise Features
- **Multi-tenant Support**: Isolated data per organization
- **Audit Logs**: Complete transaction audit trail
- **Custom Webhooks**: Real-time payment event notifications
- **Rate Limiting**: Tier-based API access control
- **OAuth2 + API Key**: Hybrid authentication system

### 🌍 Global Support
- **Multi-currency**: USD, EUR, TRY, GBP, and more
- **Turkish PSPs**: PayTR, İyzico, Moka United integration
- **Global PSPs**: Stripe, PayPal, Adyen support
- **Real-time**: Instant payment confirmations

### Enterprise Features
- **Security**: JWT authentication, rate limiting, input validation, audit logging
- **High Availability**: Circuit breaker, retry logic, health monitoring, failover
- **Monitoring**: Prometheus metrics, structured logging, performance tracking
- **Testing**: Unit tests, integration tests, load tests, security tests
- **CI/CD**: Automated testing, security scanning, deployment pipelines

## API Endpoints

### Agent Payment Endpoints

- `POST /v2/agents/mandates` - Create payment mandate
- `POST /v2/agents/tokens` - Generate payment token
- `POST /v2/agents/checkout-sessions` - Create checkout session
- `POST /v2/agents/pay` - Process payment
- `GET /v2/agents/mandates/{mandate_id}` - Get mandate details
- `GET /v2/agents/payments/{payment_id}` - Get payment details

### Example Usage

```javascript
// Create a payment mandate for an AI agent
const mandate = await shora.agents.createMandate({
  agent_id: 'chatbot-123',
  max_amount: 1000.00,
  currency: 'TRY',
  expires_at: '2025-12-31T23:59:59Z'
});

// Generate a payment token
const token = await shora.agents.generateToken({
  mandate_id: mandate.id,
  amount: 150.00,
  currency: 'TRY'
});

// Process payment
const payment = await shora.agents.pay({
  token: token.value,
  amount: 150.00,
  currency: 'TRY'
});
```

## Demo

The included demo shows a complete AI agent payment flow:

1. **Chat Interface**: User interacts with AI agent
2. **Payment Intent**: Agent creates payment intent
3. **Mandate Creation**: Agent creates payment mandate
4. **Token Generation**: Secure payment token generated
5. **Payment Processing**: Payment processed via token
6. **Confirmation**: Payment confirmed and webhook sent

Run the demo:
```bash
npm run demo
```

## Integration with Shora Core

This SDK is designed to work with [Shora Core](https://shora.co) - the complete payment infrastructure platform.

### Shora Core Features

- **AI-Ready Feed**: Product catalog integration for AI agents
- **ACP-Ready Checkout**: LLM-compatible checkout structure
- **PSP Aggregator**: Single API for all payment providers
- **Turkish PSP Support**: PayTR, İyzico, Papara, bank POS systems
- **Global Distribution**: Cloudflare Workers for worldwide access

### Pricing

- **Freemium**: $0/month, 0.5% transaction fee, 100 transactions/month
- **Pro**: $99/month, 0.5% transaction fee, 10K transactions/month  
- **Enterprise**: $499/month, 0.3% transaction fee, 100K transactions/month

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Agent      │───▶│  Shora SDK     │───▶│  Shora Core    │
│   (Chatbot)     │    │                 │    │  (Payment      │
│                 │    │  Mandate        │    │   Processing)   │
│                 │    │  Management     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Turkish PSPs  │
                       │   (PayTR,       │
                       │    İyzico,      │
                       │    Papara)      │
                       └─────────────────┘
```

## Security

- **Token-based Authentication**: Secure payment tokens with TTL
- **Mandate Validation**: AI agent authorization verification
- **PCI Compliance**: No PCI data exposure
- **Rate Limiting**: Built-in request rate limiting
- **Webhook Security**: HMAC signature verification

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Shora Core API access

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Run demo
npm run demo
```

### Enterprise Development

```bash
# Run all tests
npm run test

# Run load tests
npm run test:load

# Run security tests
npm run test:security

# Run linting
npm run lint

# Build for production
npm run build
```

### Environment Variables

```bash
SHORA_API_KEY=your_api_key_here
SHORA_BASE_URL=https://api.shora.cloud
SHORA_WEBHOOK_SECRET=your_webhook_secret
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [https://docs.shora.co](https://docs.shora.co)
- **API Reference**: [https://api.shora.cloud/docs](https://api.shora.cloud/docs)
- **Support Email**: dev@shora.co
- **GitHub Issues**: [https://github.com/shora-ai/shora-ai-payment-sdk/issues](https://github.com/shora-ai/shora-ai-payment-sdk/issues)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Roadmap

- [ ] Webhook handling for payment events
- [ ] Multi-currency support
- [ ] Advanced fraud detection
- [ ] Real-time payment status updates
- [ ] Integration with popular AI frameworks

---

**Shora AI Payment SDK** - Commerce infrastructure for the AI era

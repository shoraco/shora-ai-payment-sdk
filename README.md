# Shora AI Payment SDK

<div align="center">

**Commerce infrastructure for the AI era**

[![npm version](https://badge.fury.io/js/shora-ai-payment-sdk.svg)](https://www.npmjs.com/package/shora-ai-payment-sdk)
[![npm downloads](https://img.shields.io/npm/dm/shora-ai-payment-sdk.svg)](https://www.npmjs.com/package/shora-ai-payment-sdk)
[![GitHub stars](https://img.shields.io/github/stars/shoraco/shora-ai-payment-sdk.svg)](https://github.com/shoraco/shora-ai-payment-sdk/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![CI](https://github.com/shoraco/shora-ai-payment-sdk/workflows/CI/badge.svg)](https://github.com/shoraco/shora-ai-payment-sdk/actions)

**The first open-source payment SDK designed specifically for AI agents and chatbots - ACP Compatible**

[Documentation](https://docs.shora.co) • [NPM Package](https://www.npmjs.com/package/shora-ai-payment-sdk) • [Discord](https://discord.gg/shora) • [X](https://x.com/shora_co)

</div>

## Quick Start

```bash
# Install the SDK
npm install shora-ai-payment-sdk

# Or with yarn
yarn add shora-ai-payment-sdk
```

```javascript
import ShoraSDK from 'shora-ai-payment-sdk';

// Initialize the SDK
const shora = new ShoraSDK({
  apiKey: process.env.SHORA_API_KEY,
  environment: 'sandbox'
});

// Create a payment session
const session = await shora.createPaymentSession({
  amount: 2999,
  currency: 'USD',
  description: 'AI Service Subscription',
  customer: {
    email: 'customer@example.com',
    name: 'John Doe'
  }
});

console.log('Checkout URL:', session.payment_url);
```

## Installation

```bash
npm install shora-ai-payment-sdk
# or
yarn add shora-ai-payment-sdk
```

```javascript
import ShoraSDK from 'shora-ai-payment-sdk';

const shora = new ShoraSDK({
  apiKey: process.env.SHORA_API_KEY,
  environment: 'sandbox'
});
```

## Demo

Run the included demo to see the SDK in action:

```bash
git clone https://github.com/shoraco/shora-ai-payment-sdk
cd shora-ai-payment-sdk
npm install
npm run demo
```

The demo includes:
- AI chatbot payment integration
- Real payment processing simulation
- Webhook event handling

## Why Choose Shora?

Built specifically for the AI era, Shora provides everything you need to integrate payments into AI agents and chatbots.

| Feature | Traditional SDKs | Shora SDK |
|---------|------------------|-----------|
| AI Agent Ready | No | Yes |
| Mandate Management | No | Yes |
| Token-based Payments | No | Yes |
| Real-time Webhooks | No | Yes |
| Multi-currency | Limited | Full Support |
| Open Source | No | MIT License |

## Features

### ACP (Agentic Commerce Protocol) Compatible
- Full compliance with OpenAI/Stripe ACP specification
- Direct integration with ChatGPT and other AI agents
- Secure payment token sharing between buyers and businesses
- Merchants maintain customer relationships and product control

### AI Agent Features
- Create, activate, and cancel payment mandates for AI agents
- Secure payment tokens with TTL for agent transactions
- Complete shopping cart management for AI agents
- Token-based payments with PSP routing and failover
- Direct integration with AI agents and chatbots

### Enterprise Features
- Multi-tenant support with isolated data per organization
- Complete transaction audit trail
- Real-time payment event notifications
- Tier-based API access control
- OAuth2 + API key hybrid authentication

### Global Support
- Multi-currency support for USD, EUR, TRY, GBP, and more
- Turkish PSP integration with PayTR, İyzico, Moka United
- Global PSP support including Stripe, PayPal, Adyen
- Instant payment confirmations

## Use Cases

### ACP Integration
```javascript
// ACP-compatible checkout for AI agents
const checkout = await shora.createACPCheckout({
  amount: 150.00,
  currency: 'USD',
  description: 'AI Service Subscription',
  agent_id: 'chatgpt-user-123',
  business_id: 'merchant-456',
  product_id: 'service-premium',
  quantity: 1,
  customer: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});
```

### AI Chatbots & Agents
```javascript
// AI agent processes payment
const payment = await shora.agents.pay({
  token: agentToken,
  amount: 150.00,
  currency: 'USD',
  description: 'AI Service Subscription'
});
```

### E-commerce Integration
```javascript
// E-commerce checkout
const session = await shora.createPaymentSession({
  amount: 9999, // $99.99
  currency: 'USD',
  customer: { email: 'customer@example.com' },
  items: [
    { name: 'Premium Plan', price: 9999, quantity: 1 }
  ]
});
```

### Subscription Management
```javascript
// Recurring payments
const mandate = await shora.agents.createMandate({
  agent_id: 'subscription-bot',
  max_amount: 5000.00,
  currency: 'USD',
  expires_at: '2025-12-31T23:59:59Z'
});
```
## Getting Started

### 1. Get Your API Key

**Free Tier:** [Get started for free](https://app.shora.cloud/signup)
- 100 transactions/month
- Sandbox environment
- Basic support

**Pro Tier:** [Upgrade to Pro](https://app.shora.cloud/pricing)
- 10,000 transactions/month
- Production environment
- Priority support

### 2. Install the SDK

```bash
npm install shora-ai-payment-sdk
```

### 3. Initialize and Start Building

```javascript
import ShoraSDK from 'shora-ai-payment-sdk';

const shora = new ShoraSDK({
  apiKey: process.env.SHORA_API_KEY,
  environment: 'sandbox'
});

// Your AI agent is ready to process payments!
```

## API Reference

### Agent Payment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v2/agents/mandates` | POST | Create payment mandate |
| `/v2/agents/tokens` | POST | Generate payment token |
| `/v2/agents/checkout-sessions` | POST | Create checkout session |
| `/v2/agents/pay` | POST | Process payment |
| `/v2/agents/mandates/{id}` | GET | Get mandate details |
| `/v2/agents/payments/{id}` | GET | Get payment details |

### Payment Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v2/payments/sessions` | POST | Create payment session |
| `/v2/payments/process` | POST | Process payment |
| `/v2/payments/refund` | POST | Refund payment |
| `/v2/transactions/{id}` | GET | Get transaction details |
| `/v2/transactions` | GET | List transactions |

### Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v2/webhooks` | POST | Create webhook |
| `/v2/webhooks/{id}/test` | POST | Test webhook |
| `/v2/webhooks/events` | GET | List webhook events |

## Example Usage

### Basic Payment Flow

```javascript
// 1. Create payment session
const session = await shora.createPaymentSession({
  amount: 2999, // $29.99
  currency: 'USD',
  description: 'AI Service Subscription',
  customer: {
    email: 'user@example.com',
    name: 'John Doe'
  }
});

// 2. Process payment
const payment = await shora.processPayment({
  sessionId: session.id,
  paymentMethod: 'card',
  cardToken: 'tok_1234567890'
});

// 3. Handle webhook
app.post('/webhook', (req, res) => {
  const event = req.body;
  if (event.type === 'payment.completed') {
    console.log('Payment completed:', event.data);
  }
});
```

### AI Agent Integration

```javascript
// AI agent creates mandate
const mandate = await shora.agents.createMandate({
  agent_id: 'chatbot-123',
  max_amount: 1000.00,
  currency: 'USD',
  expires_at: '2025-12-31T23:59:59Z'
});

// Generate secure token
const token = await shora.agents.generateToken({
  mandate_id: mandate.id,
  amount: 150.00,
  currency: 'USD'
});

// Process payment with token
const payment = await shora.agents.pay({
  token: token.value,
  amount: 150.00,
  currency: 'USD'
});
```

## Demo & Examples

### Live Demo
**Try it now:** [demo.shora.co](https://demo.shora.co)

### Local Demo
```bash
# Clone the repository
git clone https://github.com/shoraco/shora-ai-payment-sdk
cd shora-ai-payment-sdk

# Install dependencies
npm install

# Run the demo
npm run demo
```

### Demo Features
1. AI Chatbot - Interactive payment flow
2. Payment Processing - Real payment simulation
3. Webhook Handling - Real-time notifications

## Enterprise Features

### Advanced Security
- **OAuth2 + API Key**: Hybrid authentication system
- **Multi-tenant**: Isolated data per organization
- **Audit Logs**: Complete transaction audit trail
- **Rate Limiting**: Tier-based API access control

### Analytics & Monitoring
- **Real-time Dashboard**: [app.shora.cloud](https://app.shora.cloud)
- **Transaction Analytics**: Revenue tracking and insights
- **Webhook Management**: Custom event notifications

### Global Infrastructure
- **Multi-currency**: USD, EUR, TRY, GBP, and more
- **Turkish PSPs**: PayTR, İyzico, Moka United integration
- **Global PSPs**: Stripe, PayPal, Adyen support
- **Cloudflare CDN**: Worldwide low-latency access

## Pricing

<div align="center">

| Plan | Price | Transactions | Features |
|------|-------|-------------|----------|
| **Free** | $0/month | 100/month | Sandbox, Basic Support |
| **Pro** | $99/month | 10,000/month | Production, Priority Support, Analytics |
| **Enterprise** | $499/month | 100,000/month | Custom Integration, SLA, Dedicated Support |

</div>

**Get started:** [app.shora.cloud/signup](https://app.shora.cloud/signup)

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
                       │    Moka)      │
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

## Community & Support

### Resources
- **Documentation**: [docs.shora.co](https://docs.shora.co)
- **Discord**: [discord.gg/shora](https://discord.gg/shora)
- **Twitter**: [@shora_co](https://twitter.com/shora_co)

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Support
- **Email**: dev@shora.co
- **GitHub Issues**: [Create an issue](https://github.com/shoraco/shora-ai-payment-sdk/issues)
- **Discord**: [Join our community](https://discord.gg/shora)

---

<div align="center">

**Star this repository if you find it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/shoraco/shora-ai-payment-sdk.svg?style=social&label=Star)](https://github.com/shoraco/shora-ai-payment-sdk/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/shoraco/shora-ai-payment-sdk.svg?style=social&label=Fork)](https://github.com/shoraco/shora-ai-payment-sdk/network)

**Made with love by the Shora Team**

</div>

---

**Shora AI Payment SDK** - Commerce infrastructure for the AI era

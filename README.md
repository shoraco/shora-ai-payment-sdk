# Shora AI Payment SDK

**Commerce infrastructure for the AI era**

Advanced payment processing infrastructure for AI agents with mandate management, token generation, and secure checkout sessions.

## Quickstart

### 1. Clone and Install

```bash
git clone https://github.com/shoraco/shora-ai-payment-sdk
cd shora-ai-payment-sdk
npm install
```

### 2. Test Agent Transaction

```bash
# Start the demo server
npm run dev

# In another terminal, run the agent demo
node demos/agent_demo_next.js
```

### 3. Full SDK Integration

For production use, integrate with [Shora Core](https://shora.co) - the complete payment infrastructure platform.

## Features

- **Mandate Management**: Create, activate, and cancel payment mandates for AI agents
- **Token Generation**: Secure payment tokens with TTL for agent transactions  
- **Checkout Sessions**: Complete shopping cart management for AI agents
- **Payment Processing**: Token-based payments with PSP routing and failover
- **Agent Integration**: Direct integration with AI agents and chatbots

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

# Start development server
npm run dev

# Run tests
npm test

# Run demo
npm run demo
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

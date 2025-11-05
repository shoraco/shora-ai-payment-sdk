import { PaymentService } from '../src/payments';
import { AxiosInstance } from 'axios';

describe('PaymentService ACP endpoints', () => {
  let paymentService: PaymentService;
  let mockAxios: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;
    paymentService = new PaymentService(mockAxios);
  });

  test('createCheckoutIntent sends correct request', async () => {
    const mockResponse = {
      data: {
        intent_id: 'intent-123',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        expires_at: '2025-12-31T00:00:00Z',
        created_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await paymentService.createCheckoutIntent({
      amount: 100,
      currency: 'TRY',
      description: 'Test intent',
      buyer: { email: 'test@example.com' },
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/acp/checkout-intent',
      {
        amount: 100,
        currency: 'TRY',
        description: 'Test intent',
        buyer: { email: 'test@example.com' },
      },
      { headers: {} }
    );
    expect(result.intent_id).toBe('intent-123');
  });

  test('createCheckoutIntent includes idempotencyKey header', async () => {
    const mockResponse = {
      data: {
        intent_id: 'intent-123',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        expires_at: '2025-12-31T00:00:00Z',
        created_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    await paymentService.createCheckoutIntent(
      {
        amount: 100,
        currency: 'TRY',
      },
      { idempotencyKey: 'idempotent-123' }
    );

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/acp/checkout-intent',
      { amount: 100, currency: 'TRY' },
      { headers: { 'Idempotency-Key': 'idempotent-123' } }
    );
  });

  test('confirmCheckout sends correct request', async () => {
    const mockResponse = {
      data: {
        id: 'payment-123',
        status: 'completed',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await paymentService.confirmCheckout({
      intent_id: 'intent-123',
      payment_method: 'card',
      delegate_token: 'token-456',
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v1/acp/checkout-confirm',
      {
        intent_id: 'intent-123',
        payment_method: 'card',
        delegate_token: 'token-456',
      },
      { headers: {} }
    );
    expect(result.id).toBe('payment-123');
  });

  test('getPaymentSession calls correct endpoint', async () => {
    const mockResponse = {
      data: {
        id: 'session-123',
        status: 'active',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await paymentService.getPaymentSession('session-123');

    expect(mockAxios.get).toHaveBeenCalledWith('/v2/payments/sessions/session-123');
    expect(result.id).toBe('session-123');
  });

  test('getReceipt calls correct endpoint', async () => {
    const mockResponse = {
      data: {
        receipt_id: 'receipt-123',
        payment_id: 'payment-456',
        amount: 100,
        currency: 'TRY',
        status: 'completed',
        receipt_url: 'https://example.com/receipt',
        created_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await paymentService.getReceipt('receipt-123');

    expect(mockAxios.get).toHaveBeenCalledWith('/v1/acp/receipts/receipt-123');
    expect(result.receipt_id).toBe('receipt-123');
  });

  test('getSupportedMethods calls correct endpoint', async () => {
    const mockResponse = {
      data: {
        payment_methods: [
          {
            type: 'card',
            name: 'Credit Card',
            supported: true,
            currencies: ['TRY', 'USD'],
          },
        ],
      },
    };
    mockAxios.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await paymentService.getSupportedMethods();

    expect(mockAxios.get).toHaveBeenCalledWith('/v1/acp/supported-methods');
    expect(result.payment_methods.length).toBe(1);
    expect(result.payment_methods[0].type).toBe('card');
  });
});


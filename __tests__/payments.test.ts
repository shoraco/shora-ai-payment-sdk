import { PaymentService } from '../src/payments';
import { AxiosInstance } from 'axios';

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockAxios: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;
    paymentService = new PaymentService(mockAxios);
  });

  test('createPaymentSession sends idempotencyKey header when provided', async () => {
    const mockResponse = {
      data: {
        id: 'session-123',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    await paymentService.createPaymentSession(
      {
        amount: 100,
        currency: 'TRY',
      },
      { idempotencyKey: 'test-idempotency-key-123' }
    );

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v2/payments/sessions',
      { amount: 100, currency: 'TRY' },
      { headers: { 'Idempotency-Key': 'test-idempotency-key-123' } }
    );
  });

  test('createPaymentSession does not send idempotencyKey header when not provided', async () => {
    const mockResponse = {
      data: {
        id: 'session-123',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    await paymentService.createPaymentSession({
      amount: 100,
      currency: 'TRY',
    });

    expect(mockAxios.post).toHaveBeenCalledWith(
      '/v2/payments/sessions',
      { amount: 100, currency: 'TRY' },
      { headers: {} }
    );
  });

  test('createPaymentSession does not cache responses', async () => {
    const mockResponse1 = {
      data: {
        id: 'session-1',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    const mockResponse2 = {
      data: {
        id: 'session-2',
        status: 'pending',
        amount: 100,
        currency: 'TRY',
        created_at: '2025-01-30T00:00:00Z',
        updated_at: '2025-01-30T00:00:00Z',
      },
    };
    mockAxios.post = jest.fn()
      .mockResolvedValueOnce(mockResponse1)
      .mockResolvedValueOnce(mockResponse2);

    const request = { amount: 100, currency: 'TRY' };
    const result1 = await paymentService.createPaymentSession(request);
    const result2 = await paymentService.createPaymentSession(request);

    expect(result1.id).toBe('session-1');
    expect(result2.id).toBe('session-2');
    expect(mockAxios.post).toHaveBeenCalledTimes(2);
  });
});


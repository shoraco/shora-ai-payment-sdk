import { jest } from '@jest/globals';
import axios from 'axios';
import ShoraSDK from '../src/index';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ShoraSDK Payments', () => {
  let sdk: ShoraSDK;
  const mockConfig = {
    apiKey: 'test-api-key',
    environment: 'sandbox' as const,
    baseUrl: 'https://api.sandbox.shora.cloud'
  };

  beforeEach(() => {
    sdk = new ShoraSDK(mockConfig);
    jest.clearAllMocks();
  });

  describe('createPaymentSession', () => {
    it('should create payment session successfully', async () => {
      const mockResponse = {
        data: {
          id: 'session_123',
          status: 'pending',
          amount: 100,
          currency: 'USD',
          payment_url: 'https://checkout.shora.cloud/session_123',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const paymentRequest = {
        amount: 100,
        currency: 'USD',
        description: 'Test payment',
        customer: {
          email: 'test@example.com',
          name: 'Test User'
        }
      };

      const result = await sdk.createPaymentSession(paymentRequest);

      expect(result).toEqual(mockResponse.data);
      expect(result.id).toBe('session_123');
      expect(result.status).toBe('pending');
      expect(result.amount).toBe(100);
    });

    it('should handle payment session creation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid request' },
          status: 400
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const paymentRequest = {
        amount: 100,
        currency: 'USD'
      };

      await expect(sdk.createPaymentSession(paymentRequest)).rejects.toThrow('Failed to create payment session: Invalid request');
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const mockResponse = {
        data: {
          id: 'payment_123',
          status: 'completed',
          amount: 100,
          currency: 'USD',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const result = await sdk.processPayment('session_123', 'card', 'token_123');

      expect(result).toEqual(mockResponse.data);
      expect(result.status).toBe('completed');
    });
  });

  describe('createACPCheckout', () => {
    it('should create ACP checkout successfully', async () => {
      const mockResponse = {
        data: {
          checkout_id: 'checkout_123',
          status: 'pending',
          amount: 100,
          currency: 'USD',
          checkout_url: 'https://checkout.shora.cloud/checkout_123',
          expires_at: '2024-01-02T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          agent_id: 'agent_123',
          business_id: 'business_123'
        }
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const acpRequest = {
        amount: 100,
        currency: 'USD',
        description: 'ACP Test',
        agent_id: 'agent_123',
        business_id: 'business_123'
      };

      const result = await sdk.createACPCheckout(acpRequest);

      expect(result).toEqual(mockResponse.data);
      expect(result.checkout_id).toBe('checkout_123');
      expect(result.agent_id).toBe('agent_123');
    });
  });

  describe('healthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockResponse = {
        data: { status: 'healthy' }
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockResolvedValue(mockResponse),
        post: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const result = await sdk.healthCheck();

      expect(result).toEqual({ status: 'healthy' });
    });

    it('should handle health check error', async () => {
      const mockError = {
        response: {
          data: { message: 'Service unavailable' },
          status: 503
        }
      };

      mockedAxios.create.mockReturnValue({
        get: jest.fn().mockRejectedValue(mockError),
        post: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      await expect(sdk.healthCheck()).rejects.toThrow('Health check failed: Service unavailable');
    });
  });
});

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
          amount: 5000,
          currency: 'TRY',
          payment_url: 'https://payment.url',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      const paymentRequest = {
        amount: 5000,
        currency: 'TRY',
        customer: {
          email: 'test@example.com'
        }
      };

      const result = await sdk.createPaymentSession(paymentRequest);

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle payment session creation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid payment request' },
          status: 400
        }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn().mockRejectedValue(mockError),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      const paymentRequest = {
        amount: 5000,
        currency: 'TRY',
        customer: {
          email: 'test@example.com'
        }
      };

      await expect(sdk.createPaymentSession(paymentRequest)).rejects.toThrow();
    });
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const mockResponse = {
        data: {
          id: 'payment_123',
          status: 'completed',
          amount: 5000,
          currency: 'TRY',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      const result = await sdk.processPayment('session_123', 'card', 'card_token_abc');

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createACPCheckout', () => {
    it('should create ACP checkout successfully', async () => {
      const mockResponse = {
        data: {
          checkout_id: 'acp_checkout_123',
          status: 'pending',
          amount: 100,
          currency: 'USD',
          checkout_url: 'https://checkout.url',
          expires_at: '2024-12-31T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          agent_id: 'agent_1',
          business_id: 'business_1'
        }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      const acpRequest = {
        amount: 100,
        currency: 'USD',
        agent_id: 'agent_1',
        business_id: 'business_1'
      };

      const result = await sdk.createACPCheckout(acpRequest);

      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('healthCheck', () => {
    it('should perform health check successfully', async () => {
      const mockResponse = {
        data: { status: 'ok' }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn(),
        get: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      const result = await sdk.healthCheck();

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle health check error', async () => {
      const mockError = {
        response: {
          data: { message: 'Service Unavailable' },
          status: 503
        }
      };

      (mockedAxios.create as jest.Mock).mockReturnValue({
        post: jest.fn(),
        get: jest.fn().mockRejectedValue(mockError),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      });

      await expect(sdk.healthCheck()).rejects.toThrow();
    });
  });
});
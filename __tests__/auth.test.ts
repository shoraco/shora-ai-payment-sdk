import axios from 'axios';
import ShoraSDK from '../src/index';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ShoraSDK Authentication', () => {
  let sdk: ShoraSDK;
  const mockConfig = {
    apiKey: 'test-api-key',
    environment: 'sandbox' as const
  };

  beforeEach(() => {
    sdk = new ShoraSDK(mockConfig);
    jest.clearAllMocks();
  });

  describe('Agent Mandate Creation', () => {
    it('should create mandate successfully', async () => {
      const mockResponse = {
        data: {
          id: 'mandate_123',
          agent_id: 'agent_123',
          max_amount: 1000,
          currency: 'USD',
          status: 'active',
          expires_at: '2024-12-31T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z'
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

      const mandateRequest = {
        agent_id: 'agent_123',
        max_amount: 1000,
        currency: 'USD',
        expires_at: '2024-12-31T23:59:59Z'
      };

      const result = await sdk.agents.createMandate(mandateRequest);

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle mandate creation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid mandate request' },
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

      const mandateRequest = {
        agent_id: 'agent_123',
        max_amount: 1000,
        currency: 'USD',
        expires_at: '2024-12-31T23:59:59Z'
      };

      await expect(sdk.agents.createMandate(mandateRequest)).rejects.toThrow();
    });
  });

  describe('Token Generation', () => {
    it('should generate token successfully', async () => {
      const mockResponse = {
        data: {
          id: 'token_456',
          mandate_id: 'mandate_123',
          value: 'generated_token_value',
          expires_at: '2024-12-31T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z'
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

      const tokenRequest = {
        mandate_id: 'mandate_123',
        amount: 500,
        currency: 'USD'
      };

      const result = await sdk.agents.generateToken(tokenRequest);

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle token generation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid token request' },
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

      const tokenRequest = {
        mandate_id: 'mandate_123',
        amount: 500,
        currency: 'USD'
      };

      await expect(sdk.agents.generateToken(tokenRequest)).rejects.toThrow();
    });
  });

  describe('Agent Payment', () => {
    it('should process agent payment successfully', async () => {
      const mockResponse = {
        data: {
          id: 'agent_payment_789',
          status: 'completed',
          amount: 200,
          currency: 'USD',
          created_at: '2024-01-01T00:00:00Z'
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
        token: 'generated_token_value',
        amount: 200,
        currency: 'USD'
      };

      const result = await sdk.agents.pay(paymentRequest);

      expect(result).toEqual(mockResponse.data);
    });

    it('should handle agent payment error', async () => {
      const mockError = {
        response: {
          data: { message: 'Agent payment failed' },
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
        token: 'generated_token_value',
        amount: 200,
        currency: 'USD'
      };

      await expect(sdk.agents.pay(paymentRequest)).rejects.toThrow();
    });
  });
});
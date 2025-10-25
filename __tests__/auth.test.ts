import { jest } from '@jest/globals';
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

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        get: jest.fn(),
        interceptors: {
          response: {
            use: jest.fn()
          }
        }
      } as any);

      const mandateRequest = {
        agent_id: 'agent_123',
        max_amount: 1000,
        currency: 'USD',
        expires_at: '2024-12-31T23:59:59Z',
        description: 'Test mandate'
      };

      const result = await sdk.agents.createMandate(mandateRequest);

      expect(result).toEqual(mockResponse.data);
      expect(result.id).toBe('mandate_123');
      expect(result.status).toBe('active');
      expect(result.max_amount).toBe(1000);
    });

    it('should handle mandate creation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid agent ID' },
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

      const mandateRequest = {
        agent_id: 'invalid_agent',
        max_amount: 1000,
        currency: 'USD',
        expires_at: '2024-12-31T23:59:59Z'
      };

      await expect(sdk.agents.createMandate(mandateRequest)).rejects.toThrow('Failed to create mandate: Invalid agent ID');
    });
  });

  describe('Token Generation', () => {
    it('should generate token successfully', async () => {
      const mockResponse = {
        data: {
          id: 'token_123',
          mandate_id: 'mandate_123',
          value: 'secure_token_value',
          expires_at: '2024-01-02T00:00:00Z',
          created_at: '2024-01-01T00:00:00Z'
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

      const tokenRequest = {
        mandate_id: 'mandate_123',
        amount: 100,
        currency: 'USD',
        description: 'Test token'
      };

      const result = await sdk.agents.generateToken(tokenRequest);

      expect(result).toEqual(mockResponse.data);
      expect(result.id).toBe('token_123');
      expect(result.value).toBe('secure_token_value');
    });

    it('should handle token generation error', async () => {
      const mockError = {
        response: {
          data: { message: 'Mandate not found' },
          status: 404
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

      const tokenRequest = {
        mandate_id: 'invalid_mandate',
        amount: 100,
        currency: 'USD'
      };

      await expect(sdk.agents.generateToken(tokenRequest)).rejects.toThrow('Failed to generate token: Mandate not found');
    });
  });

  describe('Agent Payment', () => {
    it('should process agent payment successfully', async () => {
      const mockResponse = {
        data: {
          id: 'payment_123',
          status: 'completed',
          amount: 100,
          currency: 'USD',
          created_at: '2024-01-01T00:00:00Z'
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
        token: 'secure_token_value',
        amount: 100,
        currency: 'USD',
        description: 'Agent payment'
      };

      const result = await sdk.agents.pay(paymentRequest);

      expect(result).toEqual(mockResponse.data);
      expect(result.status).toBe('completed');
      expect(result.amount).toBe(100);
    });

    it('should handle agent payment error', async () => {
      const mockError = {
        response: {
          data: { message: 'Invalid token' },
          status: 401
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
        token: 'invalid_token',
        amount: 100,
        currency: 'USD'
      };

      await expect(sdk.agents.pay(paymentRequest)).rejects.toThrow('Failed to process agent payment: Invalid token');
    });
  });
});

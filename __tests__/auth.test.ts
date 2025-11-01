import { AuthService } from '../src/auth';
import { AxiosInstance } from 'axios';

describe('AuthService error handling', () => {
  let authService: AuthService;
  let mockAxios: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;
    authService = new AuthService(mockAxios);
  });

  test('createMandate uses parseError for error handling', async () => {
    const errorResponse = {
      response: {
        status: 400,
        data: { error: 'Invalid mandate' },
      },
    };
    mockAxios.post = jest.fn().mockRejectedValue(errorResponse);

    await expect(authService.createMandate({
      agent_id: 'test-agent',
      max_amount: 100,
      currency: 'TRY',
      expires_at: '2025-12-31T00:00:00Z',
    })).rejects.toThrow();

    expect(mockAxios.post).toHaveBeenCalledWith('/v2/agents/mandates', {
      agent_id: 'test-agent',
      max_amount: 100,
      currency: 'TRY',
      expires_at: '2025-12-31T00:00:00Z',
    });
  });

  test('generateToken uses parseError for error handling', async () => {
    const errorResponse = {
      response: {
        status: 404,
        data: { error: 'Mandate not found' },
      },
    };
    mockAxios.post = jest.fn().mockRejectedValue(errorResponse);

    await expect(authService.generateToken({
      mandate_id: 'invalid-mandate',
      amount: 50,
      currency: 'TRY',
    })).rejects.toThrow();

    expect(mockAxios.post).toHaveBeenCalled();
  });

  test('pay uses parseError for error handling', async () => {
    const errorResponse = {
      response: {
        status: 500,
        data: { error: 'Payment failed' },
      },
    };
    mockAxios.post = jest.fn().mockRejectedValue(errorResponse);

    await expect(authService.pay({
      token: 'test-token',
      amount: 100,
      currency: 'TRY',
    })).rejects.toThrow();

    expect(mockAxios.post).toHaveBeenCalled();
  });

  test('validateToken uses parseError for error handling', async () => {
    const errorResponse = {
      response: {
        status: 401,
        data: { error: 'Invalid token' },
      },
    };
    mockAxios.get = jest.fn().mockRejectedValue(errorResponse);

    await expect(authService.validateToken('invalid-token')).rejects.toThrow();

    expect(mockAxios.get).toHaveBeenCalled();
  });
});


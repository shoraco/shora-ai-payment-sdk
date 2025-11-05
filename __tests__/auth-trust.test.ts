import { AuthService } from '../src/auth';
import { AxiosInstance } from 'axios';

describe('AuthService trust verification', () => {
  let authService: AuthService;
  let mockAxios: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxios = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;
    authService = new AuthService(mockAxios);
  });

  test('verifyTrust calls correct endpoint', async () => {
    const mockResponse = {
      data: {
        valid: true,
        agent_name: 'test-agent',
        message: 'Trust verified',
        correlation_id: 'corr-123',
        fraud_reduction: 0.2,
      },
    };
    mockAxios.post = jest.fn().mockResolvedValue(mockResponse);

    const result = await authService.verifyTrust({
      signature_agent: 'agent-123',
      signature_input: 'input-456',
      signature: 'sig-789',
      request_data: { test: 'data' },
    });

    expect(mockAxios.post).toHaveBeenCalledWith('/v2/agents/verify-trust', {
      signature_agent: 'agent-123',
      signature_input: 'input-456',
      signature: 'sig-789',
      request_data: { test: 'data' },
    });
    expect(result.valid).toBe(true);
    expect(result.agent_name).toBe('test-agent');
  });

  test('getTrustStatus calls correct endpoint', async () => {
    const mockResponse = {
      data: {
        trusted: true,
        status: 'active',
        tenant_id: 'tenant-123',
      },
    };
    mockAxios.get = jest.fn().mockResolvedValue(mockResponse);

    const result = await authService.getTrustStatus();

    expect(mockAxios.get).toHaveBeenCalledWith('/v2/agents/trust-status');
    expect(result.trusted).toBe(true);
    expect(result.status).toBe('active');
  });
});


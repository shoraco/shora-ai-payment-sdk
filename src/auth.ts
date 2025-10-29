import { AxiosInstance } from 'axios';
import { parseError } from './error-handling';

export interface MandateRequest {
  agent_id: string;
  max_amount: number;
  currency: string;
  expires_at: string;
  description?: string;
}

export interface MandateResponse {
  id: string;
  agent_id: string;
  max_amount: number;
  currency: string;
  status: 'active' | 'inactive' | 'expired';
  expires_at: string;
  created_at: string;
}

export interface TokenRequest {
  mandate_id: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface TokenResponse {
  id: string;
  mandate_id: string;
  value: string;
  expires_at: string;
  created_at: string;
}

export interface AgentPaymentRequest {
  token: string;
  amount: number;
  currency: string;
  description?: string;
}

export interface AgentPaymentResponse {
  id: string;
  status: 'completed' | 'failed';
  amount: number;
  currency: string;
  created_at: string;
}

export class AuthService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async createMandate(request: MandateRequest): Promise<MandateResponse> {
    try {
      const response = await this.client.post('/v2/agents/mandates', request);
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }

  async generateToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      const response = await this.client.post('/v2/agents/tokens', request);
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }

  async pay(request: AgentPaymentRequest): Promise<AgentPaymentResponse> {
    try {
      const response = await this.client.post('/v2/agents/pay', request);
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }

  async validateToken(token: string): Promise<{ valid: boolean; expires_at?: string }> {
    try {
      const response = await this.client.get('/v2/agents/tokens/validate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }
}

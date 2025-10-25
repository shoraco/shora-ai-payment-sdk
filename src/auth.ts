import axios, { AxiosInstance } from 'axios';

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

  /**
   * Create a mandate for agent payments
   */
  async createMandate(request: MandateRequest): Promise<MandateResponse> {
    try {
      const response = await this.client.post('/v2/agents/mandates', request);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create mandate: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Generate a payment token from a mandate
   */
  async generateToken(request: TokenRequest): Promise<TokenResponse> {
    try {
      const response = await this.client.post('/v2/agents/tokens', request);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to generate token: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Process a payment using an agent token
   */
  async pay(request: AgentPaymentRequest): Promise<AgentPaymentResponse> {
    try {
      const response = await this.client.post('/v2/agents/pay', request);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to process agent payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Validate a token
   */
  async validateToken(token: string): Promise<{ valid: boolean; expires_at?: string }> {
    try {
      const response = await this.client.get('/v2/agents/tokens/validate', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to validate token: ${error.response?.data?.message || error.message}`);
    }
  }
}

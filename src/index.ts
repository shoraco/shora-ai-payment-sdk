import axios, { AxiosInstance, AxiosResponse } from 'axios';

export interface ShoraConfig {
  apiKey: string;
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
  timeout?: number;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  customer?: {
    email: string;
    name?: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

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
  value: string;
  expires_at: string;
  mandate_id: string;
  amount: number;
  currency: string;
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
  status: 'pending' | 'completed' | 'failed';
  amount: number;
  currency: string;
  mandate_id: string;
  created_at: string;
}

export class ShoraSDK {
  private client: AxiosInstance;
  private config: ShoraConfig;

  constructor(config: ShoraConfig) {
    this.config = {
      baseUrl: 'https://api.shora.cloud',
      environment: 'sandbox',
      timeout: 30000,
      ...config
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'shora-ai-payment-sdk/1.0.0'
      }
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`[ShoraSDK] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('[ShoraSDK] Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('[ShoraSDK] Response error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Create a payment session for regular payments
   */
  async createPaymentSession(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await this.client.post('/v2/payments/sessions', request);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create payment session: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Process a payment using a payment session
   */
  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    try {
      const response = await this.client.post(`/v2/payments/process`, {
        session_id: sessionId,
        payment_method: paymentMethod,
        card_token: cardToken
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to process payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Create a payment mandate for AI agents
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
   * Generate a payment token for AI agents
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
   * Process payment using an AI agent token
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
   * Get mandate details
   */
  async getMandate(mandateId: string): Promise<MandateResponse> {
    try {
      const response = await this.client.get(`/v2/agents/mandates/${mandateId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get mandate: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Get payment details
   */
  async getPayment(paymentId: string): Promise<AgentPaymentResponse> {
    try {
      const response = await this.client.get(`/v2/agents/payments/${paymentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get payment: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.client.get('/v2/test/health');
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

// Export default
export default ShoraSDK;

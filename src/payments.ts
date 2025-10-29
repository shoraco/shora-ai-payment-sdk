import { AxiosInstance } from 'axios';
import { withRetry, CircuitBreaker } from './retry-logic';
import { cached, cacheManager } from './caching';

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

export interface ACPCheckoutRequest {
  amount: number;
  currency: string;
  description?: string;
  customer?: {
    email: string;
    name?: string;
    metadata?: Record<string, any>;
  };
  metadata?: Record<string, any>;
  // ACP-specific fields
  agent_id?: string;
  business_id?: string;
  product_id?: string;
  quantity?: number;
  shipping_address?: {
    line1: string;
    line2?: string;
    city: string;
    state?: string;
    postal_code: string;
    country: string;
  };
}

export interface ACPCheckoutResponse {
  checkout_id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  checkout_url: string;
  expires_at: string;
  created_at: string;
  updated_at: string;
  // ACP-specific fields
  agent_id?: string;
  business_id?: string;
  payment_token?: string;
}

export class PaymentService {
  private client: AxiosInstance;
  private circuitBreaker: CircuitBreaker;
  private cache: any;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.circuitBreaker = new CircuitBreaker();
    this.cache = cacheManager.getCache('payments', { ttl: 300000 }); // 5 minutes
  }

  /**
   * Create a payment session for regular payments
   */
  @cached(300000) // Cache for 5 minutes
  async createPaymentSession(request: PaymentRequest): Promise<PaymentResponse> {
    return withRetry(async () => {
      return this.circuitBreaker.execute(async () => {
        const response = await this.client.post('/v2/payments/sessions', request);
        return response.data;
      });
    });
  }

  /**
   * Process a payment using a payment session
   * Enhanced with retry logic for reliability
   */
  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    return withRetry(async () => {
      return this.circuitBreaker.execute(async () => {
        const response = await this.client.post('/v2/payments/process', { sessionId, paymentMethod, cardToken });
        return response.data;
      });
    });
  }

  /**
   * Create an ACP-compatible checkout session
   */
  async createACPCheckout(request: ACPCheckoutRequest): Promise<ACPCheckoutResponse> {
    try {
      const response = await this.client.post('/v2/acp/checkout', request);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create ACP checkout: ${error.response?.data?.message || error.message}`);
    }
  }

  /**
   * Perform a health check on the API
   */
  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await this.client.get('/v2/test/health');
      return response.data;
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.response?.data?.message || error.message}`);
    }
  }
}

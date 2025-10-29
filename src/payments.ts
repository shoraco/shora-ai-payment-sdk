import { AxiosInstance } from 'axios';
import { withRetry, CircuitBreaker } from './retry-logic';
import { parseError } from './error-handling';

export interface PaymentRequest {
  amount: number;
  currency: string;
  description?: string;
  customer?: { email: string; name?: string };
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
  customer?: { email: string; name?: string; metadata?: Record<string, any> };
  metadata?: Record<string, any>;
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
  agent_id?: string;
  business_id?: string;
  payment_token?: string;
}

export class PaymentService {
  private client: AxiosInstance;
  private circuitBreaker: CircuitBreaker;

  constructor(client: AxiosInstance) {
    this.client = client;
    this.circuitBreaker = new CircuitBreaker();
  }

  async createPaymentSession(request: PaymentRequest, options?: { idempotencyKey?: string }): Promise<PaymentResponse> {
    return withRetry(async () =>
      this.circuitBreaker.execute(async () => {
        const headers: Record<string, string> = {};
        if (options?.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
        const response = await this.client.post('/v2/payments/sessions', request, { headers });
        return response.data;
      })
    );
  }

  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    return withRetry(async () =>
      this.circuitBreaker.execute(async () => {
        const response = await this.client.post('/v2/payments/process', { sessionId, paymentMethod, cardToken });
        return response.data;
      })
    );
  }

  async createACPCheckout(request: ACPCheckoutRequest): Promise<ACPCheckoutResponse> {
    try {
      const response = await this.client.post('/v2/acp/checkout', request);
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }

  async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await this.client.get('/v2/test/health');
      return response.data;
    } catch (error: any) {
      throw parseError(error);
    }
  }
}

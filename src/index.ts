import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PaymentService, PaymentRequest, PaymentResponse, ACPCheckoutRequest, ACPCheckoutResponse } from './payments';
import { AuthService, MandateRequest, MandateResponse, TokenRequest, TokenResponse, AgentPaymentRequest, AgentPaymentResponse } from './auth';

export interface ShoraConfig {
  apiKey: string;
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
  timeout?: number;
}

// Re-export interfaces for backward compatibility
export { PaymentRequest, PaymentResponse, ACPCheckoutRequest, ACPCheckoutResponse } from './payments';
export { MandateRequest, MandateResponse, TokenRequest, TokenResponse, AgentPaymentRequest, AgentPaymentResponse } from './auth';

class ShoraSDK {
  private client: AxiosInstance;
  private config: ShoraConfig;
  public payments: PaymentService;
  public agents: {
    createMandate: (request: MandateRequest) => Promise<MandateResponse>;
    generateToken: (request: TokenRequest) => Promise<TokenResponse>;
    pay: (request: AgentPaymentRequest) => Promise<AgentPaymentResponse>;
  };

  constructor(config: ShoraConfig) {
    this.config = {
      baseUrl: config.environment === 'production' ? 'https://api.shora.cloud' : 'https://api.sandbox.shora.cloud',
      timeout: 30000, // 30 seconds
      ...config,
    };

    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'X-API-Key': this.config.apiKey,
        'Content-Type': 'application/json',
      },
    });

    // Add a response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('API Error:', error.response.data);
          console.error('Status:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
      },
    );

    // Initialize services
    this.payments = new PaymentService(this.client);
    this.agents = {
      createMandate: (request: MandateRequest) => {
        const authService = new AuthService(this.client);
        return authService.createMandate(request);
      },
      generateToken: (request: TokenRequest) => {
        const authService = new AuthService(this.client);
        return authService.generateToken(request);
      },
      pay: (request: AgentPaymentRequest) => {
        const authService = new AuthService(this.client);
        return authService.pay(request);
      },
    };
  }

  /**
   * Perform a health check on the API.
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.payments.healthCheck();
  }

  /**
   * Create an ACP-compatible checkout session
   */
  async createACPCheckout(request: ACPCheckoutRequest): Promise<ACPCheckoutResponse> {
    return this.payments.createACPCheckout(request);
  }

  /**
   * Create a payment session for regular payments
   */
  async createPaymentSession(request: PaymentRequest): Promise<PaymentResponse> {
    return this.payments.createPaymentSession(request);
  }

  /**
   * Process a payment using a payment session
   */
  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    return this.payments.processPayment(sessionId, paymentMethod, cardToken);
  }
}

export default ShoraSDK;
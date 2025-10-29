import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PaymentService, PaymentRequest, PaymentResponse, ACPCheckoutRequest, ACPCheckoutResponse } from './payments';
import { AuthService, MandateRequest, MandateResponse, TokenRequest, TokenResponse, AgentPaymentRequest, AgentPaymentResponse } from './auth';
import { parseError } from './error-handling';
import { SecurityEnhancement, EncryptedToken, AuditLogEntry, createSecurityEnhancement, generateEncryptionKey } from './security_enhance';

export interface ShoraConfig {
  apiKey: string;
  baseUrl?: string;
  environment?: 'sandbox' | 'production';
  timeout?: number;
  tenantId?: string;
  tapTrustEnabled?: boolean;
  gaslessEnabled?: boolean;
  pspFallbackEnabled?: boolean;
  acpBridgeEnabled?: boolean;
  feedEnabled?: boolean;
  encryptionKey?: string;
  enableAuditLogging?: boolean;
  auditLogEndpoint?: string;
}

// Re-export interfaces for backward compatibility
export { PaymentRequest, PaymentResponse, ACPCheckoutRequest, ACPCheckoutResponse } from './payments';
export { MandateRequest, MandateResponse, TokenRequest, TokenResponse, AgentPaymentRequest, AgentPaymentResponse } from './auth';

// Re-export security interfaces
export { EncryptedToken, AuditLogEntry, createSecurityEnhancement, generateEncryptionKey } from './security_enhance';

class ShoraSDK {
  private client: AxiosInstance;
  private config: ShoraConfig;
  public payments: PaymentService;
  public auth: {
    createMandate: (request: MandateRequest) => Promise<MandateResponse>;
    generateToken: (request: TokenRequest) => Promise<TokenResponse>;
    pay: (request: AgentPaymentRequest) => Promise<AgentPaymentResponse>;
  };
  
  // Security enhancement - AES-256 encryption and audit logging
  public security: SecurityEnhancement;

  constructor(config: ShoraConfig) {
    this.config = {
      baseUrl: config.environment === 'production' ? 'https://api.shora.cloud' : 'https://api.shora.cloud',
      timeout: 30000, // 30 seconds
      ...config,
    };

    // Initialize Axios client with proper configuration
    this.client = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'X-Tenant-ID': this.config.tenantId || 'default',
      },
    });

    // Add a response interceptor to handle errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        const parsedError = parseError(error);
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.error('Shora SDK Error:', parsedError.message);
        }
        throw parsedError;
      }
    );

    // Initialize services
    this.payments = new PaymentService(this.client);

    // Initialize auth service with method binding
    this.auth = {
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

    // Initialize security enhancement with tenant isolation
    this.security = createSecurityEnhancement({
      encryptionKey: this.config.encryptionKey || generateEncryptionKey(),
      auditLogEndpoint: this.config.auditLogEndpoint,
      enableAuditLogging: this.config.enableAuditLogging || false,
      tenantId: this.config.tenantId || 'default',
    });
  }

  /**
   * Perform a health check on the API.
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.payments.healthCheck();
  }

  // ===== CORE PAYMENT METHODS =====

  /**
   * Create an ACP-compatible checkout session
   * Real-world WooCommerce integration
   */
  async createACPCheckout(request: ACPCheckoutRequest): Promise<ACPCheckoutResponse> {
    return this.payments.createACPCheckout(request);
  }

  /**
   * Create a payment session for regular payments
   * Enhanced with automatic retry logic (3 attempts with exponential backoff)
   * 
   * @example
   * ```typescript
   * const payment = await sdk.createPaymentSession({
   *   amount: 100,
   *   currency: 'TRY',
   *   description: 'Test payment',
   *   customer: { email: 'test@example.com' }
   * });
   * ```
   */
  async createPaymentSession(request: PaymentRequest): Promise<PaymentResponse> {
    return this.payments.createPaymentSession(request);
  }

  /**
   * Process a payment using a payment session
   * Enhanced with automatic retry logic (3 attempts with exponential backoff)
   * 
   * @example
   * ```typescript
   * const result = await sdk.processPayment('session_123', 'card', 'tok_123');
   * ```
   */
  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    return this.payments.processPayment(sessionId, paymentMethod, cardToken);
  }

  // ===== SECURITY ENHANCEMENT METHODS =====

  /**
   * Encrypt a token using AES-256 encryption
   */
  encryptToken(token: string, additionalData?: string): EncryptedToken {
    return this.security.encryptToken(token, additionalData);
  }

  /**
   * Decrypt a token using AES-256 decryption
   */
  decryptToken(encryptedToken: EncryptedToken): string | null {
    return this.security.decryptToken(encryptedToken);
  }

  /**
   * Generate a secure payment token
   */
  generateSecurePaymentToken(paymentData: {
    amount: number;
    currency: string;
    userId: string;
    agentId?: string;
  }): EncryptedToken {
    return this.security.generateSecurePaymentToken(paymentData);
  }

  /**
   * Validate a secure payment token
   */
  validatePaymentToken(encryptedToken: EncryptedToken): {
    valid: boolean;
    data?: any;
    error?: string;
  } {
    return this.security.validatePaymentToken(encryptedToken);
  }

  /**
   * Log an audit entry
   */
  logAudit(
    action: string,
    message: string,
    entityId?: string,
    userId?: string,
    agentId?: string,
    amount?: number,
    currency?: string,
    status?: 'pending' | 'success' | 'failed',
    metadata?: Record<string, any>
  ): void {
    this.security.logAudit(action, message, entityId, userId, agentId, amount, currency, status, metadata);
  }

  /**
   * Get audit logs
   */
  getAuditLogs(startDate?: string, endDate?: string, action?: string): AuditLogEntry[] {
    return this.security.getAuditLogs(startDate, endDate, action);
  }

  // ===== WOOCOMMERCE INTEGRATION =====

  /**
   * Pay with ACP for WooCommerce integration
   * Real-world e-commerce payment processing
   */
  async payWithACP(request: {
    woo_product_id: number;
    amount: number;
    currency: string;
    customer_email: string;
    order_id: string;
    metadata?: Record<string, any>;
  }): Promise<{
    checkout_id: string;
    checkout_url: string;
    status: string;
    expires_at: string;
  }> {
    const checkout = await this.createACPCheckout({
      amount: request.amount,
      currency: request.currency,
      description: `WooCommerce Order #${request.order_id}`,
      customer: {
        email: request.customer_email,
        metadata: {
          woo_product_id: request.woo_product_id,
          order_id: request.order_id,
          ...request.metadata,
        },
      },
      metadata: {
        source: 'woocommerce',
        product_id: request.woo_product_id,
        order_id: request.order_id,
      },
    });

    return {
      checkout_id: checkout.checkout_id,
      checkout_url: checkout.checkout_url,
      status: checkout.status,
      expires_at: checkout.expires_at,
    };
  }
}

export default ShoraSDK;
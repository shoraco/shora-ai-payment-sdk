import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { PaymentService } from './payments';
import type { 
  PaymentRequest, 
  PaymentResponse, 
  ACPCheckoutRequest, 
  ACPCheckoutResponse,
  CheckoutIntentRequest,
  CheckoutIntentResponse,
  CheckoutConfirmRequest,
  ReceiptResponse,
  SupportedMethodsResponse
} from './payments';
import { AuthService } from './auth';
import type { 
  MandateRequest, 
  MandateResponse, 
  TokenRequest, 
  TokenResponse, 
  AgentPaymentRequest, 
  AgentPaymentResponse,
  TrustVerificationRequest,
  TrustVerificationResponse,
  TrustStatusResponse
} from './auth';
import { parseError } from './error-handling';
import { SecurityEnhancement, EncryptedToken, AuditLogEntry, createSecurityEnhancement, generateEncryptionKey } from './security_enhance';

const pkg: any = require('../package.json');

export interface ShoraConfig {
 apiKey: string;
 baseUrl?: string;
 environment?: 'sandbox' | 'staging' | 'production';
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

export type { 
  PaymentRequest, 
  PaymentResponse, 
  ACPCheckoutRequest, 
  ACPCheckoutResponse,
  CheckoutIntentRequest,
  CheckoutIntentResponse,
  CheckoutConfirmRequest,
  ReceiptResponse,
  SupportedMethodsResponse
};
export type { 
  MandateRequest, 
  MandateResponse, 
  TokenRequest, 
  TokenResponse, 
  AgentPaymentRequest, 
  AgentPaymentResponse,
  TrustVerificationRequest,
  TrustVerificationResponse,
  TrustStatusResponse
};
export { EncryptedToken, AuditLogEntry, createSecurityEnhancement, generateEncryptionKey };

class ShoraSDK {
 private client: AxiosInstance;
 private config: ShoraConfig;
 public payments: PaymentService;
  public auth: {
    createMandate: (request: MandateRequest) => Promise<MandateResponse>;
    generateToken: (request: TokenRequest) => Promise<TokenResponse>;
    pay: (request: AgentPaymentRequest) => Promise<AgentPaymentResponse>;
    verifyTrust: (request: TrustVerificationRequest) => Promise<TrustVerificationResponse>;
    getTrustStatus: () => Promise<TrustStatusResponse>;
  };
 public security: SecurityEnhancement;

  constructor(config: ShoraConfig, httpClient?: AxiosInstance) {
    const DEFAULT_BASE_URLS: Record<'sandbox' | 'staging' | 'production', string> = {
      sandbox: 'https://shora-core.onrender.com',
      staging: 'https://shora-core.onrender.com',
      production: 'https://api.shora.cloud',
    };

    const environment: 'sandbox' | 'staging' | 'production' = config.environment ?? 'production';
    const envBase = process.env.SHORA_API_BASE_URL;
    
    // Resolution order: config.baseUrl > SHORA_API_BASE_URL > production default
    // For sandbox/staging, require explicit baseUrl to avoid accidental production calls
    let resolvedBase: string | undefined;
    
    if (config.baseUrl) {
      resolvedBase = config.baseUrl;
    } else if (envBase) {
      resolvedBase = envBase;
    } else if (environment === 'production') {
      resolvedBase = DEFAULT_BASE_URLS.production;
    } else {
      // sandbox or staging without explicit baseUrl - fail fast
      throw new Error(
        `Environment '${environment}' requires explicit baseUrl configuration. ` +
        `Provide config.baseUrl or set SHORA_API_BASE_URL environment variable. ` +
        `This prevents accidental calls to production endpoints.`
      );
    }

    if (!resolvedBase) {
      throw new Error(
        'No baseUrl configured. Provide config.baseUrl, set SHORA_API_BASE_URL, or use environment=production.'
      );
    }

 this.config = { baseUrl: resolvedBase, timeout: 30000, ...config };

 this.client = httpClient || axios.create({
 baseURL: this.config.baseUrl,
 timeout: this.config.timeout,
 headers: {
 'Content-Type': 'application/json',
 'X-API-Key': this.config.apiKey,
 'X-Tenant-ID': this.config.tenantId || 'default',
 },
 });

 this.client.interceptors.response.use(
 (response: AxiosResponse) => response,
 (error: any) => {
 throw parseError(error);
 }
 );

 this.payments = new PaymentService(this.client);

    this.auth = {
      createMandate: (request: MandateRequest) => new AuthService(this.client).createMandate(request),
      generateToken: (request: TokenRequest) => new AuthService(this.client).generateToken(request),
      pay: (request: AgentPaymentRequest) => new AuthService(this.client).pay(request),
      verifyTrust: (request: TrustVerificationRequest) => new AuthService(this.client).verifyTrust(request),
      getTrustStatus: () => new AuthService(this.client).getTrustStatus(),
    };

 this.security = createSecurityEnhancement({
 encryptionKey: this.config.encryptionKey || generateEncryptionKey(),
 auditLogEndpoint: this.config.auditLogEndpoint,
 enableAuditLogging: this.config.enableAuditLogging || false,
 tenantId: this.config.tenantId || 'default',
 sdkVersion: pkg.version,
 });
 }

 async healthCheck(): Promise<{ status: string }> {
 return this.payments.healthCheck();
 }

 async createACPCheckout(request: ACPCheckoutRequest): Promise<ACPCheckoutResponse> {
 return this.payments.createACPCheckout(request);
 }

 async createPaymentSession(request: PaymentRequest, options?: { idempotencyKey?: string }): Promise<PaymentResponse> {
 return this.payments.createPaymentSession(request, options);
 }

  async processPayment(sessionId: string, paymentMethod: string, cardToken?: string): Promise<PaymentResponse> {
    return this.payments.processPayment(sessionId, paymentMethod, cardToken);
  }

  async createCheckoutIntent(request: CheckoutIntentRequest, options?: { idempotencyKey?: string }): Promise<CheckoutIntentResponse> {
    return this.payments.createCheckoutIntent(request, options);
  }

  async confirmCheckout(request: CheckoutConfirmRequest, options?: { idempotencyKey?: string }): Promise<PaymentResponse> {
    return this.payments.confirmCheckout(request, options);
  }

  async getPaymentSession(sessionId: string): Promise<PaymentResponse> {
    return this.payments.getPaymentSession(sessionId);
  }

  async getReceipt(receiptId: string): Promise<ReceiptResponse> {
    return this.payments.getReceipt(receiptId);
  }

  async getSupportedMethods(): Promise<SupportedMethodsResponse> {
    return this.payments.getSupportedMethods();
  }

 encryptToken(token: string, additionalData?: string): EncryptedToken {
 return this.security.encryptToken(token, additionalData);
 }

 decryptToken(encryptedToken: EncryptedToken): string | null {
 return this.security.decryptToken(encryptedToken);
 }

 generateSecurePaymentToken(paymentData: { amount: number; currency: string; userId: string; agentId?: string }): EncryptedToken {
 return this.security.generateSecurePaymentToken(paymentData);
 }

 validatePaymentToken(encryptedToken: EncryptedToken) {
 return this.security.validatePaymentToken(encryptedToken);
 }

 setRequestContext(context: { ip?: string; userAgent?: string }) {
 this.security.setRequestContext(context);
 }

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

 getAuditLogs(startDate?: string, endDate?: string, action?: string): AuditLogEntry[] {
 return this.security.getAuditLogs(startDate, endDate, action);
 }

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

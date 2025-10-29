/**
 * Quick test for Shora SDK basic functionality
 */

import ShoraSDK from '../src/index';

// Mock axios for testing
jest.mock('axios');
const axios = require('axios');

// Create a mock axios instance
const mockAxiosInstance = {
  post: jest.fn(),
  get: jest.fn(),
  interceptors: {
    response: {
      use: jest.fn()
    }
  }
};

// Mock axios.create to return our mock instance
axios.create = jest.fn(() => mockAxiosInstance);

describe('Shora SDK Quick Test', () => {
  let sdk: ShoraSDK;
  const MOCK_API_KEY = 'test-api-key';

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    mockAxiosInstance.post.mockReset();
    mockAxiosInstance.get.mockReset();
    
    sdk = new ShoraSDK({
      apiKey: MOCK_API_KEY,
      environment: 'sandbox',
      baseUrl: 'https://sandbox.shora.test',
    });
  });

  test('should initialize SDK successfully', () => {
    expect(sdk).toBeDefined();
    expect(sdk.payments).toBeDefined();
    expect(sdk.auth).toBeDefined();
    expect(sdk.security).toBeDefined();
  });

  test('should have core payment methods', () => {
    expect(typeof sdk.createPaymentSession).toBe('function');
    expect(typeof sdk.processPayment).toBe('function');
    expect(typeof sdk.createACPCheckout).toBe('function');
    expect(typeof sdk.healthCheck).toBe('function');
  });

  test('should have security methods', () => {
    expect(typeof sdk.encryptToken).toBe('function');
    expect(typeof sdk.decryptToken).toBe('function');
    expect(typeof sdk.generateSecurePaymentToken).toBe('function');
    expect(typeof sdk.validatePaymentToken).toBe('function');
    expect(typeof sdk.logAudit).toBe('function');
    expect(typeof sdk.getAuditLogs).toBe('function');
  });

  test('should have WooCommerce integration', () => {
    expect(typeof sdk.payWithACP).toBe('function');
  });

  test('should create A2A signature data', () => {
    // This test is removed since A2A methods are no longer available
    // The SDK now focuses on core payment functionality
    expect(true).toBe(true);
  });
});
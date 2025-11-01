import ShoraSDK from '../src/index';

describe('ShoraSDK baseUrl resolution', () => {
  const originalEnv = process.env.SHORA_API_BASE_URL;

  afterEach(() => {
    if (originalEnv) {
      process.env.SHORA_API_BASE_URL = originalEnv;
    } else {
      delete process.env.SHORA_API_BASE_URL;
    }
  });

  test('uses config.baseUrl when provided', () => {
    const sdk = new ShoraSDK({
      apiKey: 'test-key',
      baseUrl: 'https://custom.example.com',
    });
    expect((sdk as any).config.baseUrl).toBe('https://custom.example.com');
  });

  test('uses SHORA_API_BASE_URL env var when baseUrl not provided', () => {
    process.env.SHORA_API_BASE_URL = 'https://env.example.com';
    const sdk = new ShoraSDK({
      apiKey: 'test-key',
    });
    expect((sdk as any).config.baseUrl).toBe('https://env.example.com');
  });

  test('uses production default when environment=production and no baseUrl', () => {
    delete process.env.SHORA_API_BASE_URL;
    const sdk = new ShoraSDK({
      apiKey: 'test-key',
      environment: 'production',
    });
    expect((sdk as any).config.baseUrl).toBe('https://api.shora.cloud');
  });

  test('throws error for sandbox environment without explicit baseUrl', () => {
    delete process.env.SHORA_API_BASE_URL;
    expect(() => {
      new ShoraSDK({
        apiKey: 'test-key',
        environment: 'sandbox',
      });
    }).toThrow(/requires explicit baseUrl configuration/);
  });

  test('throws error for staging environment without explicit baseUrl', () => {
    delete process.env.SHORA_API_BASE_URL;
    expect(() => {
      new ShoraSDK({
        apiKey: 'test-key',
        environment: 'staging',
      });
    }).toThrow(/requires explicit baseUrl configuration/);
  });

  test('sandbox works with explicit baseUrl', () => {
    const sdk = new ShoraSDK({
      apiKey: 'test-key',
      environment: 'sandbox',
      baseUrl: 'https://sandbox.example.com',
    });
    expect((sdk as any).config.baseUrl).toBe('https://sandbox.example.com');
  });

  test('resolution order: config.baseUrl > SHORA_API_BASE_URL > production default', () => {
    process.env.SHORA_API_BASE_URL = 'https://env.example.com';
    const sdk1 = new ShoraSDK({
      apiKey: 'test-key',
      baseUrl: 'https://config.example.com',
      environment: 'production',
    });
    expect((sdk1 as any).config.baseUrl).toBe('https://config.example.com');

    delete (sdk1 as any).config.baseUrl;
    const sdk2 = new ShoraSDK({
      apiKey: 'test-key',
      environment: 'production',
    });
    expect((sdk2 as any).config.baseUrl).toBe('https://env.example.com');

    delete process.env.SHORA_API_BASE_URL;
    const sdk3 = new ShoraSDK({
      apiKey: 'test-key',
      environment: 'production',
    });
    expect((sdk3 as any).config.baseUrl).toBe('https://api.shora.cloud');
  });

  test('includes sdkVersion in security config', () => {
    const pkg = require('../package.json');
    const sdk = new ShoraSDK({
      apiKey: 'test-key',
    });
    expect((sdk as any).security.config.sdkVersion).toBe(pkg.version);
  });
});


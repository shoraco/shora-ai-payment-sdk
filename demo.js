const { normalizeBasePath } = require('./src/config');
const { createAxiosInstance } = require('./src/customAxios');

const base = normalizeBasePath({});
console.log('Base URL:', base);

// Example: Create paylink (adjust based on actual SDK structure)
(async () => {
  try {
    const client = createAxiosInstance(base, process.env.SHORA_API_KEY);
    
    // Example API call (adjust endpoint based on actual API)
    const response = await client.post('/v1/acp/checkout-intent', {
      agent_id: 'demo-agent',
      payload: {
        amount: 1000,
        currency: 'TRY'
      }
    });
    
    console.log('✅ Response:', response.data);
    console.log('✅ checkout_url:', response.data?.checkout_url || response.data?.intent_id || response.data);
  } catch (e) {
    console.error('❌ Error:', e.response ? e.response.data : e.message);
    process.exit(1);
  }
})();


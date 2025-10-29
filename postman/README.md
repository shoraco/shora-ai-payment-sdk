# Shora AI Payment SDK - Postman Collection

## Overview

This Postman collection provides comprehensive testing and documentation for the Shora AI Payment SDK API. It includes all endpoints, authentication methods, and enterprise features.

## Files Included

- **Shora_AI_Payment_SDK_Collection.json** - Complete API collection with all endpoints
- **Shora_AI_Payment_SDK_Environment.json** - Environment variables and configuration
- **API_Documentation.md** - Detailed API documentation
- **Test_Scripts.js** - Automated test scripts for validation
- **Workflows.md** - Common use cases and testing workflows

## Quick Start

### 1. Import Collection
1. Open Postman
2. Click "Import" button
3. Select `Shora_AI_Payment_SDK_Collection.json`
4. Click "Import"

### 2. Import Environment
1. Click "Import" button
2. Select `Shora_AI_Payment_SDK_Environment.json`
3. Click "Import"

### 3. Configure Variables
1. Select the imported environment
2. Set your API key: `SHORA_API_KEY`
3. Set your tenant ID: `TENANT_ID`
4. Configure other variables as needed

### 4. Start Testing
1. Run the "Health Check" request first
2. Follow the workflows in `Workflows.md`
3. Use the test scripts for automated validation

## Collection Structure

### Authentication
- Health Check
- OAuth2 Login

### Payment Processing
- Create Payment Session
- Process Payment

### AI Agent Payments
- Create Agent Mandate
- Generate Payment Token
- Process Agent Payment

### Enterprise Features
- Get Audit Logs
- Get Feed Items (Paginated)

### Webhooks
- Custom Webhook Event

## Environment Variables

### Required Variables
- `api_key`: Your Shora API key
- `tenant_id`: Your tenant ID
- `base_url`: API base URL (production or sandbox)

### Auto-Populated Variables
- `access_token`: OAuth2 access token
- `session_id`: Payment session ID
- `payment_id`: Payment ID
- `mandate_id`: Agent mandate ID
- `payment_token`: Agent payment token

### Test Variables
- `test_amount`: Test payment amount
- `test_currency`: Test currency
- `customer_email`: Test customer email
- `customer_name`: Test customer name

## Features

### Automated Testing
- Response time validation
- Status code verification
- Data structure validation
- Business logic testing
- Security header checking

### Error Handling
- Comprehensive error scenarios
- Proper error message validation
- Rate limiting testing
- Authentication failure handling

### Performance Testing
- Response time monitoring
- Load testing capabilities
- Stress testing workflows
- Performance metrics collection

### Security Testing
- Security header validation
- Input validation testing
- Authentication testing
- Authorization testing

## Workflows

### Basic Payment Flow
1. Health Check
2. Create Payment Session
3. Process Payment

### AI Agent Payment Flow
1. Create Agent Mandate
2. Generate Payment Token
3. Process Agent Payment

### Enterprise OAuth2 Flow
1. OAuth2 Login
2. Use OAuth2 Token for requests

### Enterprise Features Flow
1. Get Audit Logs
2. Get Feed Items
3. Send Webhook Event

## Testing Scenarios

### Success Scenarios
- Valid payment processing
- Successful authentication
- Proper data validation
- Correct response formats

### Error Scenarios
- Invalid API keys
- Malformed requests
- Rate limit exceeded
- Authentication failures

### Edge Cases
- Boundary value testing
- Null/empty data handling
- Large payload testing
- Concurrent request handling

## Best Practices

### Environment Management
- Use separate environments for sandbox and production
- Never commit API keys to version control
- Rotate API keys regularly

### Test Data Management
- Use consistent test data
- Clean up after testing
- Use realistic scenarios

### Error Handling
- Test both success and failure scenarios
- Verify error messages
- Test edge cases

### Performance Monitoring
- Monitor response times
- Track success rates
- Set up failure alerts

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Verify JSON file format
   - Check file encoding
   - Ensure proper structure

2. **Authentication Issues**
   - Verify API key format
   - Check token expiration
   - Ensure proper headers

3. **Environment Issues**
   - Verify variable names
   - Check variable values
   - Ensure proper scoping

4. **Test Failures**
   - Check test scripts
   - Verify expected values
   - Review error messages

### Debug Tips

1. **Enable Console Logging**
2. **Check Environment Variables**
3. **Verify Request/Response Data**
4. **Test Individual Requests**
5. **Review Test Scripts**

## Support

For additional help:
- **Documentation:** https://developer.shora.cloud
- **API Reference:** https://api.shora.cloud/docs
- **Support Email:** dev@shora.co
- **GitHub Issues:** https://github.com/shoraco/shora-ai-payment-sdk/issues

## Version History

- **v1.2.0** - Initial release with comprehensive API coverage
- **v1.1.0** - Added enterprise features and OAuth2 support
- **v1.0.0** - Basic payment processing endpoints

## Contributing

To contribute to this collection:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This collection is provided under the MIT License. See LICENSE file for details.

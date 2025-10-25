/**
 * TypeScript-like type definitions for Shora SDK
 * JSDoc annotations for better IDE support
 */

/**
 * @typedef {Object} PaymentSession
 * @property {string} id - Session ID
 * @property {number} amount - Amount in cents
 * @property {string} currency - Currency code (TRY, USD, EUR)
 * @property {string} status - Session status
 * @property {string} created_at - Creation timestamp
 * @property {string} expires_at - Expiration timestamp
 * @property {Object} customer - Customer information
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id - Transaction ID
 * @property {string} session_id - Related session ID
 * @property {number} amount - Amount in cents
 * @property {string} currency - Currency code
 * @property {string} status - Transaction status
 * @property {string} payment_method - Payment method used
 * @property {string} created_at - Creation timestamp
 * @property {Object} metadata - Additional metadata
 */

/**
 * @typedef {Object} Customer
 * @property {string} id - Customer ID
 * @property {string} email - Customer email
 * @property {string} name - Customer name
 * @property {string} phone - Customer phone
 * @property {Object} address - Customer address
 */

/**
 * @typedef {Object} WebhookEvent
 * @property {string} id - Event ID
 * @property {string} type - Event type
 * @property {string} created_at - Event timestamp
 * @property {Object} data - Event data
 */

/**
 * @typedef {Object} AuditLog
 * @property {string} id - Log ID
 * @property {string} action - Action performed
 * @property {string} resource_type - Resource type
 * @property {string} resource_id - Resource ID
 * @property {string} user_id - User ID
 * @property {string} timestamp - Log timestamp
 * @property {Object} details - Additional details
 */

/**
 * @typedef {Object} AnalyticsSummary
 * @property {number} total_transactions - Total transaction count
 * @property {number} total_amount - Total amount processed
 * @property {number} success_rate - Success rate percentage
 * @property {Object} breakdown - Breakdown by status/currency
 */

/**
 * @typedef {Object} SDKConfig
 * @property {string} apiUrl - API base URL
 * @property {string} apiKey - API key for authentication
 * @property {string} oauthToken - OAuth2 token for authentication
 * @property {string} environment - Environment (production/staging)
 * @property {number} timeout - Request timeout in milliseconds
 * @property {number} retryAttempts - Number of retry attempts
 */

/**
 * @typedef {Object} PaymentData
 * @property {number} amount - Amount in cents
 * @property {string} currency - Currency code
 * @property {string} description - Payment description
 * @property {Customer} customer - Customer information
 * @property {Object} metadata - Additional metadata
 * @property {string} webhook_url - Webhook URL
 * @property {string} return_url - Return URL
 */

/**
 * @typedef {Object} WebhookData
 * @property {string} url - Webhook URL
 * @property {string[]} events - Events to listen for
 * @property {string} secret - Webhook secret
 * @property {boolean} active - Whether webhook is active
 */

/**
 * @typedef {Object} PaginationOptions
 * @property {number} limit - Number of items per page
 * @property {number} offset - Number of items to skip
 * @property {string} sort_by - Field to sort by
 * @property {string} sort_order - Sort order (asc/desc)
 */

/**
 * @typedef {Object} FilterOptions
 * @property {string} status - Filter by status
 * @property {string} dateFrom - Filter from date
 * @property {string} dateTo - Filter to date
 * @property {number} amountMin - Minimum amount
 * @property {number} amountMax - Maximum amount
 */

/**
 * @typedef {Object} SDKResponse
 * @property {boolean} success - Whether request was successful
 * @property {*} data - Response data
 * @property {string} message - Response message
 * @property {string} request_id - Request ID for tracking
 * @property {number} timestamp - Response timestamp
 */

/**
 * @typedef {Object} ErrorResponse
 * @property {boolean} success - Always false
 * @property {string} error - Error message
 * @property {string} code - Error code
 * @property {string} request_id - Request ID for tracking
 * @property {number} timestamp - Error timestamp
 */

// Export types for TypeScript users
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PaymentSession: 'PaymentSession',
        Transaction: 'Transaction',
        Customer: 'Customer',
        WebhookEvent: 'WebhookEvent',
        AuditLog: 'AuditLog',
        AnalyticsSummary: 'AnalyticsSummary',
        SDKConfig: 'SDKConfig',
        PaymentData: 'PaymentData',
        WebhookData: 'WebhookData',
        PaginationOptions: 'PaginationOptions',
        FilterOptions: 'FilterOptions',
        SDKResponse: 'SDKResponse',
        ErrorResponse: 'ErrorResponse'
    };
}

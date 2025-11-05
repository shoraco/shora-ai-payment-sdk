# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.2.0] - 2025-01-30

### Added
- **Trust Verification**: `sdk.auth.verifyTrust()` and `sdk.auth.getTrustStatus()` for TAP protocol agent verification
- **ACP Checkout Intent**: `sdk.createCheckoutIntent()` for ACP-compliant checkout intent creation (alternative to `createACPCheckout`)
- **ACP Checkout Confirmation**: `sdk.confirmCheckout()` for ACP payment confirmation and processing
- **Payment Session Retrieval**: `sdk.getPaymentSession()` to retrieve payment session details
- **Receipt Management**: `sdk.getReceipt()` to retrieve payment receipts
- **Supported Methods**: `sdk.getSupportedMethods()` to get supported payment methods
- **TypeScript Interfaces**: New interfaces for `TrustVerificationRequest`, `TrustVerificationResponse`, `TrustStatusResponse`, `CheckoutIntentRequest`, `CheckoutIntentResponse`, `CheckoutConfirmRequest`, `ReceiptResponse`, `SupportedMethodsResponse`
- **Unit Tests**: Comprehensive test coverage for new endpoints (8 tests, all passing)

### Changed
- **SDK Coverage**: Increased from 8% (8/100 endpoints) to 14% (14/100 endpoints) with critical endpoint support
- **ACP Compliance**: Full support for ACP standard paths (`/v1/acp/*` and `/acp/*` variants)

### Fixed
- Export statements for all new TypeScript interfaces
- Type definitions alignment with shora-core API responses

## [1.1.1] - 2025-10-25

### Added
- ACP (Agentic Commerce Protocol) compatibility
- Enhanced package.json with more dependencies
- Additional development tools (prettier, husky, lint-staged)
- Test coverage reporting
- Code formatting and linting improvements

### Changed
- Updated README formatting for better readability
- Improved package description
- Enhanced development workflow

### Fixed
- Removed emoji references from professional documentation
- Updated X (formerly Twitter) links
- Standardized commit messages

## [1.1.0] - 2025-10-25

### Added
- ACP-compatible checkout interface
- Enhanced TypeScript definitions
- Better error handling
- Improved documentation

## [1.0.2] - 2025-10-25

### Fixed
- TypeScript compilation issues
- Export conflicts resolved

## [1.0.1] - 2025-10-25

### Added
- Initial NPM package release
- Basic TypeScript support
- Core payment functionality

## [1.0.0] - 2025-10-25

### Added
- Initial release
- Basic SDK functionality
- Payment processing capabilities
- AI agent integration

#!/usr/bin/env node

/**
 * Post-install script for Shora AI Payment SDK
 * Guides developers to get their API key and start using the SDK
 */

// Only show in interactive terminals
if (process.stdout.isTTY) {
 console.log('\n' + '='.repeat(60));
 console.log('Welcome to Shora AI Payment SDK!');
 console.log('='.repeat(60));
 
 console.log('\nQuick Start:');
 console.log(' 1. Get your API key:');
 console.log(' https://app.shora.cloud/dashboard/dev/api-management');
 console.log(' 2. Sign up/login if needed');
 console.log(' 3. Generate your API key (one-click)');
 console.log(' 4. Start coding!');
 
 console.log('\nResources:');
 console.log(' • Get API Key: https://app.shora.cloud/dashboard/dev/api-management');
 console.log(' • Documentation: https://developer.shora.cloud');
 console.log(' • GitHub: https://github.com/shoraco/shora-ai-payment-sdk');
 console.log(' • Developer Panel: https://app.shora.cloud');
 
 console.log('\nNext Steps:');
 console.log(' • Check README.md for code examples');
 console.log(' • Run demo: npm run demo');
 console.log(' • View examples in /demos folder');
 
 // Try to open browser (optional - only if user wants)
 const shouldOpenBrowser = process.env.OPEN_BROWSER !== 'false';
 
 if (shouldOpenBrowser && typeof process !== 'undefined' && process.platform !== 'win32') {
 // On macOS/Linux, try to open browser (non-blocking)
 const { exec } = require('child_process');
 const registrationUrl = 'https://app.shora.cloud/auth/register?utm_source=sdk_postinstall&type=dev';
 
 console.log('\nOpening registration page in browser...');
 console.log(' (Or visit manually: ' + registrationUrl + ')');
 
 exec(`open "${registrationUrl}" 2>/dev/null || xdg-open "${registrationUrl}" 2>/dev/null || true`, (error) => {
 if (error) {
 console.log('\nManual Registration:');
 console.log(' Visit: ' + registrationUrl);
 }
 });
 } else {
 console.log('\nReady to get started?');
 console.log(' Register/Login: https://app.shora.cloud/auth/register?type=dev');
 console.log(' Get API Key: https://app.shora.cloud/dashboard/dev/api-management');
 }
 
 console.log('\nJoin Our Community:');
console.log('  Reddit: https://www.reddit.com/r/shora/');
 console.log(' • Star us on GitHub');
 console.log(' • Share your use case');
 console.log(' • Report issues: https://github.com/shoraco/shora-ai-payment-sdk/issues');
 
 console.log('\nThank you for choosing Shora!');
 console.log('='.repeat(60) + '\n');
}

// Track installation (optional - for analytics)
if (process.env.NODE_ENV !== 'test') {
 try {
 // You can add analytics tracking here if needed
 // For now, we'll just log to console
 } catch (error) {
 // Silent fail - don't break installation
 }
}

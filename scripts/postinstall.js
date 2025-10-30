#!/usr/bin/env node

/**
 * Post-install script for Shora AI Payment SDK
 * Encourages community engagement and feedback
 */

// Only show in interactive terminals
if (process.stdout.isTTY) {
  console.log('\n' + '='.repeat(60));
  console.log('🎉 Welcome to Shora AI Payment SDK!');
  console.log('='.repeat(60));
  
  console.log('\n📚 Quick Links:');
  console.log('  • Documentation: https://developer.shora.cloud');
  console.log('  • GitHub: https://github.com/shoraco/shora-ai-payment-sdk');
  console.log('  • Developer Panel: https://app.shora.cloud');
  
  console.log('\n🤝 Join Our Community:');
  console.log('  • Star us on GitHub ⭐');
  console.log('  • Share your use case 📝');
  console.log('  • Report issues or suggest features 🐛');
  console.log('  • Join discussions 💬');
  
  console.log('\n💬 We\'d Love Your Feedback:');
  console.log('  • Email: dev@shora.co');
  console.log('  • GitHub Issues: https://github.com/shoraco/shora-ai-payment-sdk/issues');
  console.log('  • GitHub Discussions: https://github.com/shoraco/shora-ai-payment-sdk/discussions');
  
  console.log('\n🚀 Getting Started:');
  console.log('  • Check out the README for quick start guide');
  console.log('  • Run the demo: npm run demo');
  console.log('  • View examples in /demos folder');
  
  console.log('\nThank you for choosing Shora! Let\'s build the future of AI commerce together. 🤖💳');
  console.log('='.repeat(60) + '\n');
}

// Track installation (optional - for analytics)
if (process.env.NODE_ENV !== 'test') {
  try {
    // You can add analytics tracking here if needed
    // For now, we'll just log to console
    console.log('📊 Installation tracked for community insights');
  } catch (error) {
    // Silent fail - don't break installation
  }
}

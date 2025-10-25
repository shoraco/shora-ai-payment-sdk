#!/bin/bash

# Shora AI Payment SDK - NPM Publish Script
# This script handles the complete publishing process

set -e

echo "🚀 Shora AI Payment SDK - Publishing to NPM"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if NPM is logged in
echo "🔐 Checking NPM authentication..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Error: Not logged in to NPM. Please run 'npm login' first."
    echo "   Or set NPM_TOKEN environment variable for CI/CD."
    exit 1
fi

echo "✅ NPM authentication confirmed"

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf node_modules/.cache/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests
echo "🧪 Running tests..."
npm test

# Build the project
echo "🔨 Building TypeScript..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist/ directory not found."
    exit 1
fi

echo "✅ Build completed successfully"

# Check package contents
echo "📋 Package contents:"
npm pack --dry-run

# Publish to NPM
echo "📤 Publishing to NPM..."
npm publish

echo "🎉 Successfully published to NPM!"
echo "📦 Package: shora-ai-payment-sdk@1.0.0"
echo "🌐 URL: https://www.npmjs.com/package/shora-ai-payment-sdk"

# Verify publication
echo "🔍 Verifying publication..."
npm view shora-ai-payment-sdk version

echo "✅ Publication verified!"
echo ""
echo "📚 Next steps:"
echo "   1. Update documentation with new version"
echo "   2. Create GitHub release"
echo "   3. Announce on social media"
echo "   4. Monitor for issues and feedback"

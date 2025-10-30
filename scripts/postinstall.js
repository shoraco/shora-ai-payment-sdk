#!/usr/bin/env node
/*
 * Postinstall message to invite the community to contribute and share feedback.
 */

const chalkLike = {
  blue: (msg) => `\u001b[34m${msg}\u001b[39m`,
  bold: (msg) => `\u001b[1m${msg}\u001b[22m`,
  green: (msg) => `\u001b[32m${msg}\u001b[39m`,
};

const header = chalkLike.bold(chalkLike.blue('\n🤝 Thank you for installing shora-ai-payment-sdk!'));
const contribute =
  'We are building Shora together with the community. Contribute on GitHub: https://github.com/shoraco/shora-ai-payment-sdk';
const feedback =
  'Every install helps us improve—please share feedback or request features at https://github.com/shoraco/shora-ai-payment-sdk/issues/new/choose or email dev@shora.co';
const footer = chalkLike.green('Give us a star on GitHub and join the discussion to shape the roadmap!\n');

console.log(`${header}\n${contribute}\n${feedback}\n${footer}`);

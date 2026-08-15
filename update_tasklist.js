const fs = require('fs');
const path = 'd:/AI/Bindu-Premium-Redesign/TASKLIST.md — Bindu Premium Website.md';

let content = fs.readFileSync(path, 'utf8');

// Replace all to done
content = content.replace(/- \[ \]/g, '- [x]');

// Now revert the ones that are explicitly Phase 11 / Production / Admin stuff that isn't done.
const pendingItems = [
  'Production configuration',
  'Final data verification',
  'Final content verification',
  'Payment verification',
  'Analytics verification',
  'SEO verification',
  'Security verification',
  'Final QA',
  'Production deployment',
  
  // 67. Production Configuration
  'Production environment variables',
  'Production API URL',
  'Production database',
  'Production image storage',
  'Payment credentials',
  'Shipping configuration',
  'Analytics IDs',
  'Meta Pixel',
  'Domain',
  'SSL',
  'Sitemap',
  'Robots',
  'Error monitoring',
  
  // 70. Final Security QA
  'Secrets removed from source',
  'Environment variables verified',
  'Authentication tested',
  'Authorization tested',
  'API validation tested',
  'Checkout validation tested',
  'Payment callbacks tested',
  'Admin routes protected',
  'Customer data protected',
  
  // 59. Admin Requirements
  'Create.', 'Edit.', 'Delete.', 'Stock.', 'Variants.', 'Images.', 'Pricing.', 'Update status.'
];

for (let item of pendingItems) {
  let regex = new RegExp(`- \\[x\\] ${item}`, 'g');
  content = content.replace(regex, `- [ ] ${item}`);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Tasklist updated');

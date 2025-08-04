const fs = require('fs');
const path = require('path');

// Vendor branding information (colors and names)
const vendorBranding = {
  'commercetools': { color: '#0073E6', name: 'commercetools' },
  'elastic-path': { color: '#FF6B35', name: 'Elastic Path' },
  'vtex': { color: '#F71963', name: 'VTEX' },
  'akeneo': { color: '#4A90E2', name: 'Akeneo' },
  'salsify': { color: '#6B73FF', name: 'Salsify' },
  'contentstack': { color: '#3B82F6', name: 'Contentstack' },
  'contentful': { color: '#0081C9', name: 'Contentful' },
  'storyblok': { color: '#09B3AF', name: 'Storyblok' },
  'algolia': { color: '#5468FF', name: 'Algolia' },
  'elasticsearch': { color: '#FED10A', name: 'Elasticsearch' },
  'talon-one': { color: '#FF6B6B', name: 'Talon.One' },
  'segment': { color: '#52BD95', name: 'Segment' },
  'amplitude': { color: '#FF6C37', name: 'Amplitude' },
  'dynamic-yield': { color: '#4C51BF', name: 'Dynamic Yield' },
  'adyen': { color: '#0ABF53', name: 'Adyen' },
  'stripe': { color: '#635BFF', name: 'Stripe' },
  'newstore': { color: '#FF6B35', name: 'NewStore' },
  'tulip-retail': { color: '#E53E3E', name: 'Tulip Retail' },
  'avalara': { color: '#003D6B', name: 'Avalara' },
  'sap': { color: '#0FAAFF', name: 'SAP' },
  'netsuite': { color: '#F47C3C', name: 'NetSuite' }
};

function createVendorLogo(vendorId, branding) {
  const { color, name } = branding;
  
  // Create a clean, professional logo SVG
  const logoSvg = `<svg width="120" height="40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
  <defs>
    <linearGradient id="grad-${vendorId}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners -->
  <rect width="120" height="40" rx="8" ry="8" fill="url(#grad-${vendorId})" />
  
  <!-- Icon/Symbol -->
  <circle cx="15" cy="20" r="6" fill="white" fill-opacity="0.9"/>
  <rect x="12" y="17" width="6" height="6" rx="1" fill="${color}"/>
  
  <!-- Text -->
  <text x="28" y="25" 
        font-family="Arial, sans-serif" 
        font-size="${name.length > 10 ? '10' : '12'}" 
        font-weight="600" 
        fill="white" 
        text-anchor="start">${name}</text>
</svg>`;

  return logoSvg;
}

function adjustBrightness(color, amount) {
  // Simple color brightness adjustment
  const colorValue = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (colorValue >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((colorValue >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (colorValue & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

function createAllLogos() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  
  // Ensure directory exists
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }
  
  let created = 0;
  
  Object.entries(vendorBranding).forEach(([vendorId, branding]) => {
    const logoSvg = createVendorLogo(vendorId, branding);
    const filePath = path.join(logosDir, `${vendorId}.svg`);
    
    fs.writeFileSync(filePath, logoSvg);
    console.log(`✓ Created logo for ${branding.name}`);
    created++;
  });
  
  console.log(`\n✅ Successfully created ${created} vendor logos`);
  return created;
}

// Special icons for different categories
function createCategoryIcon(category) {
  const icons = {
    user: '👤',
    business: '🏢',
    commerce_engine: '🛒',
    pim: '📦',
    cms: '📝',
    search: '🔍',
    payment: '💳',
    omnichannel: '🌐',
    analytics: '📊',
    loyalty: '🎁',
    personalization: '🎯',
    tax: '💰',
    inventory: '📋',
    order_management: '📋'
  };
  
  return icons[category] || '⚡';
}

if (require.main === module) {
  createAllLogos();
}

module.exports = { createAllLogos, createVendorLogo, createCategoryIcon };
const fs = require('fs');
const path = require('path');

// Additional vendor branding information
const newVendorBranding = {
  'shopify-plus': { color: '#7AB55C', name: 'Shopify Plus' },
  'bigcommerce': { color: '#121118', name: 'BigCommerce' },
  'spryker': { color: '#EB6C20', name: 'Spryker' },
  'kibo': { color: '#0052CC', name: 'Kibo' },
  'vue-storefront': { color: '#5ECE7B', name: 'Vue Storefront' },
  'inriver': { color: '#4B0082', name: 'inRiver' },
  'pimcore': { color: '#6C1D5F', name: 'Pimcore' },
  'plytix': { color: '#FF6B6B', name: 'Plytix' },
  'catsy': { color: '#2E8B57', name: 'Catsy' },
  'sanity': { color: '#F03E2F', name: 'Sanity' },
  'strapi': { color: '#4945FF', name: 'Strapi' },
  'directus': { color: '#263238', name: 'Directus' },
  'ghost': { color: '#15171A', name: 'Ghost' },
  'payload': { color: '#000000', name: 'Payload' },
  'constructor': { color: '#002C5F', name: 'Constructor' },
  'mollie': { color: '#5A67D8', name: 'Mollie' },
  'klarna': { color: '#FFB3C1', name: 'Klarna' },
  'mixpanel': { color: '#7856FF', name: 'Mixpanel' },
  'yotpo': { color: '#4A90E2', name: 'Yotpo' },
  'bloomreach': { color: '#4AA3DF', name: 'Bloomreach' },
  'fluent-commerce': { color: '#1B365D', name: 'Fluent Commerce' },
  'taxjar': { color: '#48BB78', name: 'TaxJar' }
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
        font-size="${name.length > 10 ? '9' : '11'}" 
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

function createNewLogos() {
  const logosDir = path.join(__dirname, '..', 'public', 'logos');
  
  // Ensure directory exists
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }
  
  let created = 0;
  
  Object.entries(newVendorBranding).forEach(([vendorId, branding]) => {
    const logoSvg = createVendorLogo(vendorId, branding);
    const filePath = path.join(logosDir, `${vendorId}.svg`);
    
    fs.writeFileSync(filePath, logoSvg);
    console.log(`✓ Created logo for ${branding.name}`);
    created++;
  });
  
  console.log(`\n✅ Successfully created ${created} new vendor logos`);
  return created;
}

if (require.main === module) {
  createNewLogos();
}

module.exports = { createNewLogos };
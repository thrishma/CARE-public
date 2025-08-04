const fs = require('fs');
const https = require('https');
const path = require('path');

// Logo URLs for each vendor
const logoUrls = {
  'commercetools': 'https://www.commercetools.com/static/images/logos/commercetools-logo-header.svg',
  'elastic-path': 'https://www.elasticpath.com/themes/custom/eplanding/logo.svg',
  'vtex': 'https://vtex.com/_next/static/media/vtex-logo.e7d2ffe6.svg',
  'akeneo': 'https://www.akeneo.com/wp-content/themes/akeneov2/dist/images/logos/akeneo-logo.svg',
  'salsify': 'https://assets-global.website-files.com/5ff3926f03b3ba26b7d639cb/60012c08c0b3ad6b5853b1d3_salsify-logo.svg',
  'contentstack': 'https://www.contentstack.com/static/images/contentstack-logo.svg',
  'contentful': 'https://images.ctfassets.net/fo9twyrwpveg/7Htleo27dKYua8gio8UEUy/0797152a2d2f8e41db49ecbf1ccbbfb5/Contentful_Logo_2020.svg',
  'storyblok': 'https://www.storyblok.com/images/storyblok-logo.svg',
  'algolia': 'https://www.algolia.com/static_assets/images/press/downloads/algolia-logo-light.svg',
  'elasticsearch': 'https://static-www.elastic.co/v3/assets/bltefdd0b53724fa2ce/blt6ae3d6980b5fd629/5bbca1d1af3a954c36f95ed3/logo-elastic.svg',
  'talon-one': 'https://www.talon.one/assets/img/logo.svg',
  'segment': 'https://segment.com/static/logos/logo-wordmark.svg',
  'amplitude': 'https://amplitude.com/static/img/amplitude-logo.svg',
  'dynamic-yield': 'https://www.dynamicyield.com/wp-content/uploads/2021/03/dynamic-yield-logo.svg',
  'adyen': 'https://www.adyen.com/static/images/logos/adyen-logo-green.svg',
  'stripe': 'https://stripe.com/img/v3/home/social.png',
  'newstore': 'https://www.newstore.com/static/images/newstore-logo.svg',
  'tulip-retail': 'https://tulip.com/wp-content/uploads/2021/07/tulip-logo.svg',
  'avalara': 'https://www.avalara.com/content/dam/avalara/public/global/brand/logos/avalara-logo.svg',
  'sap': 'https://www.sap.com/content/dam/application/shared/logos/sap-logo-svg.svg',
  'netsuite': 'https://www.netsuite.com/portal/assets/img/business-software/erp/oracle-netsuite-logo.svg'
};

async function downloadLogo(vendorId, url, retries = 3) {
  return new Promise((resolve, reject) => {
    const fileName = `${vendorId}.svg`;
    const filePath = path.join(__dirname, '..', 'public', 'logos', fileName);
    
    console.log(`Downloading logo for ${vendorId} from ${url}`);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded ${vendorId} logo`);
          resolve(fileName);
        });
        
        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {}); // Delete partial file
          reject(err);
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        if (response.headers.location && retries > 0) {
          downloadLogo(vendorId, response.headers.location, retries - 1)
            .then(resolve)
            .catch(reject);
        } else {
          reject(new Error(`Redirect limit exceeded for ${vendorId}`));
        }
      } else {
        reject(new Error(`Failed to download ${vendorId}: ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${vendorId}`));
    });
  });
}

async function fetchAllLogos() {
  const results = {
    success: [],
    failed: []
  };
  
  for (const [vendorId, url] of Object.entries(logoUrls)) {
    try {
      await downloadLogo(vendorId, url);
      results.success.push(vendorId);
    } catch (error) {
      console.error(`✗ Failed to download ${vendorId}: ${error.message}`);
      results.failed.push({ vendorId, error: error.message });
    }
    
    // Add small delay between downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n=== Logo Download Summary ===');
  console.log(`Successfully downloaded: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);
  
  if (results.failed.length > 0) {
    console.log('\nFailed downloads:');
    results.failed.forEach(({ vendorId, error }) => {
      console.log(`  - ${vendorId}: ${error}`);
    });
  }
  
  return results;
}

// Create fallback logos for failed downloads
function createFallbackLogos(failedVendors) {
  failedVendors.forEach(({ vendorId }) => {
    const fallbackSvg = `
<svg width="100" height="40" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="40" fill="#f0f0f0" stroke="#ccc"/>
  <text x="50" y="25" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">${vendorId}</text>
</svg>`;
    
    const filePath = path.join(__dirname, '..', 'public', 'logos', `${vendorId}.svg`);
    fs.writeFileSync(filePath, fallbackSvg);
    console.log(`Created fallback logo for ${vendorId}`);
  });
}

// Main execution
if (require.main === module) {
  fetchAllLogos()
    .then((results) => {
      if (results.failed.length > 0) {
        createFallbackLogos(results.failed);
      }
      console.log('\nLogo fetching complete!');
    })
    .catch((error) => {
      console.error('Error fetching logos:', error);
      process.exit(1);
    });
}

module.exports = { fetchAllLogos, createFallbackLogos };
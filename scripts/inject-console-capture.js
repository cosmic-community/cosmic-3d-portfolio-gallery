const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Script to inject console capture script into built HTML files
function injectConsoleCapture() {
  console.log('🔧 Injecting console capture script...');
  
  // Find all HTML files in build output
  const htmlFiles = glob.sync('.next/**/*.html', { ignore: '.next/cache/**/*' });
  
  if (htmlFiles.length === 0) {
    console.log('ℹ️ No HTML files found in build output');
    return;
  }
  
  const scriptTag = '<script src="/dashboard-console-capture.js"></script>';
  let injectedCount = 0;
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if already injected
      if (content.includes('dashboard-console-capture.js')) {
        return;
      }
      
      // Inject before closing head tag
      if (content.includes('</head>')) {
        content = content.replace('</head>', `  ${scriptTag}\n</head>`);
        fs.writeFileSync(filePath, content, 'utf8');
        injectedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`✅ Console capture script injected into ${injectedCount} HTML files`);
}

// Run if called directly
if (require.main === module) {
  injectConsoleCapture();
}

module.exports = injectConsoleCapture;
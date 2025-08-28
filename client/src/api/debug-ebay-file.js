const fs = require('fs');
const path = require('path');

// Read the current ebay.ts file to see its exact content
const ebayFilePath = path.join(__dirname, '..', '..', '..', 'client', 'src', 'api', 'ebay.ts');

try {
  console.log('Attempting to read ebay.ts file from:', ebayFilePath);
  
  const content = fs.readFileSync(ebayFilePath, 'utf8');
  const lines = content.split('\n');

  console.log('=== EBAY.TS FILE CONTENT ===');
  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    console.log(`${lineNumber.toString().padStart(3, ' ')}: ${line}`);
  });

  console.log('\n=== LINES AROUND ERROR (60-70) ===');
  for (let i = 59; i < 70; i++) {
    if (lines[i] !== undefined) {
      const lineNumber = i + 1;
      const marker = lineNumber === 64 ? ' <<< ERROR LINE' : '';
      console.log(`${lineNumber.toString().padStart(3, ' ')}: ${lines[i]}${marker}`);
    }
  }

  console.log('\n=== SEARCHING FOR UNCOMMENTED AWAIT ===');
  lines.forEach((line, index) => {
    if (line.includes('await') && !line.trim().startsWith('//')) {
      console.log(`Line ${index + 1}: ${line} <<< UNCOMMENTED AWAIT FOUND`);
    }
  });

  console.log('\n=== SEARCHING FOR ASYNC FUNCTIONS ===');
  lines.forEach((line, index) => {
    if (line.includes('async')) {
      console.log(`Line ${index + 1}: ${line} <<< ASYNC FUNCTION`);
    }
  });

} catch (error) {
  console.error('Error reading ebay.ts file:', error);
  console.error('Full error details:', error.message);
  console.error('Error stack:', error.stack);
  
  // Try alternative paths
  const alternativePaths = [
    path.join(__dirname, '..', '..', 'ebay.ts'),
    path.join(__dirname, '..', 'ebay.ts'),
    path.join(__dirname, 'ebay.ts'),
    path.join(process.cwd(), 'client', 'src', 'api', 'ebay.ts')
  ];
  
  console.log('\n=== TRYING ALTERNATIVE PATHS ===');
  alternativePaths.forEach(altPath => {
    try {
      console.log(`Checking path: ${altPath}`);
      if (fs.existsSync(altPath)) {
        console.log(`✓ Found file at: ${altPath}`);
        const content = fs.readFileSync(altPath, 'utf8');
        const lines = content.split('\n');
        
        console.log('=== FILE CONTENT FROM ALTERNATIVE PATH ===');
        lines.forEach((line, index) => {
          const lineNumber = index + 1;
          console.log(`${lineNumber.toString().padStart(3, ' ')}: ${line}`);
        });
      } else {
        console.log(`✗ File not found at: ${altPath}`);
      }
    } catch (altError) {
      console.log(`✗ Error accessing ${altPath}:`, altError.message);
    }
  });
}
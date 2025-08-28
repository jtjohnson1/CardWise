const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageInfo = {
  name: 'cardcat',
  version: '1.0.0',
  description: 'CardCat - Digital Card Collection Management Application',
  maintainer: 'CardCat Team <support@cardcat.app>',
  architecture: 'amd64',
  depends: 'nodejs (>= 16.0.0), mongodb-server (>= 4.4.0)'
};

const debianDir = path.join(__dirname, '..', 'debian');
const buildDir = path.join(__dirname, '..', 'build');

// Create debian package structure
function createDebianStructure() {
  console.log('Creating Debian package structure...');
  
  // Create directories
  const dirs = [
    'debian/DEBIAN',
    'debian/opt/cardcat',
    'debian/etc/systemd/system',
    'debian/usr/share/applications',
    'debian/usr/share/pixmaps'
  ];
  
  dirs.forEach(dir => {
    fs.mkdirSync(path.join(__dirname, '..', dir), { recursive: true });
  });
}

// Create control file
function createControlFile() {
  console.log('Creating control file...');
  
  const controlContent = `Package: ${packageInfo.name}
Version: ${packageInfo.version}
Section: utils
Priority: optional
Architecture: ${packageInfo.architecture}
Depends: ${packageInfo.depends}
Maintainer: ${packageInfo.maintainer}
Description: ${packageInfo.description}
 CardCat is a locally-running digital card management application that allows
 users to organize, track, and manage their sports card collections. The app
 leverages AI-powered image processing to automatically identify and catalog
 cards from scanned images.
`;

  fs.writeFileSync(path.join(debianDir, 'DEBIAN', 'control'), controlContent);
}

// Create systemd service file
function createSystemdService() {
  console.log('Creating systemd service file...');
  
  const serviceContent = `[Unit]
Description=CardCat Digital Card Management Application
After=network.target mongodb.service
Requires=mongodb.service

[Service]
Type=simple
User=cardcat
Group=cardcat
WorkingDirectory=/opt/cardcat
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/node server/server.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
`;

  fs.writeFileSync(path.join(debianDir, 'etc', 'systemd', 'system', 'cardcat.service'), serviceContent);
}

// Create desktop entry
function createDesktopEntry() {
  console.log('Creating desktop entry...');
  
  const desktopContent = `[Desktop Entry]
Version=1.0
Type=Application
Name=CardCat
Comment=Digital Card Collection Management
Exec=xdg-open http://localhost:5173
Icon=cardcat
Terminal=false
Categories=Office;Database;
`;

  fs.writeFileSync(path.join(debianDir, 'usr', 'share', 'applications', 'cardcat.desktop'), desktopContent);
}

// Create postinst script
function createPostInstScript() {
  console.log('Creating post-installation script...');
  
  const postinstContent = `#!/bin/bash
set -e

# Create cardcat user if it doesn't exist
if ! id "cardcat" &>/dev/null; then
    useradd --system --home /opt/cardcat --shell /bin/false cardcat
fi

# Set ownership and permissions
chown -R cardcat:cardcat /opt/cardcat
chmod +x /opt/cardcat/scripts/start.sh

# Install npm dependencies
cd /opt/cardcat
sudo -u cardcat npm install --production

# Build client
cd /opt/cardcat/client
sudo -u cardcat npm install --production
sudo -u cardcat npm run build

# Enable and start service
systemctl daemon-reload
systemctl enable cardcat.service
systemctl start cardcat.service

echo "CardCat has been installed successfully!"
echo "Access the application at: http://localhost:5173"
echo "Service status: systemctl status cardcat"
`;

  fs.writeFileSync(path.join(debianDir, 'DEBIAN', 'postinst'), postinstContent);
  fs.chmodSync(path.join(debianDir, 'DEBIAN', 'postinst'), '755');
}

// Create prerm script
function createPreRemoveScript() {
  console.log('Creating pre-removal script...');
  
  const prermContent = `#!/bin/bash
set -e

# Stop and disable service
systemctl stop cardcat.service || true
systemctl disable cardcat.service || true
`;

  fs.writeFileSync(path.join(debianDir, 'DEBIAN', 'prerm'), prermContent);
  fs.chmodSync(path.join(debianDir, 'DEBIAN', 'prerm'), '755');
}

// Create startup script
function createStartupScript() {
  console.log('Creating startup script...');
  
  const startScript = `#!/bin/bash
cd /opt/cardcat
export NODE_ENV=production
export PORT=3000

# Start the application
npm run start
`;

  fs.mkdirSync(path.join(debianDir, 'opt', 'cardcat', 'scripts'), { recursive: true });
  fs.writeFileSync(path.join(debianDir, 'opt', 'cardcat', 'scripts', 'start.sh'), startScript);
  fs.chmodSync(path.join(debianDir, 'opt', 'cardcat', 'scripts', 'start.sh'), '755');
}

// Copy application files
function copyApplicationFiles() {
  console.log('Copying application files...');
  
  const filesToCopy = [
    'package.json',
    'server/',
    'client/',
    '.env.example'
  ];
  
  filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, '..', file);
    const destPath = path.join(debianDir, 'opt', 'cardcat', file);
    
    if (fs.existsSync(srcPath)) {
      if (fs.statSync(srcPath).isDirectory()) {
        execSync(`cp -r "${srcPath}" "${path.dirname(destPath)}"`);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });
  
  // Create .env file from example
  const envExample = path.join(debianDir, 'opt', 'cardcat', '.env.example');
  const envFile = path.join(debianDir, 'opt', 'cardcat', '.env');
  
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, envFile);
  }
}

// Build the DEB package
function buildDebPackage() {
  console.log('Building DEB package...');
  
  const packageName = `${packageInfo.name}_${packageInfo.version}_${packageInfo.architecture}.deb`;
  const outputPath = path.join(buildDir, packageName);
  
  // Create build directory
  fs.mkdirSync(buildDir, { recursive: true });
  
  // Build the package
  execSync(`dpkg-deb --build "${debianDir}" "${outputPath}"`);
  
  console.log(`DEB package created: ${outputPath}`);
  return outputPath;
}

// Main build function
function buildDeb() {
  try {
    console.log('Starting DEB package build...');
    
    // Clean previous build
    if (fs.existsSync(debianDir)) {
      fs.rmSync(debianDir, { recursive: true, force: true });
    }
    
    createDebianStructure();
    createControlFile();
    createSystemdService();
    createDesktopEntry();
    createPostInstScript();
    createPreRemoveScript();
    createStartupScript();
    copyApplicationFiles();
    
    const packagePath = buildDebPackage();
    
    console.log('DEB package build completed successfully!');
    console.log(`Package location: ${packagePath}`);
    console.log('\nTo install:');
    console.log(`sudo dpkg -i ${packagePath}`);
    console.log('sudo apt-get install -f  # Fix any dependency issues');
    
  } catch (error) {
    console.error('Error building DEB package:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  buildDeb();
}

module.exports = { buildDeb };
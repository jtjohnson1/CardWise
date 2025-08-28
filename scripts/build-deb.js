const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Building CardWise Debian package...');

// Package information
const packageInfo = {
  name: 'cardwise',
  version: '1.0.0',
  description: 'CardWise - Digital card collection management application',
  maintainer: 'CardWise Team <team@cardwise.com>',
  architecture: 'amd64',
  depends: 'nodejs (>= 16.0), mongodb-server (>= 5.0)'
};

// Create package directory structure
const buildDir = path.join(__dirname, '..', 'build');
const debDir = path.join(buildDir, 'cardwise_1.0.0_amd64');
const debianDir = path.join(debDir, 'DEBIAN');
const optDir = path.join(debDir, 'opt', 'cardwise');
const systemdDir = path.join(debDir, 'etc', 'systemd', 'system');

// Clean and create directories
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true, force: true });
}

fs.mkdirSync(debianDir, { recursive: true });
fs.mkdirSync(optDir, { recursive: true });
fs.mkdirSync(systemdDir, { recursive: true });

// Create control file
const controlContent = `Package: ${packageInfo.name}
Version: ${packageInfo.version}
Section: web
Priority: optional
Architecture: ${packageInfo.architecture}
Depends: ${packageInfo.depends}
Maintainer: ${packageInfo.maintainer}
Description: ${packageInfo.description}
 CardWise is a locally-running digital card management application that allows
 users to organize, track, and manage their sports card collections. The app
 leverages AI-powered image processing to automatically identify and catalog
 cards from scanned images.
`;

fs.writeFileSync(path.join(debianDir, 'control'), controlContent);

// Create postinst script
const postinstContent = `#!/bin/bash
set -e

# Create cardwise user if it doesn't exist
if ! id "cardwise" &>/dev/null; then
    useradd --system --home /opt/cardwise --shell /bin/false cardwise
fi

# Set ownership
chown -R cardwise:cardwise /opt/cardwise

# Install npm dependencies
cd /opt/cardwise
sudo -u cardwise npm install --production
cd /opt/cardwise/client
sudo -u cardwise npm install --production
cd /opt/cardwise/server
sudo -u cardwise npm install --production

# Build client
cd /opt/cardwise/client
sudo -u cardwise npm run build

# Enable and start service
systemctl daemon-reload
systemctl enable cardwise
systemctl start cardwise

echo "CardWise has been installed successfully!"
echo "Access the application at http://localhost:3000"
echo "Default admin credentials: admin@cardwise.com / admin123"
`;

fs.writeFileSync(path.join(debianDir, 'postinst'), postinstContent);
fs.chmodSync(path.join(debianDir, 'postinst'), '0755');

// Create prerm script
const prermContent = `#!/bin/bash
set -e

# Stop and disable service
systemctl stop cardwise || true
systemctl disable cardwise || true
`;

fs.writeFileSync(path.join(debianDir, 'prerm'), prermContent);
fs.chmodSync(path.join(debianDir, 'prerm'), '0755');

// Create systemd service file
const serviceContent = `[Unit]
Description=CardWise Application
After=network.target mongodb.service

[Service]
Type=simple
User=cardwise
Group=cardwise
WorkingDirectory=/opt/cardwise
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
`;

fs.writeFileSync(path.join(systemdDir, 'cardwise.service'), serviceContent);

// Copy application files
console.log('Copying application files...');

// Copy package.json files
fs.copyFileSync(
  path.join(__dirname, '..', 'package.json'),
  path.join(optDir, 'package.json')
);

// Copy client
const clientSrc = path.join(__dirname, '..', 'client');
const clientDest = path.join(optDir, 'client');
execSync(`cp -r "${clientSrc}" "${clientDest}"`);

// Copy server
const serverSrc = path.join(__dirname, '..', 'server');
const serverDest = path.join(optDir, 'server');
execSync(`cp -r "${serverSrc}" "${serverDest}"`);

// Copy other files
const filesToCopy = ['.env.example', 'README.md', 'DEPLOYMENT.md'];
filesToCopy.forEach(file => {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(optDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

// Remove node_modules and other unnecessary files
const dirsToRemove = ['node_modules', '.git', 'build'];
dirsToRemove.forEach(dir => {
  const dirPath = path.join(optDir, dir);
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
});

// Build the package
console.log('Building Debian package...');
try {
  execSync(`dpkg-deb --build "${debDir}"`, { stdio: 'inherit' });
  console.log('Debian package built successfully!');
  console.log(`Package location: ${debDir}.deb`);
} catch (error) {
  console.error('Error building package:', error.message);
  process.exit(1);
}

console.log('\nInstallation instructions:');
console.log(`sudo dpkg -i ${path.basename(debDir)}.deb`);
console.log('sudo apt-get install -f  # Fix any dependency issues');
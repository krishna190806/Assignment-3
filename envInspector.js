const os = require('os');
const fs = require('fs');
const path = require('path');

// Get system details
function inspectSystem() {
  return {
    homeDir: os.homedir(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    environmentVariables: process.env,
  };
}

// Save environment info to a JSON file
function saveEnvDetails(data) {
  try {
    const logsDir = path.join(__dirname, 'logs');
    const outputPath = path.join(logsDir, 'env-details.json');

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Environment details saved to ${outputPath}`);
  } catch (err) {
    console.error('Error saving environment details:', err.message);
  }
}

// Run the inspector
function runInspector() {
  try {
    const data = inspectSystem();
    console.log('System Environment Details:');
    console.log(`Home Directory: ${data.homeDir}`);
    console.log(`Hostname: ${data.hostname}`);
    console.log('Network Interfaces:', data.networkInterfaces);
    console.log('Saving details to file...');
    saveEnvDetails(data);
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

// Execute
runInspector();

const fs = require('fs');
const path = require('path');

// Get the .env file path from command-line arguments
const envFilePath = process.argv[2];

if (!envFilePath) {
  console.error('Error: Please provide the path to the .env file as an argument.');
  process.exit(1);
}

// Resolve the full path to the .env file
const resolvedEnvFilePath = path.resolve(envFilePath);

// Check if the .env file exists
if (!fs.existsSync(resolvedEnvFilePath)) {
  console.error(`Error: The file ${resolvedEnvFilePath} does not exist.`);
  process.exit(1);
}

// Read the .env file
const envFile = fs.readFileSync(resolvedEnvFilePath, 'utf8');

// Parse the .env file
const envVars = envFile.split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) {
    acc[key.trim()] = value.trim();
  }
  return acc;
}, {});

// Create the ecosystem.config.js content
const ecosystemConfig = `
module.exports = {
  apps: [
    {
      name: 'casa_bambu', // Replace with your app name
      script: 'yarn',
      args: 'serve',
      interpreter: '/bin/bash',
      env: ${JSON.stringify(envVars, null, 2)}
    },
  ],
};
`;

// Write to ecosystem.config.js
const outputPath = path.join(path.dirname(resolvedEnvFilePath), 'ecosystem.config.js');
fs.writeFileSync(outputPath, ecosystemConfig);

console.log(`ecosystem.config.js has been created successfully at ${outputPath}.`);

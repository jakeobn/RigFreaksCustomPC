/**
 * Simple cron-like scheduler for Replit
 * This script will run in the background and execute the auto-push script
 * at regular intervals
 */

const { exec } = require('child_process');
const fs = require('fs');

// Configuration - run every 2 minutes for near-instant updates
const INTERVAL_MINUTES = 2;
const SCRIPT_PATH = './auto-push.sh';

// Create a log file
const logFile = './cron-log.txt';

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(logFile, logMessage);
}

// Check if script exists and is executable
if (!fs.existsSync(SCRIPT_PATH)) {
  log(`Error: Script not found at ${SCRIPT_PATH}`);
  process.exit(1);
}

// Make sure script is executable
exec(`chmod +x ${SCRIPT_PATH}`, (error) => {
  if (error) {
    log(`Error making script executable: ${error.message}`);
  }
});

// Function to run the script
function runScript() {
  log(`Running script: ${SCRIPT_PATH}`);
  
  exec(SCRIPT_PATH, (error, stdout, stderr) => {
    if (error) {
      log(`Error executing script: ${error.message}`);
      return;
    }
    
    if (stderr) {
      log(`Script stderr: ${stderr}`);
    }
    
    log(`Script output: ${stdout}`);
    log('Script execution completed');
  });
}

// Initial run
log('Starting Replit cron service with frequent updates');
runScript();

// Schedule regular runs
const intervalMs = INTERVAL_MINUTES * 60 * 1000;
log(`Scheduled to run every ${INTERVAL_MINUTES} minutes for near-instant updates`);

setInterval(runScript, intervalMs);
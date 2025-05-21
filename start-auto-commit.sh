#!/bin/bash

# Start the auto-commit service in the background
echo "Starting auto-commit service..."
node replit-cron.js > auto-commit.log 2>&1 &

# Save the process ID so we can stop it later if needed
echo $! > replit-cron.pid

echo "Auto-commit service started. It will push changes to GitHub every 15 minutes."
echo "Check auto-commit.log for progress updates."
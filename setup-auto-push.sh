#!/bin/bash

# Make the auto-push script executable
chmod +x ./auto-push.sh

# Create a cron job to run the script every 15 minutes
(crontab -l 2>/dev/null; echo "*/15 * * * * cd $(pwd) && ./auto-push.sh >> ./auto-push.log 2>&1") | crontab -

echo "Auto-push has been set up to run every 15 minutes."
echo "You may need to set a GITHUB_TOKEN environment variable in Replit for authentication."
echo "Go to Replit Secrets tab and add GITHUB_TOKEN with your GitHub personal access token."
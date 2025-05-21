#!/bin/bash

# Configure git if not already configured
if [ -z "$(git config --get user.email)" ]; then
  git config --global user.email "auto-push@rigfreaks.com"
  git config --global user.name "RigFreaks Auto Push"
fi

# Get GitHub token from environment
TOKEN=$(grep "GITHUB_TOKEN" .env 2>/dev/null | cut -d "=" -f2 || echo "$GITHUB_TOKEN")

# If token is found, use it for authentication
if [ -n "$TOKEN" ]; then
  echo "Using GitHub token for authentication"
  git remote set-url origin https://${TOKEN}@github.com/jakeobn/rigfreaks-ecommerce.git
else
  echo "No GitHub token found. You may need to manually authenticate."
fi

# Add all files, commit with timestamp, and push
git add .
git commit -m "Auto update from Replit - $(date)"
git push origin main

echo "Changes pushed to GitHub at $(date)"
echo ""
echo "Your changes should now be automatically deployed to Render"
echo "Check the Render dashboard to monitor deployment status"
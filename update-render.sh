#!/bin/bash

# Check if the script is being run in a git repository
if [ ! -d .git ]; then
  echo "Error: Not a git repository"
  exit 1
fi

# Add all files
git add .

# Commit the changes
git commit -m "Add debug endpoints and SSH access for Render deployment"

# Push to GitHub
git push

echo "Changes pushed to GitHub. Render will automatically deploy the updates."
echo "After deployment, use these debug endpoints:"
echo "  https://rigfreaks-ecommerce.onrender.com/api/health"
echo "  https://rigfreaks-ecommerce.onrender.com/api/debug/connection"
echo "  https://rigfreaks-ecommerce.onrender.com/api/debug/env"
echo "  https://rigfreaks-ecommerce.onrender.com/api/debug/database"
echo "  https://rigfreaks-ecommerce.onrender.com/api/debug/supabase"
echo "  https://rigfreaks-ecommerce.onrender.com/api/debug/network"
# Deployment Instructions for RigFreaks

## GitHub and Render Deployment Process

To deploy your changes from Replit to Render:

1. **Push changes to GitHub using Replit's Git UI**:
   - Click on the "Git" tab in the Replit sidebar (version control icon)
   - Stage your changes by clicking the "+" buttons next to modified files
   - Add a commit message describing your changes
   - Click "Commit & Push"

2. **Verify deployment on Render**:
   - Go to your Render dashboard: https://dashboard.render.com/
   - Check that the deployment was triggered automatically
   - Monitor the build logs for any issues
   - Once deployment is complete, visit your site to verify changes

## Environment Variables Required on Render

Make sure these environment variables are set in the Render dashboard:

- `DATABASE_URL` - PostgreSQL connection string
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `PGDATABASE`, `PGHOST`, `PGPASSWORD`, `PGPORT`, `PGUSER` - PostgreSQL connection details

## Manual Deployment on Render

If automatic deployment doesn't trigger:

1. Go to your service in the Render dashboard
2. Click "Manual Deploy" > "Deploy latest commit"

This will force Render to rebuild and deploy the latest version of your application.
# RigFreaks Frontend Deployment Guide for Vercel

This guide explains how to deploy the RigFreaks frontend on Vercel while keeping the backend separate.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Your backend API deployed and accessible at a public URL

## Deployment Steps

### Step 1: Configure Environment Variables

Before deploying, make sure to set up the proper environment variables in your Vercel project:

1. `VITE_API_BASE_URL` - The URL of your backend API (e.g., https://rigfreaks-api.your-domain.com)
2. `VITE_APP_ENV` - Set to "production"

### Step 2: Deploy to Vercel

#### Option 1: Using the Vercel CLI

1. Install the Vercel CLI if you haven't already:
   ```
   npm install -g vercel
   ```

2. Navigate to the client directory:
   ```
   cd client
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Follow the prompts to complete the deployment.

#### Option 2: Using the Vercel Web Interface

1. Push your code to a GitHub, GitLab, or Bitbucket repository.

2. Log in to Vercel and click "Import Project".

3. Select the repository containing your code.

4. Configure the project settings:
   - Framework Preset: Vite
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist

5. Add the environment variables mentioned in Step 1.

6. Click "Deploy".

### Step 3: Configure Custom Domain (Optional)

1. In your Vercel dashboard, go to your project settings.
2. Navigate to the "Domains" section.
3. Add your custom domain and follow the instructions to configure DNS settings.

## Troubleshooting

### API Connection Issues

If the frontend can't connect to your backend API:

1. Check that CORS is properly configured on your backend.
2. Verify the `VITE_API_BASE_URL` environment variable is set correctly.
3. Ensure your backend API is publicly accessible.

### Build Errors

If you encounter build errors:

1. Check the Vercel build logs for specific error messages.
2. Ensure all dependencies are correctly listed in your `package.json`.
3. Verify your Vite configuration is compatible with Vercel.

## Updating Your Deployment

To update your Vercel deployment:

1. Make changes to your code locally.
2. Commit and push to your repository if using Git integration.
3. Vercel will automatically redeploy your application.

## Need Further Help?

If you need additional assistance, check the [Vercel documentation](https://vercel.com/docs) or contact support.
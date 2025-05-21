# Render Deployment Troubleshooting Guide

## Common Deployment Issues

### ENETUNREACH Error

If you're seeing an error like this:
```
500: {"message":"connect ENETUNREACH 2a05:d01c:30c:9d0a:d119:1f9f:c63e:1a42:443 - Local (:::0)"}
```

This indicates that your device cannot reach the Render server. Here are possible solutions:

#### 1. Service Spin-up Delay
Free Render services go to sleep after periods of inactivity and need time to wake up:
- Wait 30-60 seconds after your first request to allow the service to fully spin up
- Try accessing the main URL (https://rigfreaks-ecommerce.onrender.com) first to wake up the service

#### 2. DNS Issues
Some networks may have DNS resolution problems with Render's domains:
- Try using a different network (switch from mobile data to WiFi or vice versa)
- Try using cellular data if you're on WiFi
- Try disabling any VPN or proxy services temporarily

#### 3. Check Service Status
Verify that your service is actually running:
- Check the Render dashboard for any deployment errors
- Look for any failed builds or services marked as "crashed"

#### 4. Manual Redeploy
If the service is showing as deployed but not responding:
- Try a manual redeploy from your Render dashboard
- Watch the deployment logs for any errors during the build process

## Verifying Your Deployment

Once deployed, you can check if your service is running by accessing:
```
https://rigfreaks-ecommerce.onrender.com/api/health
```

A successful response should return:
```json
{"status":"ok","timestamp":"2025-05-18T00:03:25.969Z"}
```

## Database Connection

Make sure your database connection is properly configured:
- Verify database credentials in your Render environment variables
- Make sure the DATABASE_URL is correctly set in your environment
- Check if Render can reach your database provider (especially if using Supabase)

## Troubleshooting Steps

1. Visit the main URL to wake up the service
2. Wait 30-60 seconds
3. Try accessing specific endpoints like /api/health
4. If the main URL doesn't load, check your Render dashboard for deployment errors
5. Try accessing from a different device or network
6. Check the Render logs for any errors during startup

If none of these solutions work, consider checking the Render status page for any ongoing service issues or reaching out to Render support.
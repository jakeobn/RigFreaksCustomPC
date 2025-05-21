# Render Login Troubleshooting Guide

This guide will help you troubleshoot the "ENETUNREACH" error when trying to log in to your RigFreaks application deployed on Render.

## Quick Fix Steps

1. **Wake up the service**:
   - Visit the main site URL first: https://rigfreaks-ecommerce.onrender.com
   - Wait 30-60 seconds for the service to fully wake up

2. **Check service health**:
   - Visit the health endpoint: https://rigfreaks-ecommerce.onrender.com/api/health
   - You should see a JSON response with `{"status":"ok"}`

3. **Try debug endpoints**:
   - Basic connection: https://rigfreaks-ecommerce.onrender.com/api/debug/connection
   - Environment check: https://rigfreaks-ecommerce.onrender.com/api/debug/env
   - Database connection: https://rigfreaks-ecommerce.onrender.com/api/debug/database
   - Supabase connection: https://rigfreaks-ecommerce.onrender.com/api/debug/supabase

4. **Network troubleshooting**:
   - Switch between WiFi and mobile data
   - Try from a different device
   - Disable any VPN or proxy services
   - Clear your browser cache or try an incognito window

## Understanding the Error

The "ENETUNREACH" error (Network Unreachable) occurs when your device cannot establish a route to the server. This usually happens because:

1. The server is in sleep mode (common with Render's free tier)
2. Network routing issues between your device and Render's servers
3. DNS resolution problems
4. Temporary network outages

## Detailed Troubleshooting

### 1. Check Render Dashboard

1. Log in to your Render dashboard
2. Check if your service is running (should show "Live")
3. Look for any deploy errors in the logs
4. If needed, trigger a manual redeploy with "Clear build cache & deploy"

### 2. Verify Environment Variables

Make sure these variables are set in your Render dashboard:
- DATABASE_URL
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- PGDATABASE, PGHOST, PGPASSWORD, PGPORT, PGUSER

You can check if they're properly configured by visiting:
https://rigfreaks-ecommerce.onrender.com/api/debug/env

### 3. Test Database Connection

The login system requires database access. Test if your app can access the database:
https://rigfreaks-ecommerce.onrender.com/api/debug/database

### 4. Test From Multiple Networks

The ENETUNREACH error often affects some networks but not others:
- Try from home WiFi
- Try from mobile data
- Try public WiFi
- Try with and without VPN

### 5. Admin Login Specific Issues

If you can access other parts of the site but login specifically fails:
1. Clear browser cookies for the site
2. Try a different browser
3. Confirm you're using the correct credentials:
   - Email: admin@rigfreaks.com
   - Password: admin123

## Still Having Problems?

If you've tried all these steps and still can't log in:

1. Contact Render support to check for any service issues
2. Consider upgrading from the free tier to eliminate sleep mode
3. Check your network configuration (especially mobile carriers sometimes block certain ports)
4. SSH into your Render instance to check logs directly (if you have SSH access enabled)

For any additional assistance, please reach out with the specific error messages you're seeing and which debug endpoints are working or failing.
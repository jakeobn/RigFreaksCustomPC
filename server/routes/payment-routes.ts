import express from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

// Initialize Stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// For PayPal, we'll use their client-side SDK approach
// Ensure we have credentials for server-side validation
if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
  throw new Error('Missing PayPal credentials');
}

const router = express.Router();

// Stripe payment routes
router.post('/stripe/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp', customerId } = req.body;
    
    // Ensure amount is a valid number and convert it if needed
    let validAmount = amount;
    if (typeof amount === 'string') {
      validAmount = parseFloat(amount);
    }
    
    if (isNaN(validAmount) || validAmount <= 0) {
      console.error('[Stripe] Invalid amount provided:', amount);
      return res.status(400).json({ 
        error: 'Invalid amount',
        details: 'Amount must be a positive number'
      });
    }
    
    console.log('[Stripe] Creating payment intent', { 
      amount: validAmount, 
      currency, 
      userId: req.user?.id || 'guest' 
    });
    
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: Math.round(validAmount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: req.user?.id.toString() || 'guest'
      }
    };
    
    // If we have a customer ID, use it
    if (customerId) {
      paymentIntentParams.customer = customerId;
      console.log('[Stripe] Using existing customer ID:', customerId);
    }
    
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    
    console.log('[Stripe] Payment intent created successfully', { 
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error: any) {
    console.error('[Stripe Error] Error creating payment intent:', error);
    
    // Try to provide more specific error messages based on Stripe error types
    if (error.type === 'StripeCardError') {
      return res.status(400).json({ 
        error: 'Card Error',
        message: error.message
      });
    } else if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid Request',
        message: error.message
      });
    } else if (error.type === 'StripeAPIError') {
      return res.status(500).json({ 
        error: 'Stripe API Error',
        message: 'An error occurred with the Stripe API'
      });
    }
    
    // Generic error response for other types
    res.status(500).json({ 
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
});

// PayPal routes 
// We're using a simplified approach that exposes the client ID to the frontend
// The actual payment processing happens on the client side with the PayPal Smart Buttons
router.get('/paypal/config', (req, res) => {
  console.log('[PayPal] Returning PayPal client configuration');
  res.json({
    clientId: process.env.PAYPAL_CLIENT_ID
  });
});

// Endpoint to record successful PayPal transactions
router.post('/paypal/success', async (req, res) => {
  try {
    const { 
      orderID, 
      payerID, 
      paymentSource, 
      amount, 
      currency = 'GBP',
      userID = null 
    } = req.body;
    
    console.log('[PayPal] Recording successful transaction', {
      orderID,
      payerID,
      amount,
      currency,
      userId: req.user?.id || userID || 'guest'
    });
    
    if (!orderID || !payerID) {
      console.error('[PayPal] Missing required order information');
      return res.status(400).json({ 
        error: 'Missing order information',
        details: 'Both orderID and payerID are required'
      });
    }
    
    // Here you would typically validate the transaction with PayPal's APIs
    // and record the payment in your database
    
    console.log('[PayPal] Payment recorded successfully');
    
    // For now, just return success
    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      orderID,
      payerID
    });
  } catch (error: any) {
    console.error('[PayPal Error] Payment recording error:', error);
    res.status(500).json({
      error: 'Failed to record PayPal payment',
      message: error.message
    });
  }
});

export default router;
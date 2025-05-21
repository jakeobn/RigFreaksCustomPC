import React, { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { stripeLogger } from '@/utils/stripeLogger';

// Load Stripe outside of a component's render to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface StripeCheckoutFormProps {
  clientSecret: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const CheckoutForm = ({ clientSecret, onSuccess, onError }: StripeCheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      stripeLogger.error("Stripe.js hasn't loaded");
      return;
    }

    setIsLoading(true);
    setErrorMessage(undefined);
    
    stripeLogger.info("Processing payment submission");

    try {
      stripeLogger.info("Confirming payment");
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        stripeLogger.error("Payment confirmation failed", { 
          code: error.code,
          type: error.type,
          message: error.message
        });
        setErrorMessage(error.message);
        onError(new Error(error.message || 'An unexpected error occurred'));
      } else {
        // Payment succeeded
        stripeLogger.info("Payment successful", { 
          paymentIntentId: paymentIntent?.id,
          status: paymentIntent?.status
        });
        
        // After payment success, update component stock
        try {
          // Get the current cart to identify components to be purchased
          const cartResponse = await fetch('/api/cart');
          const cart = await cartResponse.json();
          
          if (cart && cart.items && cart.items.length > 0) {
            // Extract component data from custom PC builds in the cart
            const components: {id: string, quantity: number}[] = [];
            
            for (const item of cart.items) {
              // Check if this is a custom PC build
              if (item.productId === 9999 && item.properties && item.properties.components) {
                try {
                  // Parse the components JSON
                  const buildComponents = JSON.parse(item.properties.components);
                  
                  // Add each component with quantity from the build
                  for (const category in buildComponents) {
                    if (buildComponents[category] && buildComponents[category].id) {
                      components.push({
                        id: buildComponents[category].id,
                        quantity: item.quantity || 1
                      });
                    }
                  }
                } catch (e) {
                  stripeLogger.error("Failed to parse component data", e);
                }
              }
            }
            
            // Only process if we have components to update
            if (components.length > 0) {
              stripeLogger.info("Updating stock for components", { count: components.length });
              
              // Call the order completion endpoint
              await apiRequest('POST', '/api/order/complete', { components });
              
              // Clear the cart after successful order
              await apiRequest('POST', '/api/cart/clear');
            }
          }
        } catch (err) {
          stripeLogger.error("Failed to update component stock", err);
          // Don't fail the payment process if stock update fails
          // This is a background task that shouldn't block the user experience
        }
        
        onSuccess();
      }
    } catch (err) {
      const error = err as Error;
      stripeLogger.error("Unexpected payment error", error);
      setErrorMessage(error.message);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-md text-red-300 text-sm">
          {errorMessage}
        </div>
      )}
      
      <Button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full h-12" 
        type="submit"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Pay Now'
        )}
      </Button>
    </form>
  );
};

interface StripeCreditCardFormProps {
  amount: number;
  currency?: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const StripeCreditCardForm = ({ 
  amount,
  currency = 'GBP',
  onSuccess,
  onError
}: StripeCreditCardFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    // Create PaymentIntent as soon as the component loads
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        stripeLogger.info("Creating payment intent", { amount, currency });
        
        const response = await apiRequest('POST', '/api/payment/stripe/create-payment-intent', {
          amount: amount,
          currency: currency
        });
        
        const data = await response.json();
        stripeLogger.info("Payment intent created", { 
          paymentIntentId: data.paymentIntentId,
          hasClientSecret: !!data.clientSecret
        });
        
        if (isMounted) {
          setClientSecret(data.clientSecret);
          setLoading(false);
        }
      } catch (err) {
        stripeLogger.error("Failed to create payment intent", err);
        if (isMounted) {
          onError(err as Error);
          setLoading(false);
        }
      }
    };

    createPaymentIntent();
    
    return () => {
      isMounted = false;
    };
  }, [amount, currency, onError]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-4 bg-red-900/30 border border-red-800 rounded-md text-red-300">
        Unable to initialize payment form. Please try again later.
      </div>
    );
  }

  // Only render Elements when we have a clientSecret
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm 
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
};

export default StripeCreditCardForm;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Import payment components
import StripeCreditCardForm from '@/components/payment/StripeCreditCardForm';
import PayPalButton from '@/components/payment/PayPalButton';

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [amount, setAmount] = useState(0);

  // Define cart item interface
  interface CartItem {
    id: number;
    productId: number;
    price: string | number;
    quantity: number;
    properties?: {
      components?: string;
      [key: string]: any;
    };
    [key: string]: any;
  }

  // Define cart interface
  interface Cart {
    id: string;
    items: CartItem[];
    totalQuantity: number;
    totalPrice: string | number;
    [key: string]: any;
  }

  // Fetch cart data
  const { data: cart, isLoading: isCartLoading } = useQuery<Cart>({
    queryKey: ['/api/cart'],
  });

  // Calculate total amount from cart
  useEffect(() => {
    if (cart && typeof cart === 'object') {
      // Make sure cart.items exists and is an array
      if (cart.items && Array.isArray(cart.items)) {
        const total = cart.items.reduce((sum: number, item: CartItem) => {
          const price = typeof item.price === 'string' 
            ? parseFloat(item.price) 
            : (typeof item.price === 'number' ? item.price : 0);
          
          return sum + (price * item.quantity);
        }, 0);
        
        console.log('Calculated cart total:', total);
        setAmount(total);
      }
    }
  }, [cart]);

  const handlePaymentSuccess = async () => {
    toast({
      title: "Payment Successful",
      description: "Your order has been placed successfully.",
      variant: "default",
    });
    
    // Process stock reduction for components
    try {
      if (cart && cart.items && Array.isArray(cart.items) && cart.items.length > 0) {
        // Extract component data from custom PC builds in the cart
        const components: {id: string, quantity: number}[] = [];
        
        for (const item of cart.items) {
          // Check if this is a custom PC build
          if (item.productId === 9999 && item.properties && typeof item.properties === 'object' && item.properties.components) {
            try {
              // Parse the components JSON
              const buildComponents = JSON.parse(item.properties.components as string);
              
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
              console.error("Failed to parse component data", e);
            }
          }
        }
        
        // Only process if we have components to update
        if (components.length > 0) {
          console.log("Updating stock for components", { count: components.length });
          
          // Call the order completion endpoint
          const response = await fetch('/api/order/complete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ components })
          });
          
          // Also clear the cart
          await fetch('/api/cart/clear', { method: 'POST' });
          
          if (!response.ok) {
            console.error("Failed to update component stock");
          }
        }
      }
    } catch (err) {
      console.error("Error processing stock updates:", err);
      // Don't block the user flow if background processing fails
    }
    
    // Redirect to order confirmation page
    setTimeout(() => {
      setLocation('/order-confirmation');
    }, 2000);
  };

  const handlePaymentError = (error: Error) => {
    toast({
      title: "Payment Failed",
      description: error.message || "An error occurred while processing your payment.",
      variant: "destructive",
    });
    setIsProcessing(false);
  };

  if (isCartLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // If cart is empty, show message and link to products
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card className="border-border bg-dark-card">
          <CardHeader>
            <CardTitle>Your Cart is Empty</CardTitle>
            <CardDescription>
              Add some products to your cart before proceeding to checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <Button onClick={() => setLocation('/')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Main checkout column */}
        <div className="md:col-span-3">
          <Card className="border-border bg-dark-card">
            <CardHeader>
              <CardTitle>Checkout</CardTitle>
              <CardDescription>
                Complete your purchase securely
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="card" className="w-full" onValueChange={(value) => setPaymentMethod(value as 'card' | 'paypal')}>
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="card">Credit / Debit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                </TabsList>
                
                <TabsContent value="card" className="space-y-4">
                  {amount > 0 ? (
                    <StripeCreditCardForm 
                      amount={amount}
                      onSuccess={handlePaymentSuccess} 
                      onError={handlePaymentError}
                    />
                  ) : (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-primary text-center">
                      Your cart is empty. Add items to proceed with checkout.
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="paypal">
                  <div className="flex flex-col items-center justify-center py-4">
                    <p className="mb-6 text-center text-muted-foreground">
                      Pay quickly and securely with PayPal.
                    </p>
                    {amount > 0 ? (
                      <>
                        <PayPalButton 
                          amount={amount.toString()} 
                          currency="GBP"
                          intent="CAPTURE"
                          onSuccess={handlePaymentSuccess}
                          onError={(error) => {
                            // If PayPal fails due to authentication issues, provide a more user-friendly message
                            if (error.message?.includes('Failed to initialize PayPal') || 
                                error.message?.includes('invalid_client')) {
                              handlePaymentError(new Error('PayPal checkout is temporarily unavailable. Please use credit card instead.'));
                            } else {
                              handlePaymentError(error);
                            }
                          }}
                        />
                        <p className="mt-4 text-sm text-muted-foreground italic">
                          Note: If PayPal is not working, you can use credit/debit card instead.
                        </p>
                      </>
                    ) : (
                      <div className="p-4 bg-primary/10 border border-primary/20 rounded-md text-primary text-center">
                        Your cart is empty. Add items to proceed with checkout.
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        {/* Order summary column */}
        <div className="md:col-span-2">
          <Card className="border-border bg-dark-card">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cart items */}
              <div className="space-y-3">
                {cart.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">£{parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total */}
              <div className="flex justify-between pt-4 font-bold">
                <span>Total</span>
                <span>£{amount.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">
                By proceeding with your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
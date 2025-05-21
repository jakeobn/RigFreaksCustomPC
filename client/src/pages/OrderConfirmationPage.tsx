import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function OrderConfirmationPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Card className="border-border bg-dark-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-4">
            <p className="mb-6">
              Your order has been successfully placed. You will receive a confirmation email shortly.
            </p>
            <p className="text-muted-foreground">
              Your new PC will be custom-built and shipped within 3-5 business days.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button onClick={() => setLocation('/')}>
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => setLocation('/account/orders')}>
              View Order Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
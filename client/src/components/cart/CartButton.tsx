import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';

interface CartButtonProps {
  productId: number;
  productTitle: string;
  price: number;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  className?: string;
  quantity?: number;
}

export default function CartButton({
  productId,
  productTitle,
  price,
  variant = 'default',
  size = 'default',
  showIcon = true,
  className = '',
  quantity = 1
}: CartButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/cart/add', {
        productId,
        quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cart'] });
      
      // Show success state briefly
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      toast({
        title: 'Added to cart',
        description: `${productTitle} has been added to your cart.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error adding to cart',
        description: error.message || 'Could not add product to cart.',
        variant: 'destructive',
      });
    }
  });

  const goToCheckout = () => {
    setLocation('/checkout');
  };

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={() => addToCartMutation.mutate()}
        disabled={addToCartMutation.isPending || showSuccess}
      >
        {addToCartMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Adding...
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Added
          </>
        ) : (
          <>
            {showIcon && <ShoppingCart className="mr-2 h-4 w-4" />}
            Add to Cart
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size={size}
        className={className}
        onClick={goToCheckout}
      >
        Buy Now
      </Button>
    </div>
  );
}
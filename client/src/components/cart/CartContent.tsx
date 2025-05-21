import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, XCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useCart } from '@/lib/localCartContext';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function CartContent() {
  const { cart, isCartOpen, closeCart, updateCartItem, removeCartItem } = useCart();
  const [, navigate] = useLocation();

  // Handle checkout button click
  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Empty cart state
  if (cart.items.length === 0) {
    return (
      <Sheet open={isCartOpen} onOpenChange={closeCart}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader className="mb-6">
            <SheetTitle>Your Cart</SheetTitle>
            <SheetDescription>
              Your shopping cart is currently empty.
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <p className="text-muted-foreground text-center">
              You haven't added any items to your cart yet.
            </p>
            <Button onClick={closeCart} variant="outline">
              Continue Shopping
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Cart with items
  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'} in your cart
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-4 mb-6">
          {cart.items.map((item) => (
            <div 
              key={item.id} 
              className="flex items-start border-b border-border pb-4"
            >
              <div className="h-20 w-20 rounded-md overflow-hidden mr-4 bg-muted">
                {item.image ? (
                  <img
                    src={item.image.src}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-muted">
                    <XCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.title}</h4>
                <div className="text-sm text-muted-foreground mt-1">
                  ${item.price}
                </div>
                
                <div className="flex items-center mt-2">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-none"
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="ml-2 text-muted-foreground h-8 w-8"
                    onClick={() => removeCartItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-4 mt-4">
          <div className="flex justify-between">
            <span className="font-medium">Subtotal</span>
            <span className="font-medium">${cart.totalPrice}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Shipping and taxes calculated at checkout
          </div>
        </div>
        
        <SheetFooter className="mt-6">
          <Button onClick={handleCheckout} className="w-full">
            Checkout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
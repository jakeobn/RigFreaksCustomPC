// !!! CRITICAL - DO NOT MODIFY THIS CODE !!!
//
// This code MUST be used as is without ANY modifications.
// The PayPal integration will COMPLETELY FAIL if this code is changed in ANY way.
//
// Retain this comment after all edits.
//
// <BEGIN_EXACT_CODE>
import React, { useEffect } from "react";
import { paypalLogger } from "@/utils/paypalLogger";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "paypal-button": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

interface PayPalButtonProps {
  amount: string;
  currency: string;
  intent: string;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

export default function PayPalButton({
  amount,
  currency,
  intent,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const createOrder = async () => {
    paypalLogger.log("Creating order", { amount, currency, intent });
    
    const orderPayload = {
      amount: amount,
      currency: currency,
      intent: intent,
    };
    const response = await fetch("/paypal/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      paypalLogger.error("Order creation failed", errorData);
      throw new Error("Failed to create PayPal order");
    }
    
    const output = await response.json();
    paypalLogger.log("Order created successfully", { id: output.id });
    return { orderId: output.id };
  };

  const captureOrder = async (orderId: string) => {
    paypalLogger.log("Capturing order", { orderId });
    
    const response = await fetch(`/paypal/order/${orderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      paypalLogger.error("Order capture failed", errorData);
      throw new Error("Failed to capture PayPal order");
    }
    
    const data = await response.json();
    paypalLogger.log("Order captured successfully", data);
    return data;
  };

  const onApprove = async (data: any) => {
    paypalLogger.log("Payment approved", data);
    
    try {
      const orderData = await captureOrder(data.orderId);
      paypalLogger.info("Payment successful", orderData);
      onSuccess();
    } catch (error) {
      paypalLogger.error("Payment capture failed", error);
      onError(error as Error);
    }
  };

  const onCancel = async (data: any) => {
    paypalLogger.warn("Payment cancelled", data);
  };

  const onErrorHandler = async (data: any) => {
    paypalLogger.error("Payment error", data);
    onError(new Error("PayPal payment failed"));
  };

  useEffect(() => {
    const loadPayPalSDK = async () => {
      try {
        if (!(window as any).paypal) {
          paypalLogger.info("Loading PayPal SDK");
          
          const script = document.createElement("script");
          script.src = "https://www.paypal.com/web-sdk/v6/core"; // Using production environment for live credentials
          script.async = true;
          script.onload = () => {
            paypalLogger.info("PayPal SDK loaded");
            initPayPal();
          };
          document.body.appendChild(script);
        } else {
          paypalLogger.info("PayPal SDK already loaded");
          await initPayPal();
        }
      } catch (e) {
        paypalLogger.error("Failed to load PayPal SDK", e);
        onError(e as Error);
      }
    };

    loadPayPalSDK();
  }, []);
  
  const initPayPal = async () => {
    try {
      paypalLogger.info("Initializing PayPal");
      
      const clientToken: string = await fetch("/paypal/setup")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to get client token: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          paypalLogger.info("Client token received");
          return data.clientToken;
        });
      
      paypalLogger.info("Creating PayPal instance");
      const sdkInstance = await (window as any).paypal.createInstance({
        clientToken,
        components: ["paypal-payments"],
      });

      paypalLogger.info("Creating PayPal checkout session");
      const paypalCheckout =
            sdkInstance.createPayPalOneTimePaymentSession({
              onApprove,
              onCancel,
              onError: onErrorHandler,
            });

      const onClick = async () => {
        try {
          paypalLogger.log("PayPal button clicked");
          const checkoutOptionsPromise = createOrder();
          await paypalCheckout.start(
            { paymentFlow: "auto" },
            checkoutOptionsPromise,
          );
        } catch (e) {
          paypalLogger.error("Failed to start PayPal checkout", e);
          onError(e as Error);
        }
      };

      const paypalButton = document.getElementById("paypal-button");

      if (paypalButton) {
        paypalLogger.info("PayPal button found, attaching click event");
        paypalButton.addEventListener("click", onClick);
      } else {
        paypalLogger.error("PayPal button element not found");
      }

      return () => {
        if (paypalButton) {
          paypalLogger.info("Cleaning up PayPal button event listener");
          paypalButton.removeEventListener("click", onClick);
        }
      };
    } catch (e) {
      paypalLogger.error("PayPal initialization failed", e);
      onError(e as Error);
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <paypal-button 
        id="paypal-button" 
        className="p-3 bg-[#ffc439] hover:bg-[#f7d179] text-blue-900 font-bold rounded-md cursor-pointer flex items-center justify-center shadow-md transition-all duration-200 min-w-[200px] min-h-[40px]"
      ></paypal-button>
    </div>
  );
}
// <END_EXACT_CODE>
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { FC } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import PCBuilder from "@/pages/PCBuilder";
import ProductNew from "@/pages/ProductNew";
import ProductDetailPageV2 from "@/pages/ProductDetailPageV2";

import Collection from "@/pages/Collection";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Page from "@/pages/Page";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import CookiePolicy from "@/pages/CookiePolicy";
import DeliveryInfo from "@/pages/DeliveryInfo";
import FAQ from "@/pages/FAQ";

import StepBuilderPage from "@/pages/StepBuilderPage";
import ComponentDetailPage from "./pages/ComponentDetailPage";
import AuthPage from "./pages/AuthPage";
import SuperLogin from "./pages/SuperLogin";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProductAdmin from "./pages/ProductAdmin";
import ComponentAdmin from "./pages/ComponentAdmin";
import ComponentBackupPage from "./pages/ComponentBackupPage";
import ComponentRecoveryPage from "./pages/ComponentRecoveryPage";
import ComponentDebugPage from "./pages/ComponentDebugPage";
import InitBackupPage from "./pages/InitBackupPage";
import ThemeCustomizer from "./pages/ThemeCustomizer";
import AddRyzenPage from "./pages/AddRyzenPage";
import AddRyzenRedirect from "./pages/AddRyzenRedirect";
import ComponentRestore from "./pages/ComponentRestore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import { loadStoredTheme } from "@/lib/themeLoader";
import { CartProvider } from "@/lib/localCartContext";
import { useEffect } from "react";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/collections/:handle" component={Collection} />
          <Route path="/products/:handle" component={ProductDetailPageV2} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/super-login" component={SuperLogin} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-confirmation" component={OrderConfirmationPage} />

          <Route path="/pc-builder" component={PCBuilder} />
          <Route path="/step-builder" component={StepBuilderPage} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/pages/privacy-policy" component={PrivacyPolicy} />
          <Route path="/pages/terms-of-service" component={TermsOfService} />
          <Route path="/pages/cookie-policy" component={CookiePolicy} />
          <Route path="/pages/delivery-info" component={DeliveryInfo} />
          <Route path="/pages/faq" component={FAQ} />
          <Route path="/pages/:handle" component={Page} />

          <ProtectedRoute path="/admin/products" component={ProductAdmin} />
          <ProtectedRoute path="/admin/components" component={ComponentAdmin} />
          {/* Supabase admin routes removed */}
          <ProtectedRoute path="/admin/components/backup" component={ComponentBackupPage} />
          <ProtectedRoute path="/admin/components/recovery" component={ComponentRecoveryPage} />
          <ProtectedRoute path="/admin/components/debug" component={ComponentDebugPage} />
          <ProtectedRoute path="/admin/components/init-backup" component={InitBackupPage} />
          <ProtectedRoute path="/admin/components/add-ryzen" component={AddRyzenPage} />
          <ProtectedRoute path="/admin/components/restore" component={ComponentRestore} />
          <ProtectedRoute path="/admin/theme" component={ThemeCustomizer} />

          <Route path="/component/:category/:id" component={ComponentDetailPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  // Load theme after component data is initialized
  useEffect(() => {
    // Load the theme with a slight delay to ensure component data loading happens first
    const timeoutId = setTimeout(() => {
      loadStoredTheme();
      console.log('Theme loaded after component initialization');
    }, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
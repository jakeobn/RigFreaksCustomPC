import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { FileText } from "lucide-react";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle scrolling and highlighting active section
  useEffect(() => {
    const sections = document.querySelectorAll('.policy-section');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setActiveSection(id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );
    
    sections.forEach(section => {
      observer.observe(section);
    });
    
    // Add smooth scrolling for sidebar links
    const handleSidebarClick = (e: MouseEvent, targetId: string) => {
      e.preventDefault();
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(targetId);
      }
    };
    
    const sidebarLinks = document.querySelectorAll('.policy-sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const targetId = href.substring(1);
          handleSidebarClick(e as MouseEvent, targetId);
        }
      });
    });
    
    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const sections = [
    { id: "use-of-website", title: "Use of Website" },
    { id: "products-listings", title: "Products & Listings" },
    { id: "orders-payment", title: "Orders & Payment" },
    { id: "compatibility", title: "Compatibility" },
    { id: "shipping-delivery", title: "Shipping & Delivery" },
    { id: "returns-refunds", title: "Returns & Refunds" },
    { id: "warranty-liability", title: "Warranty & Liability" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "user-accounts", title: "User Accounts" },
    { id: "governing-law", title: "Governing Law" },
    { id: "amendments", title: "Amendments" }
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | RigFreaks</title>
        <meta name="description" content="Learn about the terms and conditions that govern your use of RigFreaks website and services." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <FileText className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Terms & Conditions</h1>
            <p className="text-muted-foreground text-center max-w-2xl mt-4">
              These Terms govern your use of the RigFreaks website. By using our site, you agree to these terms.
            </p>
          </div>
        </Container>
      </div>
      
      <Container className="py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-[250px] shrink-0">
            <div className="policy-sidebar sticky top-20">
              <div className="border border-border rounded-md overflow-hidden">
                <ul className="divide-y divide-border">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a 
                        href={`#${section.id}`}
                        className={`block px-4 py-3 text-sm transition-colors hover:bg-primary hover:text-white ${
                          activeSection === section.id ? 'bg-primary text-white' : 'text-foreground'
                        }`}
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            <div className="effective-date mb-6 text-sm text-muted-foreground">
              Effective Date: May 8, 2025
            </div>
            
            <p className="mb-6">
              These terms and conditions outline the rules and regulations for the use of RigFreaks' website and services. By accessing this website, we assume you accept these terms and conditions in full.
            </p>
            
            <div id="use-of-website" className="policy-section mt-10 mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">1. Use of Website</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>You must be at least 18 years old to use or purchase from our site</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>You agree not to misuse the website or commit fraudulent, abusive, or illegal acts</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Any disruption or unauthorized access to the website is prohibited</p>
                </li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <p className="text-sm italic">
                  Our Terms apply to all visitors, users, and others who access or use our website and services. If you disagree with any part of these terms, please refrain from using our website.
                </p>
              </div>
            </div>
            
            <div id="products-listings" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">2. Products and Listings</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Product descriptions, specifications, and pricing may change without notice</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>We strive for accuracy but cannot guarantee all content is fully accurate</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Availability of products is not guaranteed</p>
                </li>
              </ul>
              
              <div className="bg-warning/10 p-4 rounded-lg text-warning-foreground mt-6">
                <h3 className="font-bold mb-2 text-warning">Important Notice</h3>
                <p className="text-sm">
                  While we make every effort to display accurate colors and details, we cannot guarantee that your computer's display accurately represents the actual products.
                </p>
              </div>
            </div>
            
            <div id="orders-payment" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">3. Orders and Payment</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Orders are only confirmed once accepted by RigFreaks</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Prices are listed in GBP (£) and may include VAT unless stated otherwise</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Payment must be made in full at the time of order</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>We reserve the right to cancel any order at our discretion</p>
                </li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-bold text-accent mb-2">Secure Payments</h3>
                  <p className="text-sm">
                    We use industry-standard encryption to protect your payment information during transmission.
                  </p>
                </div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <h3 className="font-bold text-accent mb-2">Order Verification</h3>
                  <p className="text-sm">
                    We may contact you to verify your identity for high-value or suspicious orders.
                  </p>
                </div>
              </div>
            </div>
            
            <div id="compatibility" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">4. Compatibility</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Our configurator helps select compatible parts but does not guarantee 100% compatibility</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Customers must verify final compatibility before placing an order</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>RigFreaks is not liable for issues from incompatible selections made by customers</p>
                </li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <h3 className="font-bold mb-2">PC Builder Tool Disclaimer</h3>
                <p className="text-sm">
                  While our PC Builder tool is designed to assist you in creating compatible systems, the final responsibility for ensuring all components work together lies with you. We recommend researching component compatibility before finalizing your build.
                </p>
              </div>
            </div>
            
            <div id="shipping-delivery" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">5. Shipping and Delivery</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Delivery times are estimates and not guaranteed</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Risk of damage passes to the customer once the order is handed to the delivery service</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Customers must provide accurate shipping information</p>
                </li>
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="font-bold mb-2">Shipping Options</h3>
                  <p className="text-sm">
                    We offer standard, express, and overnight shipping depending on your location. Custom PCs may require additional processing time before shipping.
                  </p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4">
                  <h3 className="font-bold mb-2">International Shipping</h3>
                  <p className="text-sm">
                    For international orders, customers are responsible for all import duties, taxes, and customs clearance fees.
                  </p>
                </div>
              </div>
            </div>
            
            <div id="returns-refunds" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">6. Returns and Refunds</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Products can be returned within 14 days of delivery (UK consumer law)</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Custom-built PC systems may not be eligible for return</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Returns must be in unused condition with original packaging</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Refunds are issued to the original payment method</p>
                </li>
              </ul>
              
              <div className="bg-warning/10 p-4 rounded-lg text-warning-foreground mt-6">
                <h3 className="font-bold text-warning mb-2">Return Process</h3>
                <p className="text-sm">
                  To initiate a return, please contact our customer service team within 14 days of receiving your order. All returned items will be inspected before a refund is processed.
                </p>
              </div>
            </div>
            
            <div id="warranty-liability" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">7. Warranty and Liability</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>RigFreaks does not provide extended warranties unless stated</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>We are not liable for damage caused by user error or third-party modifications</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Liability for indirect or consequential loss is excluded where permitted by law</p>
                </li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <p className="text-sm italic">
                  All products come with standard manufacturer warranties. Our components are sourced from authorized distributors to ensure warranty validity. For detailed warranty information on specific components, please refer to the manufacturer's website.
                </p>
              </div>
            </div>
            
            <div id="intellectual-property" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">8. Intellectual Property</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>All site content is owned or licensed by RigFreaks</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Content may not be copied or reproduced without permission</p>
                </li>
              </ul>
              
              <div className="bg-card rounded-lg border border-border p-4 mt-6">
                <h3 className="font-bold mb-2">Protected Content</h3>
                <p className="text-sm">
                  Our intellectual property includes, but is not limited to, our logo, website design, images, text, graphics, button icons, audio clips, digital downloads, data compilations, and software.
                </p>
              </div>
            </div>
            
            <div id="user-accounts" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">9. User Accounts</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>You are responsible for maintaining the confidentiality of your account</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>You must notify us immediately of any unauthorized account use</p>
                </li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <h3 className="font-bold mb-2">Account Security</h3>
                <p className="text-sm">
                  We recommend using strong, unique passwords and enabling two-factor authentication if available. You are solely responsible for all activities that occur under your account.
                </p>
              </div>
            </div>
            
            <div id="governing-law" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">10. Governing Law</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>These Terms are governed by the laws of England and Wales</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Disputes are subject to the exclusive jurisdiction of the courts of England and Wales</p>
                </li>
              </ul>
              
              <div className="bg-accent/10 p-4 rounded-lg mt-6">
                <h3 className="font-bold text-accent mb-2">Dispute Resolution</h3>
                <p className="text-sm">
                  In the event of any dispute arising out of or in connection with these Terms, we encourage you to contact us first to seek an amicable resolution before pursuing legal action.
                </p>
              </div>
            </div>
            
            <div id="amendments" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">11. Amendments</h2>
              
              <ul className="space-y-4 mb-6">
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>We may update these Terms at any time</p>
                </li>
                <li className="bg-card p-4 rounded-lg border border-border/50">
                  <p>Continued use of the site after changes constitutes acceptance</p>
                </li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <h3 className="font-bold mb-2">Notification of Changes</h3>
                <p className="text-sm">
                  We will notify users of significant changes to these Terms by posting a notice on our website or sending an email to registered users. We encourage you to review these Terms periodically for any updates.
                </p>
              </div>
            </div>
            
            <div id="contact-us" className="policy-section mb-10">
              <h2 className="text-2xl font-semibold text-primary mb-5">12. Contact Us</h2>
              
              <p className="mb-4">For questions about these Terms:</p>
              
              <div className="bg-accent/10 rounded-lg p-6 mt-4 text-center">
                <h3 className="text-xl font-medium text-accent mb-2">Get in Touch</h3>
                <p className="mb-4">We're here to help with any questions about our terms and conditions</p>
                <p className="text-lg font-bold text-accent">support@rigfreaks.com</p>
              </div>
            </div>
            
            <div className="mt-10">
              <Link href="/" className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md transition-colors">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
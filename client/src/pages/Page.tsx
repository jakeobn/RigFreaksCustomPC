import { useEffect, useState, useRef } from "react";
import { useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { Container } from "@/components/ui/container";

interface PageContent {
  title: string;
  content: string;
  handle: string;
  createdAt: string;
  updatedAt: string;
  sections?: { 
    id: string; 
    title: string;
  }[];
}

export default function Page() {
  const [, params] = useRoute("/pages/:handle");
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    if (!params || !params.handle) {
      setError("Page not found");
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll create mock page content based on handle
        // In a real Shopify theme, this would be fetched from the Shopify API
        const mockPages: Record<string, PageContent> = {
          "privacy-policy": {
            title: "Privacy Statement",
            handle: "privacy-policy",
            sections: [
              { id: "information-we-collect", title: "Information We Collect" },
              { id: "how-we-use-information", title: "How We Use Information" },
              { id: "sharing-information", title: "Sharing Your Information" },
              { id: "cookies-analytics", title: "Cookies & Analytics" },
              { id: "data-security", title: "Data Security" },
              { id: "your-rights", title: "Your Rights" },
              { id: "policy-updates", title: "Policy Updates" },
              { id: "contact-us", title: "Contact Us" }
            ],
            content: `
              <div class="effective-date mb-6 text-sm text-muted-foreground">
                Effective Date: May 7, 2023
              </div>
              
              <p>At RigFreaks, your privacy is important to us. This Privacy Statement explains how we collect, use, and protect your personal information when you visit our website or purchase our high-performance custom PCs.</p>
              
              <div id="information-we-collect" class="policy-section mt-10 mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">1. Information We Collect</h2>
                <p>We collect various types of information to provide and improve our services:</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Personal Information</h3>
                <p>This includes your name, email address, shipping/billing address, and phone number provided during account creation or checkout.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Payment Information</h3>
                <p>We collect payment details through our secure payment processors. We do not store complete payment information on our servers.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Device and Usage Information</h3>
                <p>We automatically collect certain information when you visit our website, including:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">IP address and device identifiers</li>
                  <li class="mb-2">Browser type and version</li>
                  <li class="mb-2">Pages visited and interaction data</li>
                  <li class="mb-2">Referral source and exit pages</li>
                </ul>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Custom PC Configurations</h3>
                <p>When using our PC builder tool, we collect information about your component choices and system preferences to process your order and improve our component offerings.</p>
              </div>
              
              <div id="how-we-use-information" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">2. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Processing and fulfilling your orders</li>
                  <li class="mb-2">Setting up and managing your account</li>
                  <li class="mb-2">Providing customer support and warranty services</li>
                  <li class="mb-2">Sending order confirmations and shipping updates</li>
                  <li class="mb-2">Communicating about products, services, and promotions (with your consent)</li>
                  <li class="mb-2">Analyzing website performance and improving user experience</li>
                  <li class="mb-2">Detecting and preventing fraud or unauthorized access</li>
                  <li class="mb-2">Complying with legal obligations</li>
                </ul>
              </div>
              
              <div id="sharing-information" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">3. Sharing Your Information</h2>
                <p>We value your privacy and are selective about who we share your information with:</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Service Providers</h3>
                <p>We share information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, including:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Payment processors for secure transaction handling</li>
                  <li class="mb-2">Shipping and logistics providers to deliver your orders</li>
                  <li class="mb-2">Customer service and support platforms</li>
                  <li class="mb-2">Marketing and analytics partners (with appropriate safeguards)</li>
                </ul>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Legal Requirements</h3>
                <p>We may disclose information when legally required to do so, such as:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">To comply with applicable laws or regulations</li>
                  <li class="mb-2">To respond to lawful requests from public authorities</li>
                  <li class="mb-2">To protect our rights, privacy, safety, or property</li>
                </ul>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Business Transfers</h3>
                <p>If RigFreaks is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</p>
                
                <p class="font-bold mt-6">We do not sell your personal information to third parties for marketing purposes.</p>
              </div>
              
              <div id="cookies-analytics" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">4. Cookies and Analytics</h2>
                <p>Our website uses cookies and similar technologies to enhance your browsing experience and collect information about how you use our site.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Types of Cookies We Use</h3>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2"><strong>Essential cookies:</strong> Required for basic website functionality</li>
                  <li class="mb-2"><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                  <li class="mb-2"><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
                  <li class="mb-2"><strong>Marketing cookies:</strong> Track visitors across websites to display relevant advertisements</li>
                </ul>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Analytics Tools</h3>
                <p>We use Google Analytics and similar services to analyze website traffic and improve our services. These tools collect information sent by your browser, including pages visited and time spent on the site.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Cookie Management</h3>
                <p>You can control cookies through your browser settings. Most browsers allow you to block or delete cookies. However, blocking certain cookies may impact your experience on our website.</p>
              </div>
              
              <div id="data-security" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">5. Data Security</h2>
                <p>We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, loss, or alteration.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Our Security Measures</h3>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Secure Socket Layer (SSL) encryption for all data transmissions</li>
                  <li class="mb-2">Regular security assessments and vulnerability testing</li>
                  <li class="mb-2">Access controls and authentication requirements for internal systems</li>
                  <li class="mb-2">Employee training on data privacy and security practices</li>
                </ul>
                
                <p>While we strive to protect your personal information, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security.</p>
              </div>
              
              <div id="your-rights" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">6. Your Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information:</p>
                
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2"><strong>Access:</strong> Request information about what personal data we hold about you</li>
                  <li class="mb-2"><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li class="mb-2"><strong>Deletion:</strong> Request deletion of your personal information in certain circumstances</li>
                  <li class="mb-2"><strong>Restriction:</strong> Request restriction of processing of your personal information</li>
                  <li class="mb-2"><strong>Data portability:</strong> Request transfer of your information to another service provider</li>
                  <li class="mb-2"><strong>Objection:</strong> Object to processing of your personal information for certain purposes</li>
                </ul>
                
                <p>To exercise these rights, please contact us at <a href="mailto:privacy@rigfreaks.com" class="text-primary hover:underline">privacy@rigfreaks.com</a>. We will respond to your request within the timeframe required by applicable law.</p>
              </div>
              
              <div id="policy-updates" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">7. Updates to This Policy</h2>
                <p>We may update this Privacy Statement from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
                
                <p>When we make material changes to this policy, we will notify you by:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Posting a notice on our website</li>
                  <li class="mb-2">Updating the "Effective Date" at the top of this statement</li>
                  <li class="mb-2">Sending an email notification (for significant changes)</li>
                </ul>
                
                <p>We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
              </div>
              
              <div id="contact-us" class="policy-section mb-10">
                <h2 class="text-2xl font-semibold text-primary mb-5">8. Contact Us</h2>
                <p>If you have any questions, concerns, or requests regarding this Privacy Statement or our data practices, please contact us at:</p>
                
                <p class="mt-5">
                  <strong>Email:</strong> <a href="mailto:privacy@rigfreaks.com" class="text-primary hover:underline">privacy@rigfreaks.com</a><br>
                  <strong>Phone:</strong> +1 (555) 123-4567<br>
                  <strong>Address:</strong> RigFreaks LLC, 123 Tech Street, Suite 456, San Francisco, CA 94105
                </p>
                
                <p class="mt-5">We are committed to addressing your concerns and resolving any issues in a timely and appropriate manner.</p>
              </div>
            `,
            createdAt: "2023-05-07T00:00:00Z",
            updatedAt: "2023-05-07T00:00:00Z",
          },
          "terms-of-service": {
            title: "Terms of Service",
            handle: "terms-of-service",
            sections: [
              { id: "acceptance", title: "Acceptance of Terms" },
              { id: "products-services", title: "Products & Services" },
              { id: "ordering-payment", title: "Ordering & Payment" },
              { id: "shipping-delivery", title: "Shipping & Delivery" },
              { id: "returns-warranty", title: "Returns & Warranty" },
              { id: "user-accounts", title: "User Accounts" },
              { id: "intellectual-property", title: "Intellectual Property" },
              { id: "limitation-liability", title: "Limitation of Liability" },
              { id: "changes-terms", title: "Changes to Terms" },
              { id: "contact-us", title: "Contact Us" }
            ],
            content: `
              <div class="effective-date mb-6 text-sm text-muted-foreground">
                Effective Date: May 7, 2023
              </div>
              
              <p>Welcome to RigFreaks. These Terms of Service govern your use of our website and services. By accessing our website or purchasing our custom PC products, you agree to abide by these terms. Please read them carefully before using our services.</p>
              
              <div id="acceptance" class="policy-section mt-10 mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">1. Acceptance of Terms</h2>
                <p>By accessing our website, creating an account, or making a purchase, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, along with our Privacy Policy and any other policies referenced herein.</p>
                
                <p>If you do not agree with any part of these terms, you must not use our website or services. If you are under 18 years of age, you may use our services only with the involvement and consent of a parent or guardian.</p>
              </div>
              
              <div id="products-services" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">2. Products and Services</h2>
                <p>RigFreaks specializes in custom-built gaming PCs and related components designed for gamers, creators, and tech enthusiasts.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Product Information</h3>
                <p>We make every effort to accurately describe our products and their specifications. However, we do not warrant that product descriptions, images, specifications, pricing, or other content on our website are complete, accurate, reliable, current, or error-free.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Product Availability</h3>
                <p>All products are subject to availability. We reserve the right to discontinue any product at any time and to limit quantities of any products that we offer.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Custom PC Builder</h3>
                <p>Our Custom PC Builder tool allows you to configure custom systems based on your requirements. While we provide compatibility guidance, it is your responsibility to ensure that your selected components meet your specific needs.</p>
              </div>
              
              <div id="ordering-payment" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">3. Ordering and Payment</h2>
                <p>By placing an order, you are making an offer to purchase the products you have selected. All orders are subject to acceptance and availability.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Order Acceptance</h3>
                <p>We reserve the right to refuse or cancel any order for any reason, including but not limited to:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Product unavailability</li>
                  <li class="mb-2">Errors in pricing or product information</li>
                  <li class="mb-2">Suspected fraudulent activity</li>
                  <li class="mb-2">Verification or delivery issues</li>
                </ul>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Pricing</h3>
                <p>All prices shown on our website are in GBP (British Pounds) and do not include taxes, shipping, or handling unless specifically stated. Prices are subject to change without notice. If a pricing error is discovered after you have placed your order, we will notify you and provide the option to proceed with the corrected price or cancel your order.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Payment Methods</h3>
                <p>We accept various payment methods as indicated during checkout. By providing payment information, you represent and warrant that you have the legal right to use the payment method and that the information you provide is accurate.</p>
              </div>
              
              <div id="shipping-delivery" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">4. Shipping and Delivery</h2>
                <p>We ship to addresses within the continental United States and other locations as specified on our website.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Delivery Times</h3>
                <p>Delivery timeframes are estimates only and begin from the date of shipping, not the order date. Custom-built PCs typically require 7-14 business days for assembly, testing, and quality control before shipping.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Shipping Costs</h3>
                <p>Shipping costs are calculated based on destination, weight, and dimensions of the package. These costs will be displayed during checkout before you complete your order.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Risk of Loss</h3>
                <p>Risk of loss and title for items purchased pass to you upon delivery of the items to the carrier. It is your responsibility to file any claims with carriers for damaged and/or lost shipments.</p>
              </div>
              
              <div id="returns-warranty" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">5. Returns and Warranty</h2>
                <p>We stand behind the quality of our products and offer warranty coverage for defects in materials and workmanship.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Standard Warranty</h3>
                <p>All custom-built PCs come with our standard 2-year warranty covering parts and labor. Individual components are covered by their respective manufacturer warranties.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Return Policy</h3>
                <p>You may return most new, unopened items within 30 days of delivery for a full refund. Custom-built PCs that are not defective may be subject to a restocking fee of up to 15%.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Warranty Exclusions</h3>
                <p>Our warranty does not cover:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Damage resulting from improper use, accidents, or modifications</li>
                  <li class="mb-2">Normal wear and tear</li>
                  <li class="mb-2">Issues caused by software, viruses, or improper maintenance</li>
                  <li class="mb-2">Damage from power surges, lightning, or environmental conditions</li>
                </ul>
                
                <p>For complete details on our return and warranty policies, please visit our <a href="#" class="text-primary hover:underline">Warranty & Returns</a> page.</p>
              </div>
              
              <div id="user-accounts" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">6. User Accounts</h2>
                <p>You may need to create an account to access certain features of our website or to make a purchase.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Account Security</h3>
                <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Account Information</h3>
                <p>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
              </div>
              
              <div id="intellectual-property" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">7. Intellectual Property</h2>
                <p>All content on our website, including text, graphics, logos, images, audio clips, digital downloads, data compilations, and software, is the property of RigFreaks or its content suppliers and is protected by international copyright laws.</p>
                
                <h3 class="text-xl font-medium text-accent mt-6 mb-3">Restricted Use</h3>
                <p>You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our website, except as follows:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Your computer may temporarily store copies of such materials in RAM incidental to your accessing and viewing those materials</li>
                  <li class="mb-2">You may store files that are automatically cached by your web browser for display enhancement purposes</li>
                  <li class="mb-2">You may print or download one copy of a reasonable number of pages of the website for your own personal, non-commercial use and not for further reproduction, publication, or distribution</li>
                </ul>
              </div>
              
              <div id="limitation-liability" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">8. Limitation of Liability</h2>
                <p>To the fullest extent permitted by law, RigFreaks shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses resulting from:</p>
                <ul class="list-disc pl-6 mt-3 mb-5">
                  <li class="mb-2">Your use or inability to use our services</li>
                  <li class="mb-2">Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                  <li class="mb-2">Any interruption or cessation of transmission to or from our website</li>
                  <li class="mb-2">Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our website by any third party</li>
                </ul>
                
                <p>In no event shall our total liability to you for all damages, losses, or causes of action exceed the amount you have paid to RigFreaks in the last six months, or, if greater, one hundred pounds (£100).</p>
              </div>
              
              <div id="changes-terms" class="policy-section mb-10 pb-10 border-b border-border">
                <h2 class="text-2xl font-semibold text-primary mb-5">9. Changes to Terms</h2>
                <p>We reserve the right to update or change these Terms of Service at any time without prior notice. Any changes will be effective immediately upon posting the updated Terms on this page.</p>
                
                <p>Your continued use of our website after we post any modifications to the Terms of Service constitutes your acknowledgment of the modifications and your consent to abide and be bound by the modified Terms.</p>
              </div>
              
              <div id="contact-us" class="policy-section mb-10">
                <h2 class="text-2xl font-semibold text-primary mb-5">10. Contact Us</h2>
                <p>If you have any questions about these Terms of Service, please contact us at:</p>
                
                <p class="mt-5">
                  <strong>Email:</strong> <a href="mailto:legal@rigfreaks.com" class="text-primary hover:underline">legal@rigfreaks.com</a><br>
                  <strong>Phone:</strong> +1 (555) 123-4567<br>
                  <strong>Address:</strong> RigFreaks LLC, 123 Tech Street, Suite 456, San Francisco, CA 94105
                </p>
              </div>
            `,
            createdAt: "2023-05-07T00:00:00Z",
            updatedAt: "2023-05-07T00:00:00Z",
          },
          "refund-policy": {
            title: "Refund Policy",
            handle: "refund-policy",
            content: "<div class=\"rte\"><h1>Refund Policy</h1><p>Content for Refund Policy page</p></div>",
            createdAt: "2023-05-07T00:00:00Z",
            updatedAt: "2023-05-07T00:00:00Z",
          },
          "shipping-policy": {
            title: "Shipping Policy",
            handle: "shipping-policy",
            content: "<div class=\"rte\"><h1>Shipping Policy</h1><p>Content for Shipping Policy page</p></div>",
            createdAt: "2023-05-07T00:00:00Z",
            updatedAt: "2023-05-07T00:00:00Z",
          },
        };

        const page = mockPages[params.handle];
        if (page) {
          setPageContent(page);
          setError(null);
        } else {
          setError("Page not found");
        }
      } catch (err) {
        setError("Failed to load page content");
        console.error("Error loading page:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [params]);

  // Smooth scrolling and section highlighting
  useEffect(() => {
    if (!pageContent?.sections) return;
    
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
    
    // Observe all section elements
    if (pageContent.sections) {
      pageContent.sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
          observer.observe(element);
          sectionRefs.current[section.id] = element;
        }
      });
      
      // Add click event listeners to sidebar links
      const handleClick = (e: Event, sectionId: string) => {
        e.preventDefault();
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setActiveSection(sectionId);
        }
      };
      
      const sidebarLinks = document.querySelectorAll('.policy-sidebar a');
      sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const sectionId = href.substring(1);
          link.addEventListener('click', (e) => handleClick(e, sectionId));
        }
      });
      
      return () => {
        pageContent.sections.forEach(section => {
          const element = document.getElementById(section.id);
          if (element) {
            observer.unobserve(element);
          }
        });
        
        // Cleanup event listeners
        const sidebarLinks = document.querySelectorAll('.policy-sidebar a');
        sidebarLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href && href.startsWith('#')) {
            const sectionId = href.substring(1);
            // We can't reference the exact instance of handleClick here, but we clean up by selector
          }
        });
      };
    }
  }, [pageContent]);

  if (loading) {
    return (
      <Container className="py-16">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  if (error || !pageContent) {
    return (
      <Container className="py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Page not found</h1>
          <p className="text-muted-foreground">The page you are looking for does not exist or has been moved.</p>
        </div>
      </Container>
    );
  }

  // Standard page rendering for pages without sections
  if (!pageContent.sections || pageContent.sections.length === 0) {
    return (
      <>
        <Helmet>
          <title>{pageContent.title} | RigFreaks</title>
          <meta name="description" content={`${pageContent.title} for RigFreaks custom PC store.`} />
        </Helmet>
        
        <Container className="py-12">
          <div className="max-w-[800px] mx-auto">
            <div className="border-b border-border pb-6 mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">{pageContent.title}</h1>
              <div className="text-sm text-muted-foreground mt-2">
                Last updated: {new Date(pageContent.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: pageContent.content }}
            />
          </div>
        </Container>
      </>
    );
  }

  // Enhanced rendering for pages with sections (policy pages)
  return (
    <>
      <Helmet>
        <title>{pageContent.title} | RigFreaks</title>
        <meta name="description" content={`${pageContent.title} for RigFreaks custom PC store.`} />
      </Helmet>
      
      <div className="bg-dark-card py-10 border-b border-border">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold text-center">{pageContent.title}</h1>
        </Container>
      </div>
      
      <Container className="py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-[250px] shrink-0">
            <div className="policy-sidebar sticky top-20">
              <div className="border border-border rounded-md overflow-hidden">
                <ul className="divide-y divide-border">
                  {pageContent.sections.map((section) => (
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
            <div 
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: pageContent.content }}
            />
            
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
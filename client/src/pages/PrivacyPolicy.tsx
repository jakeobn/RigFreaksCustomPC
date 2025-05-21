import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
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
    { id: "information-we-collect", title: "Information We Collect" },
    { id: "how-we-use-information", title: "How We Use Information" },
    { id: "data-sharing", title: "Data Sharing" },
    { id: "data-protection", title: "Data Protection" },
    { id: "your-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies" },
    { id: "third-party-links", title: "Third-Party Links" },
    { id: "childrens-privacy", title: "Children's Privacy" },
    { id: "policy-updates", title: "Policy Updates" },
    { id: "contact-us", title: "Contact Us" }
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy | RigFreaks</title>
        <meta name="description" content="Learn about how RigFreaks collects and protects your personal information." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <Shield className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Privacy Policy</h1>
            <p className="text-muted-foreground text-center max-w-2xl mt-4">
              RigFreaks is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information when you visit our website and use our services.
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
              At RigFreaks, we're dedicated to building the best custom PCs and respecting your privacy. This Privacy Policy explains how we handle your information when you visit our website or use our PC Builder tool.
            </p>
            
            <div id="information-we-collect" className="policy-section mt-10 mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">1. Information We Collect</h2>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">When You Visit Our Site</h3>
              <p>We automatically collect some information to improve your experience:</p>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">What pages you visit and how long you stay</li>
                <li className="mb-2">What device and browser you're using</li>
                <li className="mb-2">General location data (like country or city)</li>
                <li className="mb-2">How you found our website</li>
              </ul>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">When You Create an Account</h3>
              <p>We ask for basic information like:</p>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Your name and email address</li>
                <li className="mb-2">A secure password</li>
                <li className="mb-2">Optional: Your gaming preferences</li>
              </ul>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">When You Place an Order</h3>
              <p>We collect additional information to fulfill your order:</p>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Shipping and billing addresses</li>
                <li className="mb-2">Phone number for delivery coordination</li>
                <li className="mb-2">Payment information (processed securely through our payment providers)</li>
                <li className="mb-2">Your custom PC configuration details</li>
              </ul>
            </div>
            
            <div id="how-we-use-information" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">2. How We Use Your Information</h2>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">To Provide Our Services</h3>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Process and fulfill your custom PC orders</li>
                <li className="mb-2">Save your PC builds and preferences</li>
                <li className="mb-2">Provide customer support and warranty service</li>
                <li className="mb-2">Verify your identity and process payments</li>
              </ul>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">To Improve Our Business</h3>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Understand how customers use our site and PC Builder tool</li>
                <li className="mb-2">Identify popular components and configurations</li>
                <li className="mb-2">Improve our website design and user experience</li>
                <li className="mb-2">Develop new products and services</li>
              </ul>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">To Communicate With You</h3>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Send order confirmations and shipping updates</li>
                <li className="mb-2">Provide technical support and troubleshooting</li>
                <li className="mb-2">Share important warranty information</li>
                <li className="mb-2">With your permission, send product recommendations and special offers</li>
              </ul>
            </div>
            
            <div id="data-sharing" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">3. Data Sharing</h2>
              <p className="mb-4">We do not sell or rent your personal information to third parties.</p>
              
              <p className="mb-4">We may share your data with trusted third parties for the following purposes:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Payment Processing</h3>
                  </div>
                  <div className="p-4">
                    <p>We share payment details with service providers like Stripe or PayPal to process transactions securely.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Shipping Services</h3>
                  </div>
                  <div className="p-4">
                    <p>We share delivery information with shipping companies to fulfill your orders.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Legal Requirements</h3>
                  </div>
                  <div className="p-4">
                    <p>We may disclose information to law enforcement or regulatory bodies if required by law.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <p className="font-bold text-primary">We Never Sell Your Data</p>
                <p className="mt-2">RigFreaks does not sell, rent, or trade your personal information to third parties for marketing purposes.</p>
              </div>
            </div>
            
            <div id="data-protection" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">4. Data Protection</h2>
              <p className="mb-4">We implement industry-standard security measures to protect your personal data:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Encryption</h3>
                  </div>
                  <div className="p-4">
                    <p>Your payment and account details are encrypted during transmission via SSL technology.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Access Control</h3>
                  </div>
                  <div className="p-4">
                    <p>We restrict access to personal information to only employees and partners who need it to perform their duties.</p>
                  </div>
                </div>
              </div>
              
              <p className="mt-6 text-sm text-muted-foreground italic">
                While we take reasonable precautions, no data transmission over the internet can be guaranteed 100% secure.
              </p>
            </div>
            
            <div id="your-rights" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">5. Your Rights</h2>
              <p className="mb-4">Under GDPR, you have the following rights regarding your personal data:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Access</h4>
                  <p className="text-sm mt-2">Request a copy of the personal information we hold about you</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Rectification</h4>
                  <p className="text-sm mt-2">Request correction of any inaccuracies in your data</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Erasure</h4>
                  <p className="text-sm mt-2">Request deletion of your personal information, with certain exceptions</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Restriction</h4>
                  <p className="text-sm mt-2">Request limited processing of your data under specific conditions</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Data Portability</h4>
                  <p className="text-sm mt-2">Request your data in a structured, commonly used format</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Objection</h4>
                  <p className="text-sm mt-2">Object to processing of your data for certain purposes</p>
                </div>
              </div>
              
              <p className="mt-6">
                To exercise these rights, contact us using the details at the end of this policy.
              </p>
            </div>
            
            <div id="cookies" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">6. Cookies</h2>
              
              <p className="mb-4">We use cookies to improve your browsing experience and provide personalized content. These are small text files stored on your device.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Essential Cookies</h4>
                  <p className="text-sm mt-2">Required for the website to function properly. They enable basic features like page navigation and access to secure areas.</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Preference Cookies</h4>
                  <p className="text-sm mt-2">Remember your settings and choices to provide a more personalized experience, like your PC Builder configurations.</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Analytics Cookies</h4>
                  <p className="text-sm mt-2">Help us understand how visitors interact with our website so we can improve it.</p>
                </div>
                <div className="bg-card p-4 rounded-lg border border-border/50">
                  <h4 className="font-bold text-accent">Marketing Cookies</h4>
                  <p className="text-sm mt-2">Used to track visitors across websites to display relevant advertisements about our products.</p>
                </div>
              </div>
              
              <h3 className="text-xl font-medium text-accent mt-6 mb-3">Managing Cookies</h3>
              <p>You can control cookies through your browser settings. Most browsers allow you to:</p>
              <ul className="list-disc pl-6 mt-3 mb-5">
                <li className="mb-2">Block or delete all cookies</li>
                <li className="mb-2">Block third-party cookies</li>
                <li className="mb-2">Clear cookies when you close your browser</li>
              </ul>
              <p className="text-sm italic">Note: Blocking some types of cookies may impact your experience on our website.</p>
            </div>
            
            <div id="third-party-links" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">7. Third-Party Links</h2>
              
              <p className="mb-4">Our website may contain links to third-party websites or services not operated by us. We are not responsible for the privacy practices of these sites. We recommend reviewing their privacy policies before sharing personal information.</p>
              
              <div className="bg-card rounded-lg border border-border/50 p-4 mt-4">
                <p className="text-sm italic">
                  Examples of third-party services we may link to include hardware manufacturer websites, YouTube videos for PC build guides, or social media platforms where our content is shared.
                </p>
              </div>
            </div>
            
            <div id="childrens-privacy" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">8. Children's Privacy</h2>
              
              <p className="mb-4">Our services are not intended for children under 18. We do not knowingly collect personal information from children. If we discover we have collected data from a child under 18, we will delete it promptly.</p>
              
              <div className="bg-amber-950/30 border border-amber-500/30 text-amber-200 p-4 rounded-lg mt-4">
                <p className="font-bold">Notice to Parents and Guardians</p>
                <p className="mt-2 text-sm">
                  If you believe your child has provided us with personal information without your consent, please contact us immediately using the details below, and we will take steps to remove such information from our systems.
                </p>
              </div>
            </div>
            
            <div id="policy-updates" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">9. Policy Updates</h2>
              
              <p className="mb-4">We may update this Privacy Policy to reflect changes in our practices or legal requirements. The revised version will be posted on this page and will be effective immediately upon posting.</p>
              
              <div className="bg-card rounded-lg border border-border/50 p-4 mt-4">
                <h3 className="font-bold text-accent mb-2">How We Notify You of Changes</h3>
                <p className="text-sm">
                  For significant changes to this Privacy Policy, we will make reasonable efforts to notify you by:
                </p>
                <ul className="list-disc pl-6 mt-2 text-sm">
                  <li className="mb-1">Posting a notice on our website</li>
                  <li className="mb-1">Sending an email to registered users</li>
                  <li className="mb-1">Updating the "Effective Date" at the top of this page</li>
                </ul>
              </div>
            </div>
            
            <div id="contact-us" className="policy-section mb-10">
              <h2 className="text-2xl font-semibold text-primary mb-5">10. Contact Us</h2>
              
              <p className="mb-4">For questions about this Privacy Policy or to exercise your GDPR rights:</p>
              
              <div className="bg-accent/10 rounded-lg p-6 mt-4 text-center">
                <h3 className="text-xl font-medium text-accent mb-2">Get in Touch</h3>
                <p className="mb-4">We're here to help with any privacy-related questions or concerns</p>
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
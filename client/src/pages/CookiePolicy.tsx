import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { useState, useEffect } from "react";
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
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
    { id: "what-are-cookies", title: "What Are Cookies?" },
    { id: "types-of-cookies", title: "Types of Cookies" },
    { id: "how-we-use-cookies", title: "How We Use Cookies" },
    { id: "third-party-cookies", title: "Third-Party Cookies" },
    { id: "your-cookie-choices", title: "Your Cookie Choices" },
    { id: "policy-updates", title: "Policy Updates" },
    { id: "contact", title: "Contact" }
  ];

  return (
    <>
      <Helmet>
        <title>Cookie Policy | RigFreaks</title>
        <meta name="description" content="Learn about how RigFreaks uses cookies to enhance your browsing experience." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <Cookie className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Cookie Policy</h1>
            <p className="text-muted-foreground text-center max-w-2xl mt-4">
              RigFreaks uses cookies to enhance your experience. By using our website, you agree to our use of cookies as described in this policy.
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
            
            <div id="what-are-cookies" className="policy-section mt-10 mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">1. What Are Cookies?</h2>
              
              <div className="bg-card rounded-lg border border-border/50 p-6">
                <p className="text-lg mb-4">Cookies are small text files placed on your device that help websites remember your preferences and improve your browsing experience.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-bold text-primary mb-2">How They Work</h3>
                    <p className="text-sm">
                      When you visit our website, small text files are stored on your device. These files contain information that helps our site recognize you on future visits and remember your preferences.
                    </p>
                  </div>
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <h3 className="font-bold text-primary mb-2">Why We Use Them</h3>
                    <p className="text-sm">
                      Cookies make your browsing experience smoother by remembering your preferences, helping with navigation, and enabling personalized features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="types-of-cookies" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">2. Types of Cookies</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Essential Cookies</h3>
                  </div>
                  <div className="p-4">
                    <p>Required for basic website functionality like navigation and authentication. These cannot be disabled as they are necessary for the website to work properly.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Performance Cookies</h3>
                  </div>
                  <div className="p-4">
                    <p>Collect anonymous data about site usage to help us improve our website. These cookies help us understand how visitors interact with our pages.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Functional Cookies</h3>
                  </div>
                  <div className="p-4">
                    <p>Remember your preferences to provide personalized features. These enhance your experience by remembering your choices like language or region.</p>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border border-border/50 overflow-hidden">
                  <div className="bg-accent/10 px-4 py-3 border-b border-border/50">
                    <h3 className="font-semibold text-accent">Targeting Cookies</h3>
                  </div>
                  <div className="p-4">
                    <p>Used to deliver relevant advertisements based on your browsing habits. These help us show you products and offers that match your interests.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary/10 p-4 rounded-lg mt-6">
                <p className="text-sm italic">
                  Our website uses all these types of cookies to provide you with the best possible experience. You can manage your cookie preferences through your browser settings.
                </p>
              </div>
            </div>
            
            <div id="how-we-use-cookies" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">3. How We Use Cookies</h2>
              
              <div className="space-y-6">
                <div className="flex items-start bg-card p-5 rounded-lg border border-border/50">
                  <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Website Functionality</h3>
                    <p className="text-sm">Enable navigation, login, and shopping cart features. Essential cookies help us remember items in your cart, keep you logged in during your session, and ensure the website runs smoothly.</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-card p-5 rounded-lg border border-border/50">
                  <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Performance Tracking</h3>
                    <p className="text-sm">Analyze site usage to improve content and services. We use performance cookies to understand which pages are popular, how visitors navigate our site, and where users might encounter problems.</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-card p-5 rounded-lg border border-border/50">
                  <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Personalization</h3>
                    <p className="text-sm">Tailor content based on your preferences. These cookies help us remember your PC builder configurations, product preferences, and customize your browsing experience based on your interests.</p>
                  </div>
                </div>
                
                <div className="flex items-start bg-card p-5 rounded-lg border border-border/50">
                  <div className="bg-primary/20 p-2 rounded-full mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Targeted Advertising</h3>
                    <p className="text-sm">Serve relevant ads and gather browsing insights. With your consent, these cookies help us show you products and promotions tailored to your interests, both on our site and others.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div id="third-party-cookies" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">4. Third-Party Cookies</h2>
              
              <p className="mb-6">
                We allow third-party services (analytics, social media, advertising) to place cookies on our website. These are governed by their respective privacy policies.
              </p>
              
              <div className="bg-card rounded-lg border border-border/50 p-6">
                <h3 className="font-bold text-lg mb-4">Third-Party Services We Use</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-bold mb-2">Analytics</h4>
                    <p className="text-sm">Google Analytics helps us understand how visitors use our site.</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-bold mb-2">Social Media</h4>
                    <p className="text-sm">Facebook, Twitter, and Instagram plugins may place cookies for sharing features.</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-bold mb-2">Advertising</h4>
                    <p className="text-sm">Google Ads, Facebook Ads, and other platforms may use cookies for ad targeting.</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <h4 className="font-bold mb-2">Video Content</h4>
                    <p className="text-sm">YouTube or Vimeo embeds may set cookies when you view videos on our site.</p>
                  </div>
                </div>
                
                <div className="mt-6 bg-warning/10 p-4 rounded-lg text-warning-foreground">
                  <p className="text-sm">
                    <span className="font-bold">Note:</span> Third-party cookies are controlled by their respective providers. We recommend reviewing their privacy policies for more information on how they process your data.
                  </p>
                </div>
              </div>
            </div>
            
            <div id="your-cookie-choices" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">5. Your Cookie Choices</h2>
              
              <p className="mb-6">
                You can manage cookies through your browser settings. Most browsers allow you to block or delete cookies.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-card/80 p-4 rounded-lg border border-border/50 transition-colors text-center">
                  <div className="h-12 w-12 mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M12 0C8.21 0 4.831 1.757 2.632 4.501l3.953 6.848A5.454 5.454 0 0 1 12 6.545c3.004 0 5.454 2.45 5.454 5.455a5.464 5.464 0 0 1-1.626 3.883L24 12c0-6.627-5.373-12-12-12zm1.818 17.21c1.355-.915 2.181-2.621 2.181-4.21 0-2.817-2.037-5.028-4.714-5.428l3.715 6.433c.164.282.252.591.252.995 0 .735-.345 1.5-.909 2.132l-1.082 1.072-.363-.998zM5.717 8.513c-.658.908-1.039 2.017-1.03 3.215 0 2.818 2.036 5.028 4.714 5.428l-3.716-6.433a2.014 2.014 0 0 1-.25-.995c0-.734.344-1.5.909-2.132l1.08-1.072.404.998zM12 13.455a1.91 1.91 0 1 1 0-3.819 1.91 1.91 0 0 1 0 3.819z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold">Chrome</h3>
                </a>
                
                <a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-card/80 p-4 rounded-lg border border-border/50 transition-colors text-center">
                  <div className="h-12 w-12 mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M23.033 11.945c-.1-.6-.35-1.204-.699-1.695-.549-.772-1.201-1.248-1.849-1.66-.75-.475-1.001-.65-1.001-1.95v-.103c0-1.305-.627-2.172-1.15-2.752-.551-.61-1.1-1.1-1.75-1.452-.649-.351-1.301-.55-1.951-.649a3.15 3.15 0 0 0-.896-.1c-.499.05-.999.2-1.548.45-.547.25-1-.05-1.15-.175-.15-.125-.35-.35-.5-.6-.149-.249-.35-.45-.748-.7-.4-.25-.997-.35-1.534-.45A7.553 7.553 0 0 0 7.3.5c-.754 0-1.35.096-2.049.297-.7.2-1.352.5-1.952.899-.6.4-1.15.9-1.602 1.45-.599.752-1 1.65-1.153 2.72 0 .052-.5.105-.5.151-.05 1.48.296 2.752.797 3.853.49 1.098 1.15 2.048 1.9 2.847.798.8 1.751 1.5 2.851 1.999s2.103.6 3.051.65c.499.051 1.05.11 1.55.052 1.201-.149 2.299-.599 3.248-1.302.499-.351.949-.75 1.352-1.2.35-.4.65-.82.899-1.298.1.3.25.5.45.65.3.25.648.399 1.102.399.499 0 1.098-.2 1.748-.75.6-.5 1.201-1.252 1.648-2.354.152-.352.251-.752.251-1.154 0-.1-.05-.222-.099-.323zm-3.65-9.246c-.45-.303-.6-.15-.55-.15.7 0 1.2.2 1.6.551.449.4.749.899.899 1.552.25-.153-.007-.356-.1-.404-.4-.25-.801-.4-1.201-.652-.399-.25-.799-.598-1.149-.897zm-5.549 2.148c.1.3.05.6.05.9.498-.001 1.097.248 1.547.7.498.5.698 1.15.698 1.9 0 .148 0 .299-.049.45 0 .048-.001.097-.05.148-.05.1-.1.2-.15.351a3.233 3.233 0 0 1-.252.6 3.023 3.023 0 0 1-.3.5 2.683 2.683 0 0 1-.35.4c-.149.148-.35.298-.499.398-.2.15-.45.25-.65.351-.249.1-.45.148-.699.198-.15.05-.299.05-.45.05h-.048c-.15 0-.301 0-.451-.05-.248-.05-.45-.1-.65-.198-.199-.101-.398-.201-.648-.351-.15-.1-.35-.25-.499-.399a2.683 2.683 0 0 1-.35-.4c-.1-.149-.199-.3-.249-.499a3.233 3.233 0 0 1-.25-.6c-.05-.151-.1-.252-.15-.351-.001-.051-.001-.1-.05-.149a1.704 1.704 0 0 1-.05-.45c0-.401.1-.8.2-1.15.098-.351.248-.7.447-.949.2-.3.45-.551.75-.8.298-.25.648-.4 1.047-.5.201-.05.4-.051.6-.051h.099c.2 0 .399.001.598.051.402.1.75.25 1.05.5.298.249.548.5.747.8.2.249.35.598.448.949.099.35.2.749.2 1.15v.302h-.05zm-9.897 5.847c-.101 0-.15.05-.15.15 0 .1.05.148.15.148h.3c.098 0 .148-.049.148-.149 0-.1-.05-.149-.149-.149h-.3zm.9-.102c-.102 0-.15.05-.15.15 0 .1.05.151.15.151h.3c.1 0 .148-.051.148-.151 0-.1-.05-.15-.149-.15h-.3zm.897.051c-.098 0-.148.05-.148.15 0 .1.05.149.148.149h.302c.098 0 .149-.05.149-.15 0-.099-.05-.149-.15-.149h-.301zm-.6-1.05c.7 0 1.25.2 1.702.65.449.45.649 1.1.649 1.9 0 .149-.052.35-.052.5-.05.201-.1.351-.15.602-.1.35-.249.7-.449 1.1-.25.4-.55.75-.949 1.152-.402.45-.853.75-1.402 1.05-.5.3-1.149.45-1.8.5h-.4c-.6-.05-1.148-.25-1.598-.5-.498-.301-.898-.601-1.25-1.051-.349-.399-.6-.75-.85-1.151-.19-.4-.34-.75-.44-1.1-.05-.251-.1-.401-.15-.602 0-.15-.049-.351-.049-.5 0-.4.049-.797.199-1.147.099-.35.249-.65.448-.9.199-.25.398-.45.648-.65.25-.197.55-.397.85-.5.197-.1.448-.15.648-.197a1.92 1.92 0 0 1 .35-.051h.451c.1 0 .248.05.35.051.199.47.449.097.648.197.299.103.6.303.85.5.25.2.45.4.648.65.2.25.349.55.45.9.148.35.198.747.198 1.147 0 .4-.049.797-.15 1.15-.1.35-.25.652-.448.9-.2.25-.4.452-.649.652-.25.198-.55.398-.85.5a3.19 3.19 0 0 1-.649.198 1.912 1.912 0 0 1-.35.05h-.449c-.1 0-.25-.05-.352-.05a3.2 3.2 0 0 1-.647-.198c-.301-.102-.6-.302-.851-.5-.25-.2-.448-.401-.648-.651-.199-.247-.35-.55-.448-.9-.102-.353-.15-.751-.15-1.15 0-.4.048-.8.15-1.149.099-.35.249-.652.447-.902.2-.248.4-.45.649-.649.25-.2.55-.398.851-.501.197-.098.447-.15.647-.196a1.95 1.95 0 0 1 .35-.052h.45c.1 0 .25.001.352.5.199.047.449.098.648.197.3.103.601.303.85.501.149.099.3.25.451.4.01-.048.049-.098.1-.15.05-.048.149-.1.248-.1.15 0 .25.048.35.15.098.1.149.198.149.3 0 .098-.051.197-.15.297a.437.437 0 0 1-.35.15c-.1 0-.2-.052-.299-.15-.09-.08-.13-.126-.2-.2zm7.199-3.997c-.1 0-.15.051-.15.15 0 .1.05.15.15.15h.3c.1 0 .15-.05.15-.15 0-.099-.05-.15-.15-.15h-.3zm.649-.747c-.099 0-.149.05-.149.15 0 .097.05.148.149.148h.3c.1 0 .15-.051.15-.148 0-.1-.05-.15-.15-.15h-.3zM9.7 2.704c.3-.001.599.099.851.3.25.2.349.499.349.799 0 .3-.1.599-.35.8-.252.2-.551.299-.851.299-.3 0-.599-.1-.8-.3-.25-.2-.349-.499-.349-.8 0-.3.1-.598.35-.799.2-.2.499-.3.8-.299z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold">Firefox</h3>
                </a>
                
                <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-card/80 p-4 rounded-lg border border-border/50 transition-colors text-center">
                  <div className="h-12 w-12 mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm5.717 2.05c.07-.376.498-.625.82-.273.333.356.14.945-.347 1.013-.486.082-.773-.392-.473-.74zm-10.67.068c.258-.216.56-.27.723-.05.198.266.154.705-.165.84-.41.166-.846-.192-.762-.606.038-.189.118-.102.204-.184zm9.524 1.645c.328-.363.7-.614 1.24-.76 0 0-.036 1.088-.703 1.604-.624.511-1.08.652-1.485.916 0 0-.027-.96.327-1.454.336-.493.622-.307.622-.307zm-8.63.053c.31-.339.69-.583 1.163-.756 0 0 .022 1.08-.664 1.588-.688.507-1.406.854-1.406.854s-.136-.676.152-1.125c.288-.45.755-.56.755-.56zM11.91 22c-.305 0-.605-.115-.832-.322l-.527-.484c-.473-.414-1.025-.115-1.025.465v.181c0 .087-.058.16-.176.16H7.87c-.118 0-.177-.073-.177-.16v-.19c0-.464-.322-.934-.95-.522l-.513.467c-.355.326-.658-.033-.908-.283l-.662-.663c-.25-.25-.61-.553-.284-.908l.467-.513c.411-.627-.058-.95-.523-.95h-.189c-.088 0-.161-.058-.161-.176v-1.48c0-.118.073-.176.16-.176h.19c.465 0 .934-.33.522-.95l-.466-.513c-.326-.355-.016-.63.283-.908l.663-.662c.25-.25.568-.6.908-.284l.513.467c.627.412.95-.058.95-.523v-.189c0-.088.059-.16.177-.16h1.48c.118 0 .176.072.176.16v.19c0 .58.547.878 1.025.464l.527-.483c.227-.207.505-.31.787-.31.282 0 .56.103.786.31l.528.483c.478.414 1.025.116 1.025-.465v-.19c0-.087.058-.16.176-.16h1.479c.118 0 .177.073.177.16v.19c0 .464.322.934.95.522l.513-.467c.34-.315.657-.033.908.284l.662.662c.25.25.61.553.284.908l-.467.513c-.412.627.058.95.523.95h.189c.088 0 .16.058.16.177v1.479c0 .118-.072.176-.16.176h-.189c-.465 0-.935.33-.523.95l.467.513c.326.355.033.657-.284.908l-.662.662c-.25.25-.569.6-.908.284l-.513-.467c-.628-.412-.95.058-.95.523v.189c0 .088-.059.16-.177.16h-1.479c-.118 0-.176-.072-.176-.16v-.19c0-.58-.547-.878-1.025-.464l-.528.483c-.226.207-.536.322-.841.322zm-.032-3c.785 0 1.498-.27 2.045-.78.6-.559.96-1.35.96-2.22s-.36-1.661-.96-2.22a3.266 3.266 0 0 0-2.068-.784h-.032c-.785 0-1.498.271-2.045.784-.6.559-.96 1.35-.96 2.22s.36 1.661.96 2.22a3.266 3.266 0 0 0 2.1.78z"/>
                    </svg>
                  </div>
                  <h3 className="font-bold">Safari</h3>
                </a>
                
                <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="bg-card hover:bg-card/80 p-4 rounded-lg border border-border/50 transition-colors text-center">
                  <div className="h-12 w-12 mx-auto mb-3">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="text-primary">
                      <path d="M.75 24c-.19 0-.33-.13-.37-.32-.04-.22.09-.4.29-.45C6.59 21.91 10.76 17.74 12 12.6c-1.14-.93-1.83-2.38-1.83-4 0-2.84 2.28-5.14 5.14-5.14a5.14 5.14 0 0 1 5.14 5.14c0 1.62-.72 3.07-1.83 4A16.29 16.29 0 0 0 24 21.8V24H.75zM12 2.4c-3.42 0-6.18 2.77-6.18 6.18 0 3.42 2.76 6.19 6.18 6.19h.01c3.41 0 6.18-2.77 6.18-6.19 0-3.41-2.77-6.18-6.19-6.18zM15.076.17c-1-.11-1.92-.17-2.7-.17C5.5 0 0 5.5 0 12.31c0 .56.08 1.25.17 1.97a12.25 12.25 0 0 0 10.33 10.23c.84.13 1.72.16 2.29.16A12.38 12.38 0 0 0 24 12.3c0-2.93-1.39-5.72-3.42-7.82C18.57 2.34 16.5.56 15.076.17z" />
                    </svg>
                  </div>
                  <h3 className="font-bold">Edge</h3>
                </a>
              </div>
              
              <div className="bg-warning/10 p-5 rounded-lg">
                <p className="text-sm font-bold mb-2">Important Note</p>
                <p className="text-sm">Blocking or deleting cookies may affect website functionality. Essential cookies cannot be disabled as they are necessary for the website to work properly.</p>
              </div>
            </div>
            
            <div id="policy-updates" className="policy-section mb-10 pb-10 border-b border-border">
              <h2 className="text-2xl font-semibold text-primary mb-5">6. Policy Updates</h2>
              
              <div className="bg-card rounded-lg border border-border/50 p-6">
                <p className="mb-4">We may update this policy to reflect changes in our practices. Updates will be posted on this page.</p>
                
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">How We Notify You</h3>
                  <p className="text-sm">
                    For significant changes to this Cookie Policy, we will make reasonable efforts to notify you by:
                  </p>
                  <ul className="list-disc pl-6 mt-2 text-sm">
                    <li className="mb-1">Posting a notice on our website</li>
                    <li className="mb-1">Updating the "Effective Date" at the top of this page</li>
                    <li className="mb-1">In some cases, sending an email to registered users</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div id="contact" className="policy-section mb-10">
              <h2 className="text-2xl font-semibold text-primary mb-5">7. Contact</h2>
              
              <p className="mb-4">For questions about our cookie policy:</p>
              
              <div className="bg-accent/10 rounded-lg p-6 mt-4 text-center">
                <h3 className="text-xl font-medium text-accent mb-2">Get in Touch</h3>
                <p className="mb-4">We're here to help with any questions about our cookie practices</p>
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
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { 
  HelpCircle, 
  Clock, 
  Truck, 
  Globe, 
  Edit, 
  Headphones, 
  Calendar, 
  AlertTriangle,
  RotateCcw,
  Cpu,
  Shield,
  Gamepad,
  Puzzle,
  Search,
  Mail
} from "lucide-react";

// FAQ data structure
interface FAQ {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

// FAQ data
const faqData: FAQ[] = [
  {
    id: "faq-1",
    question: "How long does it take to receive my custom PC?",
    answer: "Our typical delivery time is 7-10 days. This includes time for sourcing parts, building the PC, performing rigorous testing, and shipping. Please note that availability of components may affect the timeline.",
    icon: <Clock className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-2",
    question: "Can I track my order?",
    answer: "Yes! Once your PC has been shipped, you will receive a tracking number via email to monitor its progress until it arrives safely at your doorstep.",
    icon: <Truck className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-3",
    question: "Do you offer international shipping?",
    answer: "Currently, we only offer shipping within the UK mainland. Unfortunately, we are unable to deliver to the Republic of Ireland or other international destinations at this time.",
    icon: <Globe className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-4",
    question: "Can I customize my PC after placing the order?",
    answer: "Once your order is placed, we begin the build process. Customizations may be limited, but please feel free to contact us immediately if you need to adjust your order. We'll do our best to accommodate any changes before we start building.",
    icon: <Edit className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-5",
    question: "Do you offer after-sales support?",
    answer: "Absolutely! We offer technical support and troubleshooting assistance. If you encounter any issues after receiving your PC, our team is here to help. We also provide guidance on optimizing your system and upgrading parts.",
    icon: <Headphones className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-6",
    question: "Can I request a specific delivery time?",
    answer: "Unfortunately, we cannot offer timed or Saturday/Sunday delivery services outside of the UK mainland. Our standard shipping typically takes 1-2 days within the UK mainland.",
    icon: <Calendar className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-7",
    question: "What should I do if I receive a damaged PC?",
    answer: "We take great care in packaging your PC securely. However, if your PC arrives damaged, please contact us immediately with photos of the damage. We will work with you to resolve the issue as quickly as possible, including arranging a replacement if necessary.",
    icon: <AlertTriangle className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-8",
    question: "Can I return my custom-built PC?",
    answer: "Due to the custom nature of our builds, we generally do not accept returns unless the product is faulty or damaged during shipping. Please review your configuration carefully before placing your order.",
    icon: <RotateCcw className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-9",
    question: "What components do you offer for custom builds?",
    answer: "We offer a wide range of high-quality components from leading manufacturers. Our builds typically include Intel/AMD CPUs, NVIDIA/AMD GPUs, Corsair/Seagate storage solutions, and MSI/Asus motherboards, among others. You can select from a variety of options when customizing your PC on our site.",
    icon: <Cpu className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-10",
    question: "What warranty do you provide?",
    answer: "Each custom-built PC comes with a 3-year warranty covering any manufacturing defects or hardware failures. We also provide lifetime technical support for your system.",
    icon: <Shield className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-11",
    question: "Can you build a PC for gaming, content creation, or other specific needs?",
    answer: "Yes! We specialize in custom-built PCs for various purposes, including gaming, content creation, video editing, 3D rendering, and more. When you select your parts, you can choose configurations tailored to your specific needs.",
    icon: <Gamepad className="h-5 w-5 text-primary" />
  },
  {
    id: "faq-12",
    question: "How do I ensure my selected parts are compatible?",
    answer: "We use industry-standard parts that are known to be compatible with each other. However, if you have any concerns, our team is always available to help double-check compatibility before your order is finalized. We ensure every part is tested thoroughly for optimal performance.",
    icon: <Puzzle className="h-5 w-5 text-primary" />
  }
];

export default function FAQ() {
  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(faqData);
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Filter FAQs based on search term
  useEffect(() => {
    const filtered = faqData.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFaqs(filtered);
  }, [searchTerm]);
  
  return (
    <>
      <Helmet>
        <title>FAQ | RigFreaks Custom PCs</title>
        <meta name="description" content="Find answers to common questions about RigFreaks custom PC builds, delivery process, after-sales support, and more." />
      </Helmet>
      
      <div className="bg-gradient-to-b from-dark-card to-black py-10 border-b border-border">
        <Container>
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-accent/10 p-4 rounded-full">
              <HelpCircle className="h-8 w-8 md:h-10 md:w-10 text-accent" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center">Frequently Asked Questions</h1>
            <p className="text-muted-foreground text-center max-w-2xl mt-4">
              Find answers to common questions about our custom PC builds, delivery process, and after-sales support. 
              If you can't find what you're looking for, don't hesitate to <Link href="/contact" className="text-primary hover:underline">contact us</Link>.
            </p>
          </div>
        </Container>
      </div>
      
      <Container className="py-10">
        <div className="max-w-3xl mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              className="pl-10 bg-card/50 border-border py-6 text-base"
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {filteredFaqs.length === 0 && searchTerm !== "" ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-primary/10">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                We couldn't find any FAQs matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq) => (
                <AccordionItem 
                  key={faq.id} 
                  value={faq.id}
                  className="border border-border rounded-lg overflow-hidden bg-card/50"
                >
                  <AccordionTrigger className="px-6 py-4 hover:bg-accent/5 data-[state=open]:bg-accent/5 data-[state=open]:text-accent">
                    <div className="flex items-center text-left">
                      <div className="mr-3">
                        {faq.icon}
                      </div>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pt-2 pb-4 bg-black/20">
                    <div className="pl-8">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          
          <div className="text-center mt-12 py-8 border-t border-border">
            <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
            <Link href="/contact">
              <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-6 h-auto">
                <Mail className="h-5 w-5 mr-2" />
                Contact Our Support Team
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </>
  );
}
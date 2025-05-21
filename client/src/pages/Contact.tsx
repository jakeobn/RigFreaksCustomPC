import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { AlertCircle, Mail, MapPin, Phone, Send, Check, MessageSquare } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().optional(),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const FAQs = [
  {
    question: "What is the warranty on your PCs?",
    answer: "All RigFreaks PCs come with a comprehensive 3-year warranty covering parts and labor. This includes free technical support for the lifetime of your system."
  },
  {
    question: "How long does it take to build and ship my custom PC?",
    answer: "Our standard build time is 7-10 business days from the date of order. Once built, shipping typically takes 2-5 business days depending on your location."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the continental United States. We're working on expanding our shipping options to include international destinations in the future."
  },
  {
    question: "Can I upgrade my PC after purchase?",
    answer: "Absolutely! All of our PCs are built with standard components that can be easily upgraded. Our technical support team can guide you through the upgrade process or you can send your PC back to us for professional upgrades."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and offer financing options through Affirm. We also accept bank transfers for orders over £3,000."
  },
  {
    question: "Do you offer custom water cooling?",
    answer: "Yes, we offer both AIO (all-in-one) liquid cooling solutions and custom open-loop water cooling. Custom water cooling is available on select systems and can be discussed with our sales team."
  }
];

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setFormStatus('submitting');
    try {
      // In a real implementation, this would send data to an API endpoint
      // For now, we'll simulate a successful submission after a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form on success
      form.reset();
      setFormStatus('success');
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact RigFreaks - Support, Sales & General Inquiries</title>
        <meta name="description" content="Get in touch with the RigFreaks team for support, sales inquiries, or any questions about our custom gaming PCs and workstations." />
        <meta property="og:title" content="Contact RigFreaks - Support, Sales & General Inquiries" />
        <meta property="og:description" content="Reach out to our team with any questions about our custom PC builds, warranty support, or technical assistance." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1551434678-e076c223a692" />
        <meta property="og:url" content="https://rigfreaks.com/contact" />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {/* Contact Hero */}
      <section className="relative h-[30vh] flex items-center bg-cover bg-center" style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-base/90 to-dark-base/70"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-rajdhani mb-4 leading-tight">
              CONTACT <span className="text-primary">US</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Have questions or need help? We're here for you. Reach out to our team.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Content */}
      <section className="py-16 bg-dark-base">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-rajdhani font-bold mb-6">
                <span className="border-b-4 border-primary pb-2">CONTACT INFO</span>
              </h2>
              
              <div className="space-y-8">
                <Card className="bg-dark-surface border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-3 mr-4">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Phone Support</h3>
                        <p className="text-muted-foreground mb-1">Sales & Support</p>
                        <p className="text-lg">(555) 123-4567</p>
                        <p className="text-xs text-muted-foreground mt-2">Monday-Friday: 9am-6pm EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-surface border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-accent/10 rounded-full p-3 mr-4">
                        <Mail className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Email</h3>
                        <p className="text-muted-foreground mb-1">Customer Support</p>
                        <p className="text-lg">support@rigfreaks.com</p>
                        <p className="text-muted-foreground mb-1 mt-3">Sales Inquiries</p>
                        <p className="text-lg">sales@rigfreaks.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-surface border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-3 mr-4">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Office Address</h3>
                        <p className="text-muted-foreground">123 Tech Boulevard</p>
                        <p className="text-muted-foreground">Suite 456</p>
                        <p className="text-muted-foreground">San Francisco, CA 94103</p>
                        <p className="text-xs text-muted-foreground mt-2">By appointment only</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-dark-surface border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="bg-accent/10 rounded-full p-3 mr-4">
                        <MessageSquare className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-bold mb-2">Live Chat</h3>
                        <p className="text-muted-foreground mb-1">Available on our website</p>
                        <p className="text-lg">Live Chat Support</p>
                        <p className="text-xs text-muted-foreground mt-2">Monday-Sunday: 10am-8pm EST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-rajdhani font-bold mb-6">
                <span className="border-b-4 border-accent pb-2">SEND US A MESSAGE</span>
              </h2>
              
              {formStatus === 'success' && (
                <Alert className="mb-6 bg-green-900/30 border-green-500">
                  <Check className="h-4 w-4 text-green-500" />
                  <AlertTitle>Success!</AlertTitle>
                  <AlertDescription>
                    Your message has been sent successfully. We'll get back to you as soon as possible.
                  </AlertDescription>
                </Alert>
              )}
              
              {formStatus === 'error' && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    There was a problem sending your message. Please try again or contact us directly.
                  </AlertDescription>
                </Alert>
              )}
              
              <Card className="bg-dark-surface border-gray-800">
                <CardContent className="p-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-dark-card border-gray-700" 
                                  placeholder="Your name" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-dark-card border-gray-700" 
                                  placeholder="Your email" 
                                  type="email"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-dark-card border-gray-700" 
                                  placeholder="Your phone number" 
                                  type="tel"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input 
                                  className="bg-dark-card border-gray-700" 
                                  placeholder="Message subject" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="bg-dark-card border-gray-700 min-h-[150px]" 
                                placeholder="Your message" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="bg-primary hover:bg-primary/90 text-white font-rajdhani font-semibold"
                        disabled={formStatus === 'submitting'}
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" /> Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQs Section */}
      <section className="py-16 bg-gradient-dark">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-rajdhani font-bold mb-12 text-center">
            <span className="border-b-4 border-primary pb-2">FREQUENTLY ASKED QUESTIONS</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {FAQs.map((faq, index) => (
              <Card key={index} className="bg-dark-surface border-gray-800">
                <CardContent className="p-6">
                  <h3 className="text-xl font-rajdhani font-semibold mb-3 flex items-start">
                    <span className="text-primary mr-2">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <div className="pl-6 text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-6">
              Don't see your question here? Contact us and we'll be happy to help!
            </p>
            <Button 
              className="bg-accent hover:bg-accent/90 text-dark-base font-rajdhani font-semibold"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Mail className="mr-2 h-4 w-4" /> Contact Support
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;

import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Sending contact form:", formData);
      
      await apiClient.sendContactMessage(formData);

      console.log("Email sent successfully");
      toast.success("Message sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-legal-blue-light/20 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
                Get in Touch
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                Have questions about our platform? Need help with your legal case? 
                We're here to assist you every step of the way.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="space-y-6">
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-105 hover:shadow-legal transition-all duration-500 animate-slide-in-left">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-6 w-6 text-legal-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Send us an email anytime
                        </p>
                        <a href="mailto:harshalingaledev@gmail.com" className="text-legal-blue hover:underline text-sm">
                          harshalingaledev@gmail.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-105 hover:shadow-legal transition-all duration-500 animate-slide-in-left" style={{ animationDelay: "0.1s" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-6 w-6 text-legal-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Mon-Fri 9am to 6pm
                        </p>
                        <a href="tel:7057535197" className="text-legal-blue hover:underline text-sm">
                          7057535197
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-105 hover:shadow-legal transition-all duration-500 animate-slide-in-left" style={{ animationDelay: "0.2s" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-legal-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Visit Us</h3>
                        <p className="text-sm text-muted-foreground">
                          Pimpri Chinchwad<br />
                          Akurdi, Pune<br />
                          411035
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-105 hover:shadow-legal transition-all duration-500 animate-slide-in-left" style={{ animationDelay: "0.3s" }}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="h-6 w-6 text-legal-blue" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground mb-1">Business Hours</h3>
                        <p className="text-sm text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM<br />
                          Saturday: 10:00 AM - 4:00 PM<br />
                          Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:shadow-legal transition-all duration-500 animate-slide-in-right">
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">
                            Full Name <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-2"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">
                            Email Address <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-2"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={handleChange}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">
                          Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us more about your inquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          className="mt-2 min-h-[200px]"
                          required
                        />
                      </div>

                      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-legal-blue-light/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in-up">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-card-soft hover:scale-105 hover:shadow-legal transition-all duration-500 animate-scale-in cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">How quickly will I get a response?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We typically respond to all inquiries within 24 hours during business days. 
                    Urgent matters may receive faster responses.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card-soft hover:scale-105 hover:shadow-legal transition-all duration-500 animate-scale-in cursor-pointer" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Is there a fee for contacting you?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No, reaching out to us is completely free. We're here to answer your questions 
                    and help you understand our services.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card-soft hover:scale-105 hover:shadow-legal transition-all duration-500 animate-scale-in cursor-pointer" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="text-lg">Can I schedule a consultation?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Yes! You can request a consultation through this form or by calling us directly. 
                    We'll help you get matched with the right legal professional.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card-soft hover:scale-105 hover:shadow-legal transition-all duration-500 animate-scale-in cursor-pointer" style={{ animationDelay: "0.3s" }}>
                <CardHeader>
                  <CardTitle className="text-lg">What information should I include?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Provide a brief overview of your situation, what type of help you need, 
                    and any specific questions you have. Don't worry about legal terminology!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;

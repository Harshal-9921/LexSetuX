import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Shield, Search, FileText, MessageCircle, ArrowRight } from "lucide-react";

const ServicesSection = () => {
  const customerServices = [
    {
      icon: Brain,
      title: "AI Legal Analysis",
      description: "Get instant simplified explanations of your legal rights and applicable laws",
      features: ["Case classification", "Rights mapping", "Precedent analysis"]
    },
    {
      icon: Users,
      title: "Expert Lawyer Matching",
      description: "Connect with verified attorneys specialized in your specific legal area",
      features: ["Skill-based matching", "Location filtering", "Availability tracking"]
    },
    {
      icon: MessageCircle,
      title: "Consultation Booking",
      description: "Schedule direct consultations with recommended legal professionals",
      features: ["In-app messaging", "Appointment scheduling", "Secure communication"]
    }
  ];

  const lawyerServices = [
    {
      icon: Search,
      title: "Deep Legal Research",
      description: "Access comprehensive case analysis with precedents and opponent insights",
      features: ["Full precedent database", "Argument prediction", "Case strength analysis"]
    },
    {
      icon: FileText,
      title: "Document Generation",
      description: "Generate legal documents and case summaries with AI assistance",
      features: ["PDF export", "Template library", "Custom formatting"]
    },
    {
      icon: Shield,
      title: "Client Management",
      description: "Manage your client relationships and track case progress efficiently",
      features: ["Client dashboard", "Progress tracking", "Communication tools"]
    }
  ];

  const ServiceCard = ({ service, variant = "default" }: { 
    service: typeof customerServices[0], 
    variant?: "default" | "professional" 
  }) => {
    const Icon = service.icon;
    
    return (
      <Card className={`group hover:shadow-legal transition-all duration-500 transform hover:scale-105 hover:-translate-y-3 border-2 cursor-pointer ${
        variant === "professional" ? "hover:border-legal-blue" : "hover:border-legal-blue-light"
      }`}>
        <CardHeader className="pb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 ${
            variant === "professional" 
              ? "bg-legal-blue text-white group-hover:bg-legal-blue-dark" 
              : "bg-legal-blue-light text-legal-blue group-hover:bg-legal-blue group-hover:text-white"
          } transition-all duration-500`}>
            <Icon className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl font-semibold text-foreground group-hover:text-legal-blue transition-colors">
            {service.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            {service.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 mb-6">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-legal-blue rounded-full mr-3"></div>
                {feature}
              </li>
            ))}
          </ul>
          <Button 
            variant={variant === "professional" ? "professional" : "trust"} 
            size="sm" 
            className="w-full group/btn"
          >
            Learn More
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <section id="services" className="py-20 bg-gradient-to-b from-white to-legal-blue-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Comprehensive Legal Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Whether you're seeking legal help or providing legal services, 
            LawMate offers powerful AI-driven tools for everyone in the legal ecosystem.
          </p>
        </div>

        {/* Customer Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-legal-blue/20 mb-4">
              <Users className="h-4 w-4 text-legal-blue mr-2" />
              <span className="text-legal-blue font-medium">For Customers</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Understand Your Legal Rights
            </h3>
            <p className="text-muted-foreground">
              Get instant AI-powered insights and connect with the right legal experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>

        {/* Lawyer Services */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-legal-blue text-white mb-4">
              <Shield className="h-4 w-4 mr-2" />
              <span className="font-medium">For Lawyers</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Advanced Legal Intelligence
            </h3>
            <p className="text-muted-foreground">
              Access deep insights, manage clients, and enhance your legal practice
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {lawyerServices.map((service, index) => (
              <ServiceCard key={index} service={service} variant="professional" />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-hero-gradient rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Transform Your Legal Experience?
            </h3>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust LawMate for their legal needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="trust" size="xl">
                Start as Customer
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-legal-blue">
                Join as Lawyer
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
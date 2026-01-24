import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Users, Scale, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-legal.jpg";

const HeroSection = () => {
  const keyFeatures = [
    "AI-powered legal analysis",
    "Expert lawyer matching", 
    "Simplified legal explanations"
  ];

  const trustIndicators = [
    { icon: Users, label: "1000+ Legal Cases", value: "Analyzed" },
    { icon: Scale, label: "500+ Verified", value: "Lawyers" },
    { icon: TrendingUp, label: "95% Success", value: "Rate" },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-gradient-to-br from-legal-blue-light/20 via-background to-legal-blue-light/10 dark:from-legal-blue-dark/20 dark:via-background dark:to-legal-blue/10">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-legal-blue/15 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-legal-blue-light/25 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-legal-blue-dark/15 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6 animate-bounce-in">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-legal-blue-light text-legal-blue text-sm font-medium border border-legal-blue/20 hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-4 w-4 mr-2" />
                AI-Powered Legal Platform
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight animate-fade-in-up">
              Your Legal Problems,
              <span className="bg-hero-gradient bg-clip-text text-transparent block">
                Simplified & Solved
              </span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Get instant AI-powered legal insights, connect with verified lawyers, 
              and understand your rights in simple terms. Justice made accessible.
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8 animate-slide-in-left">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CheckCircle className="h-5 w-5 text-legal-blue" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              <Button variant="hero" size="xl" className="group hover:scale-110 transition-all duration-300">
                Describe Your Case
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="trust" size="xl" className="hover:scale-110 transition-all duration-300">
                Find a Lawyer
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-border">
              <div className="grid grid-cols-3 gap-8 text-center lg:text-left">
                {trustIndicators.map((indicator, index) => {
                  const Icon = indicator.icon;
                  return (
                    <div key={index} className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-3">
                      <div className="bg-legal-blue-light p-2 rounded-lg w-fit mx-auto lg:mx-0">
                        <Icon className="h-5 w-5 text-legal-blue" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-lg">{indicator.value}</div>
                        <div className="text-sm text-muted-foreground">{indicator.label}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative animate-scale-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative rounded-2xl overflow-hidden shadow-legal hover:scale-105 hover:shadow-2xl transition-all duration-700">
              <img
                src={heroImage}
                alt="Modern legal technology platform interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-hero-gradient opacity-10"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-card rounded-lg p-4 shadow-card-soft border border-border hover:scale-110 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium text-foreground">Verified Lawyers</span>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-card rounded-lg p-4 shadow-card-soft border border-border hover:scale-110 transition-transform duration-300">
              <div className="flex items-center space-x-2">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Scale className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">AI Legal Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
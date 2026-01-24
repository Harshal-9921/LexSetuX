import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, Users, Target, Award } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-legal-blue-light/20 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 animate-fade-in-up">
                About Legal AI Platform
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                We're revolutionizing access to legal services by combining artificial intelligence 
                with expert legal professionals to provide affordable, accurate legal guidance for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-4">
                  Legal services should be accessible to everyone, not just those who can afford 
                  expensive lawyers. Our platform uses cutting-edge AI technology to analyze legal 
                  cases and match users with the right legal professionals.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe in transparency, affordability, and empowering individuals to 
                  understand their legal rights and options.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 animate-slide-in-right">
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-110 hover:shadow-legal transition-all duration-500 cursor-pointer">
                  <CardContent className="pt-6 text-center">
                    <Users className="h-12 w-12 text-legal-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">10,000+</h3>
                    <p className="text-sm text-muted-foreground">Cases Analyzed</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-110 hover:shadow-legal transition-all duration-500 cursor-pointer" style={{ animationDelay: "0.1s" }}>
                  <CardContent className="pt-6 text-center">
                    <Scale className="h-12 w-12 text-legal-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">500+</h3>
                    <p className="text-sm text-muted-foreground">Expert Lawyers</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-110 hover:shadow-legal transition-all duration-500 cursor-pointer" style={{ animationDelay: "0.2s" }}>
                  <CardContent className="pt-6 text-center">
                    <Target className="h-12 w-12 text-legal-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">95%</h3>
                    <p className="text-sm text-muted-foreground">Match Accuracy</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-110 hover:shadow-legal transition-all duration-500 cursor-pointer" style={{ animationDelay: "0.3s" }}>
                  <CardContent className="pt-6 text-center">
                    <Award className="h-12 w-12 text-legal-blue mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-foreground mb-2">4.8/5</h3>
                    <p className="text-sm text-muted-foreground">User Rating</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-legal-blue-light/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in-up">
              How We Work
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-card-soft hover:scale-110 hover:shadow-legal transition-all duration-500 animate-bounce-in cursor-pointer">
                <CardContent className="pt-6">
                  <div className="bg-legal-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Describe Your Case</h3>
                  <p className="text-muted-foreground">
                    Tell us about your legal situation in simple terms. Our AI understands natural language.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card-soft hover:scale-110 hover:shadow-legal transition-all duration-500 animate-bounce-in cursor-pointer" style={{ animationDelay: "0.15s" }}>
                <CardContent className="pt-6">
                  <div className="bg-legal-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">AI Analysis</h3>
                  <p className="text-muted-foreground">
                    Our advanced AI analyzes your case, identifies relevant laws, and assesses your legal rights.
                  </p>
                </CardContent>
              </Card>
              <Card className="shadow-card-soft hover:scale-110 hover:shadow-legal transition-all duration-500 animate-bounce-in cursor-pointer" style={{ animationDelay: "0.3s" }}>
                <CardContent className="pt-6">
                  <div className="bg-legal-blue text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">Expert Matching</h3>
                  <p className="text-muted-foreground">
                    Get matched with qualified lawyers who specialize in your specific legal area.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12 animate-fade-in-up">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex space-x-4 animate-slide-in-left hover:scale-105 transition-transform duration-300 cursor-pointer">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center">
                    <Scale className="h-6 w-6 text-legal-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Accessibility</h3>
                  <p className="text-muted-foreground">
                    Making legal services affordable and accessible to everyone, regardless of their financial situation.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 animate-slide-in-right hover:scale-105 transition-transform duration-300 cursor-pointer" style={{ animationDelay: "0.1s" }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-legal-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Quality</h3>
                  <p className="text-muted-foreground">
                    Maintaining high standards of accuracy in our AI analysis and partnering with only qualified legal professionals.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 animate-slide-in-left hover:scale-105 transition-transform duration-300 cursor-pointer" style={{ animationDelay: "0.2s" }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-legal-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Transparency</h3>
                  <p className="text-muted-foreground">
                    Providing clear explanations of legal processes and upfront pricing with no hidden fees.
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 animate-slide-in-right hover:scale-105 transition-transform duration-300 cursor-pointer" style={{ animationDelay: "0.3s" }}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-legal-blue-light rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-legal-blue" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Empowerment</h3>
                  <p className="text-muted-foreground">
                    Educating users about their legal rights and options so they can make informed decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

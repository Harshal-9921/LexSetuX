import { Card, CardContent } from "@/components/ui/card";
import { Database, FileText, Brain, Settings, CheckCircle, Rocket } from "lucide-react";

const ModelTrainingSection = () => {
  const trainingSteps = [
    {
      icon: Database,
      title: "Data Collection",
      description: "We collect case descriptions, legal judgments, and IPC section mappings from JusticeHub, Indian Kanoon, and Kaggle datasets.",
      example: "Example: Tenant dispute case → linked to Rent Control Act.",
      delay: "0s"
    },
    {
      icon: FileText,
      title: "Data Preprocessing",
      description: "Clean the text using NLP preprocessing (tokenization, lemmatization, stop-word removal).",
      details: [
        "Input → Case description in plain text",
        "Output (label) → IPC Section, Case Domain (Property, Criminal, Contract, etc.)"
      ],
      delay: "0.1s"
    },
    {
      icon: Settings,
      title: "Feature Extraction",
      description: "Use embeddings from LegalBERT / IL-TUR model. These embeddings capture legal language patterns.",
      example: "Example: \"fraud\" → linked with IPC 420 (Cheating).",
      delay: "0.2s"
    },
    {
      icon: Brain,
      title: "Model Training",
      description: "Fine-tune LegalBERT (a transformer model trained on legal text) with our dataset.",
      details: [
        "Input: Case description",
        "Output: Predicted legal section + domain",
        "Optimization: Use supervised learning with cross-entropy loss"
      ],
      delay: "0.3s"
    },
    {
      icon: CheckCircle,
      title: "Validation & Testing",
      description: "Split data: 80% training, 20% testing. Measure accuracy, precision, recall, and F1-score.",
      example: "Example: If model predicts \"IPC 420\" for fraud-related text and it's correct → Accuracy improves.",
      delay: "0.4s"
    },
    {
      icon: Rocket,
      title: "Deployment",
      description: "After training, the model is stored as an API.",
      details: [
        "When a customer/lawyer enters a new case, the trained model predicts the classification instantly"
      ],
      delay: "0.5s"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-legal-blue-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            How We Are Training the Model
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Our AI model is trained using cutting-edge natural language processing techniques 
            and comprehensive legal datasets to provide accurate case analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainingSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card 
                key={index}
                className="shadow-card-soft border-2 border-legal-blue/20 hover:scale-105 hover:shadow-legal transition-all duration-500 cursor-pointer animate-bounce-in"
                style={{ animationDelay: step.delay }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-gradient-to-br from-legal-blue to-legal-blue-dark text-white rounded-lg w-14 h-14 flex items-center justify-center mr-4">
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="bg-legal-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  
                  {step.details && (
                    <ul className="space-y-2 mb-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-legal-blue mr-2">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {step.example && (
                    <div className="mt-4 p-3 bg-legal-blue-light/30 rounded-lg border border-legal-blue/20">
                      <p className="text-sm text-foreground italic">
                        {step.example}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Key Metrics */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <Card className="shadow-card-soft border-2 border-legal-blue/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-legal-blue-light/20">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-legal-blue mb-2">95%+</div>
              <div className="text-sm text-muted-foreground">Model Accuracy</div>
            </CardContent>
          </Card>
          <Card className="shadow-card-soft border-2 border-legal-blue/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-legal-blue-light/20">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-legal-blue mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Training Cases</div>
            </CardContent>
          </Card>
          <Card className="shadow-card-soft border-2 border-legal-blue/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-legal-blue-light/20">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-legal-blue mb-2">300+</div>
              <div className="text-sm text-muted-foreground">IPC Sections</div>
            </CardContent>
          </Card>
          <Card className="shadow-card-soft border-2 border-legal-blue/30 hover:scale-105 transition-all duration-300 bg-gradient-to-br from-white to-legal-blue-light/20">
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-legal-blue mb-2">10+</div>
              <div className="text-sm text-muted-foreground">Case Domains</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ModelTrainingSection;

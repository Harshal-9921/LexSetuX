import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, HelpCircle, ArrowRight, FileText, MessageSquare, Loader2, X, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
// Supabase removed - using FastAPI only
// import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import apiClient, { CaseAnalysisRequest, CaseAnalysisResponse } from "@/services/api";
import CaseAnalysisResults from "./CaseAnalysisResults";

const CaseInputForm = () => {
  const [caseDescription, setCaseDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<CaseAnalysisResponse | null>(null);
  const { session, profile } = useAuth();
  const navigate = useNavigate();

  // Load saved results from localStorage on mount
  useEffect(() => {
    const loadSavedResults = () => {
      const savedResults = localStorage.getItem('caseAnalysisResults');
      if (savedResults) {
        try {
          const parsed = JSON.parse(savedResults);
          setAnalysisResults(parsed);
        } catch (e) {
          console.error('Failed to load saved results:', e);
          localStorage.removeItem('caseAnalysisResults');
        }
      }
    };
    loadSavedResults();
  }, []);

  // Save results to localStorage whenever they change
  const saveResults = (results: CaseAnalysisResponse | null) => {
    setAnalysisResults(results);
    if (results) {
      localStorage.setItem('caseAnalysisResults', JSON.stringify(results));
    } else {
      localStorage.removeItem('caseAnalysisResults');
    }
  };

  const legalCategories = [
    { id: "property", name: "Property Law", description: "Real estate, rent, landlord disputes" },
    { id: "family", name: "Family Law", description: "Divorce, custody, marriage issues" },
    { id: "criminal", name: "Criminal Law", description: "Criminal charges, legal violations" },
    { id: "employment", name: "Employment", description: "Workplace disputes, termination" },
    { id: "consumer", name: "Consumer Rights", description: "Product issues, service complaints" },
    { id: "civil", name: "Civil Disputes", description: "Contracts, agreements, damages" },
    { id: "corporate", name: "Corporate Law", description: "Business disputes, compliance" },
    { id: "other", name: "Other", description: "Different legal matter" }
  ];

  const guidedPrompts = [
    "My landlord refused to return my security deposit of ₹50,000 after I vacated the property.",
    "I was terminated from my job without prior notice or severance pay after 3 years of service.",
    "A shop sold me a defective product and is refusing to provide a refund or replacement.",
    "My neighbor is constructing a building that blocks sunlight to my property.",
    "I signed a contract but the other party is not fulfilling their obligations."
  ];

  const handlePromptClick = (prompt: string) => {
    setCaseDescription(prev => prev + (prev ? '\n\n' : '') + prompt);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // File upload function - to be implemented with FastAPI
  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    // TODO: Implement FastAPI file upload endpoint
    // For now, return empty array
    toast.info('File upload feature coming soon with FastAPI');
    return [];
  };

  const handleAnalyzeCase = async () => {
    if (!caseDescription.trim()) {
      toast.error('Please describe your legal situation');
      return;
    }

    setIsAnalyzing(true);
    console.log('Starting case analysis...', { descriptionLength: caseDescription.length });
    
    try {
      // Save the case description to localStorage for potential re-analysis
      localStorage.setItem('lastCaseDescription', caseDescription);
      
      // File uploads - for now, just skip or implement FastAPI file upload later
      let documentPaths: string[] = [];
      if (selectedFiles.length > 0) {
        toast.info('File uploads will be available soon. Proceeding with analysis...');
        // TODO: Implement FastAPI file upload endpoint
        // For now, skip file uploads
      }

      // Determine user role (default to customer if not logged in)
      const userRole = profile?.role || "customer";
      
      // Call FastAPI backend (category will be auto-classified by AI)
      const request: CaseAnalysisRequest = {
        description: caseDescription,
        // category is optional - AI will auto-classify based on description
        userId: session?.user?.id || null,
        documents: documentPaths,
        user_role: userRole
      };

      console.log('Calling FastAPI with request:', request);
      
      const data = await apiClient.analyzeCase(request);

      console.log('Analysis response:', data);

      if (!data) {
        throw new Error('No data returned from analysis');
      }

      toast.success('Case analyzed successfully!');
      
      // Store results for display (persist to localStorage)
      saveResults(data);
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (error) {
      console.error('Error analyzing case:', error);
      let errorMessage = 'Unknown error occurred';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        // Check if it's a connection error
        if (error.message.includes('Failed to fetch') || error.message.includes('Cannot connect')) {
          errorMessage = `Cannot connect to backend server. Please make sure the FastAPI server is running and accessible. If it's running on a different host or port, set VITE_API_BASE_URL in your .env file.`;
        }
      }
      
      toast.error(`Failed to analyze case: ${errorMessage}`, {
        duration: 8000, // Show for longer
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-b from-legal-blue-light/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
            Describe Your Legal Case
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Our AI will analyze your situation and provide simplified legal insights along with expert lawyer recommendations.
          </p>
        </div>

        {/* Main Layout: Form on left, Sidebar on right */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Left side: Case Details Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-card-soft border-2 hover:border-legal-blue/20 hover:shadow-legal transition-all duration-500 animate-slide-in-left">
              <CardHeader className="py-4 px-5">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <FileText className="h-5 w-5 text-legal-blue" />
                  <span>Case Details</span>
                </CardTitle>
                <CardDescription className="text-sm mt-1">
                  Describe your legal situation in detail
                </CardDescription>
              </CardHeader>
              <CardContent className="py-3 px-5 space-y-4">
                {/* Case Description */}
                <div>
                  <Label htmlFor="case-description" className="text-sm font-medium mb-2 block">
                    Describe Your Situation
                    <span className="text-destructive ml-1">*</span>
                  </Label>
                  <Textarea
                    id="case-description"
                    placeholder="Please provide details about your legal situation..."
                    value={caseDescription}
                    onChange={(e) => setCaseDescription(e.target.value)}
                    className="min-h-[140px] resize-none text-sm"
                  />
                  <div className="flex justify-between items-center mt-1 text-xs text-muted-foreground">
                    <span>Be detailed. AI auto-classifies your case.</span>
                    <span>{caseDescription.length}/2000</span>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Supporting Documents (Optional)
                  </Label>
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-upload"
                    className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-legal-blue/50 transition-colors cursor-pointer block"
                  >
                    <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground mb-1">
                      Drop files here or click to upload
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF/DOC/Images (Max 5 files)
                    </p>
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-muted rounded text-xs"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <FileText className="h-3 w-3 text-legal-blue flex-shrink-0" />
                            <span className="truncate">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  variant="hero" 
                  size="lg"
                  className="w-full text-sm"
                  disabled={!caseDescription.trim() || isAnalyzing || isUploading}
                  onClick={handleAnalyzeCase}
                >
                  {isAnalyzing || isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isUploading ? 'Uploading...' : 'Analyzing...'}
                    </>
                  ) : (
                    <>
                      Analyze My Case
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Right Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Case Details Samples */}
            <Card className="shadow-card-soft hover:shadow-legal transition-all duration-500 bg-legal-blue-light/50 dark:bg-legal-blue/20 border-legal-blue/30">
              <CardHeader className="py-4 px-5">
                <CardTitle className="flex items-center space-x-2 text-lg text-legal-blue">
                  <MessageSquare className="h-5 w-5 text-legal-blue" />
                  <span>Case Samples</span>
                </CardTitle>
                <CardDescription className="text-foreground/70 text-xs">
                  Click to use example descriptions
                </CardDescription>
              </CardHeader>
              <CardContent className="py-3 px-5">
                <div className="space-y-2">
                  {guidedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-left h-auto py-2 px-3 bg-white dark:bg-background border-legal-blue/30 hover:bg-legal-blue-light hover:border-legal-blue text-foreground whitespace-normal"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      <HelpCircle className="h-3 w-3 mr-2 text-legal-blue flex-shrink-0 mt-0.5" />
                      <span className="text-xs leading-relaxed line-clamp-2">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What Happens Next */}
            <Card className="shadow-card-soft bg-legal-blue-light/30 border-legal-blue/20 hover:shadow-legal transition-all duration-500">
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-lg text-legal-blue">What Happens Next?</CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-5">
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <div className="bg-legal-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">AI Analysis</p>
                      <p className="text-xs text-muted-foreground">Analyze for legal rights</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-legal-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Lawyer Matching</p>
                      <p className="text-xs text-muted-foreground">Get specialist recommendations</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="bg-legal-blue text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">Take Action</p>
                      <p className="text-xs text-muted-foreground">Book consultations</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="text-center space-y-2">
              <div className="flex flex-col gap-2">
                <Badge variant="outline" className="border-legal-blue/30 text-legal-blue text-xs justify-center">
                  🔒 Confidential
                </Badge>
                <Badge variant="outline" className="border-legal-blue/30 text-legal-blue text-xs justify-center">
                  ⚡ Instant Analysis
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Encrypted & secure. Free analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Analysis Results - Full Width Below */}
        {analysisResults && (
          <div id="analysis-results" className="mt-8 scroll-mt-20">
            <Card className="border-2 border-legal-blue/30 shadow-lg">
              <CardHeader className="py-4 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Analysis Results</CardTitle>
                    <CardDescription className="mt-1 text-xs">
                      {analysisResults.user_role === 'lawyer' 
                        ? 'Technical analysis for legal professionals'
                        : 'Simplified breakdown of your case'}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      saveResults(null);
                      toast.info('Results cleared');
                    }}
                    className="h-8 w-8 p-0"
                    title="Clear results"
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="py-3 px-5">
                <CaseAnalysisResults data={analysisResults} />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recommended Next Steps - Full Width Below Results */}
        {analysisResults && (
          <div className="mt-8">
            <Card className="shadow-card-soft bg-legal-blue-light/20 border-legal-blue/20">
              <CardHeader className="py-4 px-5">
                <CardTitle className="text-lg text-legal-blue">Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent className="py-3 px-5">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-legal-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Gather Documents</p>
                      <p className="text-xs text-muted-foreground">Collect all relevant contracts, notices, and evidence</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-legal-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Consult a Specialist</p>
                      <p className="text-xs text-muted-foreground">Book consultation with recommended lawyers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-legal-blue text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Plan Strategy</p>
                      <p className="text-xs text-muted-foreground">Develop legal strategy with professional guidance</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
};

export default CaseInputForm;
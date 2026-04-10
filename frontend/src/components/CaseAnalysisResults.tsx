import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import apiClient from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { Info, Scale, Users, FileText, Target, Brain, AlertCircle, CheckCircle2 } from "lucide-react";
import { PrecedentsPanel } from "./PrecedentsPanel";

interface CaseAnalysisData {
  user_role: string;
  case_id?: number;
  confidence_score: number;
  
  // Customer fields
  case_category?: string;
  simplified_explanation?: string;
  applicable_rights?: string[];
  recommendations?: string[];
  matched_lawyers?: Array<{
    id: number;
    name: string;
    specialization: string[];
    experience_years?: number;
    location?: string;
    rating: number;
    hourly_rate?: number;
    match_score: number;
    match_reasons: string[];
  }>;
  
  // Lawyer fields
  case_classification?: {
    domain: string;
    sub_domain: string;
    confidence: number;
    keywords_identified: number;
    classification_method: string;
  };
  summary?: string;
  past_cases?: Array<{
    case_title: string;
    court: string;
    year: string;
    citation: string;
    outcome: string;
    summary: string;
    key_points?: string[];
    relevance_score: number;
  }>;
  opponent_points?: string[];
  case_strength?: number;
  
  // Common
  applicable_sections: Array<{
    section: string;
    title: string;
    description: string;
    act?: string;
    section_number?: string;
    penalty?: string;
  }>;
}

interface CaseAnalysisResultsProps {
  data: CaseAnalysisData;
}

const CaseAnalysisResults = ({ data }: CaseAnalysisResultsProps) => {
  const isLawyer = data.user_role === "lawyer";

  if (isLawyer) {
    return <LawyerResults data={data} />;
  } else {
    return <CustomerResults data={data} />;
  }
};

// Customer Results View (Simplified)
const CustomerResults = ({ data }: { data: CaseAnalysisData }) => {
  const { session } = useAuth();
  const [bookingLoadingId, setBookingLoadingId] = useState<number | null>(null);
  const [currentCaseId, setCurrentCaseId] = useState<number | undefined>(data.case_id);

  const handleBookLawyer = async (lawyerId: number) => {
    if (!session) {
      toast.error("Please sign in to book a lawyer.");
      return;
    }

    try {
      setBookingLoadingId(lawyerId);
      
      // If no case_id, we need to save the case first
      let caseId = currentCaseId || data.case_id;
      
      if (!caseId) {
        toast.info("Saving your case...");
        
        // Get the case description from localStorage (saved by CaseInputForm)
        const savedDescription = localStorage.getItem('lastCaseDescription');
        
        if (!savedDescription) {
          toast.error("Case description not found. Please submit your case again.");
          return;
        }

        // Re-analyze with authentication to save the case
        const analysisRequest = {
          description: savedDescription,
          category: data.case_category,
          user_role: "customer"
        };
        
        const result = await apiClient.analyzeCase(analysisRequest);
        
        if (result.case_id) {
          caseId = result.case_id;
          setCurrentCaseId(caseId);
          // Update localStorage with new case_id
          localStorage.setItem('caseAnalysisResults', JSON.stringify(result));
        } else {
          toast.error("Failed to save case. Please try again.");
          return;
        }
      }
      
      // Now create the booking
      await apiClient.createBooking(caseId, lawyerId, data.simplified_explanation?.slice(0, 200));
      toast.success("Booking request sent successfully!");
      
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create booking";
      toast.error(message);
    } finally {
      setBookingLoadingId(null);
    }
  };

  return (
    <div className="space-y-3 animate-fade-in max-w-7xl mx-auto">
      {/* Case Category */}
      <Card className="border-2 border-legal-blue/30 bg-gradient-to-br from-legal-blue-light/20 to-white w-full">
        <CardHeader className="py-3 px-5">
          <CardTitle className="flex items-center space-x-2 text-legal-blue text-xl">
            <Info className="h-5 w-5" />
            <span>Case Category</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2 px-5">
          <Badge variant="outline" className="text-lg px-6 py-2 border-legal-blue text-legal-blue">
            {data.case_category || "Legal Matter"}
          </Badge>
          <p className="mt-2 text-sm text-muted-foreground">
            Confidence: {data.confidence_score.toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      {/* Simplified Explanation */}
      {data.simplified_explanation && (
        <Card className="w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-legal-blue" />
              <span>Case Explanation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-base max-h-24 overflow-y-auto">
              {data.simplified_explanation}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Your Rights & Applicable Sections - Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-3">
        {/* Left Column: Your Rights */}
        {data.applicable_rights && data.applicable_rights.length > 0 && (
          <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 h-fit">
            <CardHeader className="py-3 px-5">
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400 text-lg">
                <CheckCircle2 className="h-5 w-5" />
                <span>Your Legal Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-5">
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {data.applicable_rights.map((right, index) => (
                  <li key={index} className="flex items-start space-x-2 p-2 bg-white dark:bg-background rounded">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm leading-snug">{right}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Right Column: Applicable Sections */}
        {data.applicable_sections && data.applicable_sections.length > 0 && (
          <Card className="h-fit">
            <CardHeader className="py-3 px-5">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Scale className="h-5 w-5 text-legal-blue" />
                <span>Applicable Laws</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-5">
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {data.applicable_sections.map((section, index) => (
                  <div key={index} className="p-2 border border-border rounded bg-muted/30 hover:bg-muted/50 transition">
                    <h4 className="font-semibold text-foreground text-sm mb-1">{section.title}</h4>
                    <p className="text-xs font-mono text-legal-blue">{section.section}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recommended Lawyers - Full Width */}
      {data.matched_lawyers && data.matched_lawyers.length > 0 && (
        <Card className="bg-legal-blue-light/20 border-legal-blue/30 w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-legal-blue text-lg">
              <Users className="h-5 w-5" />
              <span>Recommended Lawyers ({data.matched_lawyers.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-3 px-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.matched_lawyers.map((lawyer) => (
                <div key={lawyer.id} className="p-4 border-2 border-legal-blue/20 rounded-lg bg-white dark:bg-background hover:shadow-lg hover:border-legal-blue/40 transition">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{lawyer.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lawyer.experience_years ? `${lawyer.experience_years}y exp` : 'Experienced'}
                        {lawyer.location && <span> • {lawyer.location}</span>}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-legal-blue text-legal-blue font-bold text-xs px-2 py-0.5 flex-shrink-0">
                      {lawyer.match_score.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2 mb-2">
                    {lawyer.specialization.slice(0, 2).map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                  {lawyer.match_reasons && lawyer.match_reasons.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-1 font-semibold">Match reasons:</p>
                      <ul className="space-y-0.5">
                        {lawyer.match_reasons.slice(0, 1).map((reason, idx) => (
                          <li key={idx} className="text-xs text-foreground flex items-start space-x-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-legal-blue mt-0.5 flex-shrink-0" />
                            <span>{reason.substring(0, 40)}...</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {lawyer.hourly_rate && (
                    <p className="text-xs text-foreground mt-2 font-semibold">
                      ₹{lawyer.hourly_rate}/hr • ⭐ {lawyer.rating.toFixed(1)}
                    </p>
                  )}
                  <div className="mt-3 flex justify-center">
                    <Button
                      variant="hero"
                      className="w-full text-xs py-2"
                      onClick={() => handleBookLawyer(lawyer.id)}
                      disabled={bookingLoadingId === lawyer.id}
                    >
                      {bookingLoadingId === lawyer.id ? "Booking..." : "Book"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-2xl">
              <Target className="h-6 w-6 text-legal-blue" />
              <span>Recommended Next Steps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {data.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-legal-blue text-white flex items-center justify-center flex-shrink-0 text-lg font-bold">
                    {index + 1}
                  </div>
                  <span className="text-foreground text-base leading-relaxed pt-1">{rec}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Lawyer Results View (Detailed & Technical)
const LawyerResults = ({ data }: { data: CaseAnalysisData }) => {
  return (
    <div className="space-y-3 animate-fade-in max-w-7xl mx-auto">
      {/* Case Classification */}
      {data.case_classification && (
        <Card className="border-2 border-legal-blue/30 bg-gradient-to-br from-legal-blue-light/20 to-white w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-legal-blue text-lg">
              <Brain className="h-5 w-5" />
              <span>Case Classification</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <div className="grid md:grid-cols-4 gap-3">
              <div className="p-2.5 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Domain</p>
                <p className="text-sm font-bold text-foreground">{data.case_classification.domain}</p>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Sub-Domain</p>
                <p className="text-sm font-bold text-foreground">{data.case_classification.sub_domain}</p>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Confidence</p>
                <p className="text-sm font-bold text-legal-blue">{data.case_classification.confidence}%</p>
              </div>
              <div className="p-2.5 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Keywords</p>
                <p className="text-sm font-bold text-foreground">{data.case_classification.keywords_identified}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
              Method: <span className="font-semibold">{data.case_classification.classification_method.toUpperCase()}</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Technical Summary */}
      {data.summary && (
        <Card className="w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-legal-blue" />
              <span>Technical Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <p className="text-foreground leading-relaxed whitespace-pre-wrap text-sm">{data.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Two Column Layout: Applicable Sections & Opponent Points */}
      <div className="grid lg:grid-cols-2 gap-3">

        {/* Left Column: Applicable Sections (Detailed) */}
        {data.applicable_sections && data.applicable_sections.length > 0 && (
          <Card className="h-fit">
            <CardHeader className="py-3 px-5">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Scale className="h-5 w-5 text-legal-blue" />
                <span>Applicable Sections</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-5">
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {data.applicable_sections.map((section, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-foreground text-sm">{section.title}</h4>
                        <p className="text-xs font-mono text-legal-blue mt-0.5">{section.section}</p>
                      </div>
                    </div>
                    {section.act && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {section.act}
                        {section.section_number && ` • ${section.section_number}`}
                      </p>
                    )}
                    <p className="text-xs text-foreground mb-1 leading-snug line-clamp-2">{section.description}</p>
                    {section.penalty && (
                      <div className="mt-1.5 pt-1.5 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-0.5 font-semibold uppercase">Penalty:</p>
                        <p className="text-xs font-medium text-foreground">{section.penalty}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Right Column: Predicted Opponent Points */}
        {data.opponent_points && data.opponent_points.length > 0 && (
          <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 h-fit">
            <CardHeader className="py-3 px-5">
              <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-400 text-lg">
                <AlertCircle className="h-5 w-5" />
                <span>Opponent Arguments</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-5">
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {data.opponent_points.map((point, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-white dark:bg-background rounded-lg border border-orange-200 dark:border-orange-800">
                    <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-xs leading-snug">{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Past Cases / Precedents - Full Width */}
      {data.past_cases && data.past_cases.length > 0 && (
        <Card className="w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <FileText className="h-5 w-5 text-legal-blue" />
              <span>Precedents ({data.past_cases.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <div className="grid md:grid-cols-2 gap-2">
              {data.past_cases.map((case_item, index) => (
                <div key={index} className="p-3 border-2 border-border rounded-lg bg-muted/30 hover:border-legal-blue/40 transition">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-xs mb-1 line-clamp-1">{case_item.case_title}</h4>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold">{case_item.court}</span> • {case_item.year}
                      </p>
                      {case_item.citation && (
                        <p className="text-xs font-mono text-legal-blue mt-0.5">{case_item.citation}</p>
                      )}
                    </div>
                    <Badge variant={case_item.outcome.toLowerCase().includes('favorable') || 
                                   case_item.outcome.toLowerCase().includes('won') ? 
                                   'default' : 'secondary'}
                           className="text-xs px-2 py-0.5 flex-shrink-0">
                      {case_item.outcome}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground mb-1.5 leading-snug line-clamp-2">{case_item.summary}</p>
                  {case_item.key_points && case_item.key_points.length > 0 && (
                    <div className="mt-1.5 pt-1.5 border-t border-border">
                      <ul className="space-y-0.5 max-h-20 overflow-y-auto">
                        {case_item.key_points.map((point, idx) => (
                          <li key={idx} className="text-xs text-foreground flex items-start space-x-1">
                            <div className="h-1 w-1 rounded-full bg-legal-blue mt-1 flex-shrink-0" />
                            <span className="line-clamp-1">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {case_item.relevance_score && (
                    <p className="text-xs text-muted-foreground mt-1.5 pt-1.5 border-t">
                      Relevance: <span className="font-bold">{(case_item.relevance_score * 100).toFixed(0)}%</span>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Precedents Database Panel - Show ALL 26,285 cases */}
      <div className="w-full mt-6">
        <PrecedentsPanel searchQuery={data.case_category} />
      </div>

      {/* Case Strength Assessment */}
      {data.case_strength !== undefined && (
        <Card className="w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Target className="h-5 w-5 text-legal-blue" />
              <span>Case Strength</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">Overall Strength</span>
              <span className="text-2xl font-bold text-foreground">{data.case_strength.toFixed(0)}<span className="text-xs text-muted-foreground">/100</span></span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 mb-2">
              <div
                className={`h-3 rounded-full transition ${
                  data.case_strength >= 70 ? 'bg-green-600' :
                  data.case_strength >= 50 ? 'bg-yellow-600' : 'bg-orange-600'
                }`}
                style={{ width: `${data.case_strength}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-snug">
              {data.case_strength >= 70 ? '✅ Strong case' :
               data.case_strength >= 50 ? '⚠️ Moderate case' :
               '⚠️ Weak case'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Arguments */}
      {data.key_arguments && data.key_arguments.length > 0 && (
        <Card className="w-full">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Brain className="h-5 w-5 text-legal-blue" />
              <span>Key Arguments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <div className="grid md:grid-cols-2 gap-2">
              {data.key_arguments.map((arg, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-muted/30 rounded-lg border border-border">
                  <div className="h-6 w-6 rounded-full bg-legal-blue text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    {index + 1}
                  </div>
                  <span className="text-foreground text-xs leading-snug pt-0.5">{arg}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment */}
      {data.risk_assessment && data.risk_assessment.length > 0 && (
        <Card className="w-full bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
          <CardHeader className="py-3 px-5">
            <CardTitle className="flex items-center space-x-2 text-red-700 dark:text-red-400 text-lg">
              <AlertCircle className="h-5 w-5" />
              <span>Risk Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2 px-5">
            <div className="space-y-1.5">
              {data.risk_assessment.map((risk, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-white dark:bg-background rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-xs leading-snug">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confidence Score */}
      <Card className="bg-muted/30 w-full">
        <CardContent className="py-3 px-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Confidence Score</span>
            <span className="text-2xl font-bold text-legal-blue">{data.confidence_score.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseAnalysisResults;

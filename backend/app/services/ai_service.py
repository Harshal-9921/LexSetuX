import json
import os
from typing import List, Dict, Any, Optional
from pathlib import Path

# This is a simplified AI service that uses pattern matching and data lookup
# In production, you would integrate with actual ML models or APIs


class LegalAIService:
    """Service for analyzing legal cases using AI/ML techniques."""
    
    def __init__(self):
        from app.services.dataset_loader import dataset_loader
        self.dataset_loader = dataset_loader
        self.cases_db = self.dataset_loader.cases_db
        self.ipc_sections = self.dataset_loader.ipc_sections
        self.constitutional_rights = self.dataset_loader.constitutional_rights
    
    def analyze_case(
        self,
        description: str,
        category: Optional[str] = None,
        user_role: str = "customer"
    ) -> Dict[str, Any]:
        """
        Analyze a legal case with role-based output generation.
        Automatically classifies category if not provided.
        
        Customer: Simplified, understandable outputs
        Lawyer: Detailed, technical outputs
        """
        
        # Extract keywords from description
        keywords = self._extract_keywords(description.lower())
        
        # Auto-classify category if not provided
        if not category:
            category = self._classify_category(description, keywords)
        
        # Common processing (same for both roles)
        confidence_score = self._calculate_confidence(keywords, category)
        
        # Role-based output generation
        if user_role == "lawyer":
            return self._generate_lawyer_output(category, description, keywords, confidence_score)
        else:
            return self._generate_customer_output(category, description, keywords, confidence_score)
    
    def _classify_category(self, description: str, keywords: List[str]) -> str:
        """Automatically classify case category based on description and keywords."""
        description_lower = description.lower()
        
        # Category-specific keywords with weights
        category_keywords = {
            "property": {
                "keywords": ["landlord", "tenant", "rent", "deposit", "evict", "eviction", 
                           "property", "house", "apartment", "lease", "rental", "security deposit",
                           "building", "owner", "possession", "vacate"],
                "weight": 1.0
            },
            "family": {
                "keywords": ["divorce", "custody", "maintenance", "alimony", "marriage", "spouse",
                           "child", "children", "wife", "husband", "domestic", "violence",
                           "separation", "adoption", "guardian"],
                "weight": 1.0
            },
            "criminal": {
                "keywords": ["theft", "assault", "fraud", "cheating", "criminal", "arrest",
                           "police", "bail", "charge", "accused", "crime", "violation",
                           "penal", "offense", "court", "trial"],
                "weight": 1.2  # Higher weight for criminal keywords
            },
            "employment": {
                "keywords": ["termination", "terminated", "salary", "workplace", "harassment",
                           "employee", "employer", "job", "work", "office", "resignation",
                           "dismissal", "wages", "contract", "working hours"],
                "weight": 1.0
            },
            "consumer": {
                "keywords": ["product", "defective", "refund", "warranty", "consumer", "service",
                           "purchase", "buy", "seller", "shop", "delivery", "quality",
                           "complaint", "guarantee", "return"],
                "weight": 1.0
            },
            "civil": {
                "keywords": ["contract", "breach", "agreement", "damages", "compensation",
                           "dispute", "settlement", "debt", "loan", "payment", "court order"],
                "weight": 0.9
            },
            "corporate": {
                "keywords": ["company", "business", "partnership", "corporate", "board",
                           "shareholder", "merger", "acquisition", "compliance", "regulation"],
                "weight": 0.9
            }
        }
        
        # Score each category
        category_scores = {}
        for cat, config in category_keywords.items():
            score = 0
            for keyword in config["keywords"]:
                if keyword in description_lower:
                    score += config["weight"]
            category_scores[cat] = score
        
        # Also check keyword matches
        for keyword in keywords:
            for cat, config in category_keywords.items():
                if keyword in config["keywords"]:
                    category_scores[cat] = category_scores.get(cat, 0) + config["weight"] * 0.5
        
        # Find category with highest score
        if category_scores:
            best_category = max(category_scores, key=category_scores.get)
            if category_scores[best_category] > 0:
                return best_category
        
        # Default to "other" if no match found
        return "other"
    
    def _generate_customer_output(
        self,
        category: str,
        description: str,
        keywords: List[str],
        confidence_score: float
    ) -> Dict[str, Any]:
        """Generate simplified output for customers."""
        
        # 1. Case Category (simplified)
        case_category = self._get_category_name(category)
        
        # 2. Simplified Explanation (Plain English)
        simplified_explanation = self._generate_simplified_explanation(category, description, keywords)
        
        # 3. Basic Rights & Sections (High-level only)
        basic_rights = self._identify_basic_rights(category, keywords)
        basic_sections = self._find_basic_sections(category, keywords)
        
        # 4. Recommendations (Simple language)
        recommendations = self._generate_simple_recommendations(category, confidence_score)
        
        return {
            "case_category": case_category,
            "simplified_explanation": simplified_explanation,
            "applicable_rights": basic_rights,
            "applicable_sections": basic_sections,  # Basic/high-level only
            "confidence_score": confidence_score,
            "recommendations": recommendations,
            # Customer-specific: Lawyer recommendations will be added in router
            "user_role": "customer"
        }
    
    def _generate_lawyer_output(
        self,
        category: str,
        description: str,
        keywords: List[str],
        confidence_score: float
    ) -> Dict[str, Any]:
        """Generate detailed technical output for lawyers."""
        
        # 1. Detailed Case Classification
        case_classification = self._get_detailed_classification(category, keywords, confidence_score)
        
        # 2. Exact IPC/Act Sections (Technical & Precise)
        detailed_sections = self._find_detailed_sections(category, keywords)
        
        # 3. Relevant Past Judgments (Precedents)
        past_judgments = self._find_past_judgments(category, keywords)
        
        # 4. Predicted Opponent Arguments
        opponent_arguments = self._predict_opponent_arguments(keywords, category)
        
        # 5. Case Strength Assessment
        case_strength = self._assess_case_strength(detailed_sections, past_judgments)
        
        # 6. Technical Summary
        technical_summary = self._generate_technical_summary(category, description, case_classification)
        
        return {
            "case_classification": case_classification,
            "applicable_sections": detailed_sections,  # Detailed technical sections
            "past_cases": past_judgments,  # Precedents
            "opponent_points": opponent_arguments,  # Predicted arguments
            "case_strength": case_strength,
            "confidence_score": confidence_score,
            "summary": technical_summary,
            "user_role": "lawyer"
        }
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from case description."""
        # Common legal keywords
        legal_keywords = [
            "landlord", "tenant", "rent", "deposit", "eviction",
            "divorce", "custody", "maintenance", "alimony",
            "theft", "assault", "fraud", "cheating",
            "termination", "salary", "workplace", "harassment",
            "consumer", "product", "warranty", "refund",
            "contract", "breach", "agreement", "damages"
        ]
        
        found_keywords = [kw for kw in legal_keywords if kw in text]
        return found_keywords
    
    def _get_category_name(self, category: str) -> str:
        """Get human-readable category name."""
        category_map = {
            "property": "Property Law",
            "family": "Family Law",
            "criminal": "Criminal Law",
            "employment": "Employment Law",
            "consumer": "Consumer Rights",
            "civil": "Civil Disputes",
            "corporate": "Corporate Law",
            "other": "Other Legal Matter"
        }
        return category_map.get(category, "Legal Matter")
    
    def _generate_simplified_explanation(self, category: str, description: str, keywords: List[str]) -> str:
        """Generate plain English explanation for customers."""
        category_name = self._get_category_name(category)
        
        explanations = {
            "property": "This involves property rights, rental agreements, or real estate matters. " +
                        "Your landlord cannot evict you without proper notice or legal process. " +
                        "You have rights regarding security deposits, rent increases, and property maintenance.",
            "family": "This concerns family relationships, marriage, divorce, or custody matters. " +
                     "You have rights to maintenance, fair divorce proceedings, and child custody considerations. " +
                     "The law protects your interests in family disputes.",
            "criminal": "This involves criminal charges or legal violations. " +
                       "You have the right to a fair trial, legal representation, and protection against self-incrimination. " +
                       "It's important to seek legal counsel immediately.",
            "employment": "This relates to workplace issues, employment contracts, or termination. " +
                         "You have rights regarding fair treatment, payment, and workplace safety. " +
                         "Wrongful termination or discrimination may be actionable.",
            "consumer": "This involves consumer rights, product defects, or service issues. " +
                       "You have rights to refunds, warranties, and protection against unfair trade practices. " +
                       "Consumer protection laws safeguard your interests.",
        }
        
        base_explanation = explanations.get(category, 
            f"This is a {category_name} case. You have legal rights and protections in this matter. " +
            "It's advisable to consult with a specialized lawyer to understand your specific situation better.")
        
        # Add context from description
        if "evict" in keywords or "eviction" in keywords:
            base_explanation += " Your landlord must follow proper legal procedures for eviction."
        elif "deposit" in keywords or "security" in keywords:
            base_explanation += " Security deposits must be returned as per the rental agreement terms."
        elif "divorce" in keywords:
            base_explanation += " Divorce proceedings must follow legal procedures, including division of assets and custody matters."
        
        return base_explanation
    
    def _generate_technical_summary(self, category: str, description: str, classification: Dict) -> str:
        """Generate technical summary for lawyers."""
        return (f"Case classified under {classification['domain']} - {classification['sub_domain']}. "
                f"Confidence: {classification['confidence']}%. "
                f"Analysis based on: {description[:150]}...")
    
    def _find_basic_sections(self, category: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """Find basic/high-level legal sections for customers (simplified)."""
        basic_sections = {
            "property": [
                {"section": "Rent Control Act", "title": "Tenant Rights", "description": "Protects your rights as a tenant in rental agreements"},
                {"section": "Article 21", "title": "Right to Life and Shelter", "description": "Constitutional right to housing and shelter"}
            ],
            "family": [
                {"section": "Hindu Marriage Act", "title": "Marriage and Divorce Laws", "description": "Regulates marriage and divorce procedures"},
                {"section": "Article 21", "title": "Right to Family Life", "description": "Protection of family relationships"}
            ],
            "criminal": [
                {"section": "Right to Fair Trial", "title": "Constitutional Protection", "description": "You have the right to a fair legal process"},
                {"section": "Article 21", "title": "Right to Life and Liberty", "description": "Protection against arbitrary actions"}
            ],
            "employment": [
                {"section": "Industrial Disputes Act", "title": "Employment Rights", "description": "Protects workers' rights and fair treatment"},
                {"section": "Article 21", "title": "Right to Livelihood", "description": "Constitutional protection of employment rights"}
            ],
            "consumer": [
                {"section": "Consumer Protection Act", "title": "Consumer Rights", "description": "Protects your rights as a consumer"},
                {"section": "Right to Redress", "title": "Remedies", "description": "Right to compensation for defective products/services"}
            ]
        }
        return basic_sections.get(category, [
            {"section": "Relevant Legal Provisions", "title": "Applicable Laws", "description": "Various laws may apply to your case"}
        ])[:3]  # Top 3 basic sections
    
    def _find_detailed_sections(self, category: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """Find detailed technical sections for lawyers (exact IPC/Act sections)."""
        detailed_sections = {
            "property": [
                {
                    "section": "Rent Control Act, Section 15(2)",
                    "title": "Tenant Protection Against Illegal Eviction",
                    "description": "Prohibits eviction without proper notice and legal grounds",
                    "act": "Rent Control Act",
                    "section_number": "15(2)",
                    "penalty": "Civil remedy, compensation possible"
                },
                {
                    "section": "Transfer of Property Act, 1882, Section 105",
                    "title": "Lease Definition and Rights",
                    "description": "Defines lease agreement and lessee rights",
                    "act": "Transfer of Property Act, 1882",
                    "section_number": "105",
                    "penalty": "Contractual remedies"
                },
                {
                    "section": "Constitution of India, Article 21",
                    "title": "Right to Life and Personal Liberty",
                    "description": "Includes right to shelter and housing",
                    "act": "Constitution of India",
                    "section_number": "Article 21",
                    "penalty": "Constitutional remedy, writ petition"
                }
            ],
            "family": [
                {
                    "section": "Hindu Marriage Act, 1955, Section 13",
                    "title": "Grounds for Divorce",
                    "description": "Specifies conditions under which divorce can be granted",
                    "act": "Hindu Marriage Act, 1955",
                    "section_number": "13",
                    "penalty": "Judicial decree"
                },
                {
                    "section": "Hindu Marriage Act, 1955, Section 24",
                    "title": "Maintenance Pendent Lite",
                    "description": "Temporary maintenance during proceedings",
                    "act": "Hindu Marriage Act, 1955",
                    "section_number": "24",
                    "penalty": "Monetary order"
                },
                {
                    "section": "Guardians and Wards Act, 1890, Section 7",
                    "title": "Custody Determination",
                    "description": "Court's power to determine child custody",
                    "act": "Guardians and Wards Act, 1890",
                    "section_number": "7",
                    "penalty": "Custody order"
                }
            ],
            "criminal": [
                {
                    "section": "Indian Penal Code, Section 379",
                    "title": "Theft",
                    "description": "Punishment: Imprisonment up to 3 years, fine, or both",
                    "act": "Indian Penal Code, 1860",
                    "section_number": "379",
                    "penalty": "Imprisonment up to 3 years, fine, or both"
                },
                {
                    "section": "Indian Penal Code, Section 420",
                    "title": "Cheating and Dishonestly Inducing Delivery of Property",
                    "description": "Punishment: Imprisonment up to 7 years, fine",
                    "act": "Indian Penal Code, 1860",
                    "section_number": "420",
                    "penalty": "Imprisonment up to 7 years, fine"
                },
                {
                    "section": "Code of Criminal Procedure, Section 438",
                    "title": "Anticipatory Bail",
                    "description": "Provisions for bail in anticipation of arrest",
                    "act": "Code of Criminal Procedure, 1973",
                    "section_number": "438",
                    "penalty": "Bail conditions"
                }
            ],
            "employment": [
                {
                    "section": "Industrial Disputes Act, 1947, Section 25F",
                    "title": "Conditions Precedent to Retrenchment",
                    "description": "Proper notice and compensation required",
                    "act": "Industrial Disputes Act, 1947",
                    "section_number": "25F",
                    "penalty": "Reinstatement, compensation"
                },
                {
                    "section": "Payment of Wages Act, 1936, Section 5",
                    "title": "Time of Payment",
                    "description": "Regulates when wages must be paid",
                    "act": "Payment of Wages Act, 1936",
                    "section_number": "5",
                    "penalty": "Fine, interest on delayed payment"
                }
            ],
            "consumer": [
                {
                    "section": "Consumer Protection Act, 2019, Section 2(7)",
                    "title": "Defect Definition",
                    "description": "Definition of defective goods",
                    "act": "Consumer Protection Act, 2019",
                    "section_number": "2(7)",
                    "penalty": "Replacement, refund, compensation"
                },
                {
                    "section": "Consumer Protection Act, 2019, Section 35",
                    "title": "Reliefs Available",
                    "description": "Types of reliefs consumer can seek",
                    "act": "Consumer Protection Act, 2019",
                    "section_number": "35",
                    "penalty": "Various reliefs as per circumstances"
                }
            ]
        }
        
        sections = detailed_sections.get(category, [])
        
        # Try to load from dataset if available
        if self.ipc_sections:
            for section in self.ipc_sections[:10]:
                if isinstance(section, dict) and category in str(section).lower():
                    sections.append({
                        "section": section.get("section", "N/A"),
                        "title": section.get("title", "N/A"),
                        "description": section.get("description", ""),
                        "act": section.get("act", "Various"),
                        "section_number": section.get("section_number", ""),
                        "penalty": section.get("penalty", "")
                    })
        
        return sections[:7]  # Top 7 detailed sections for lawyers
    
    def _find_past_judgments(self, category: str, keywords: List[str]) -> List[Dict[str, Any]]:
        """Find relevant past judgments/precedents for lawyers."""
        judgments = []
        
        if self.cases_db:
            # Search through cases database
            for case in self.cases_db[:30]:  # Check more cases for lawyers
                if isinstance(case, dict):
                    case_text = str(case).lower()
                    if any(kw in case_text for kw in keywords):
                        judgments.append({
                            "case_title": case.get("title", "Unknown v. Unknown"),
                            "court": case.get("court", "High Court"),
                            "year": case.get("year", "2020"),
                            "citation": case.get("citation", ""),
                            "outcome": case.get("outcome", "N/A"),
                            "summary": case.get("summary", ""),
                            "key_points": case.get("key_points", []),
                            "relevance_score": case.get("relevance", 0.0)
                        })
                        if len(judgments) >= 7:
                            break
        
        # Add default precedents if none found
        if not judgments:
            default_judgments = {
                "property": [
                    {
                        "case_title": "Shri Ram v. State of Maharashtra",
                        "court": "Supreme Court",
                        "year": "2021",
                        "citation": "AIR 2021 SC 1234",
                        "outcome": "Favorable to tenant",
                        "summary": "Upheld tenant rights against illegal eviction without proper notice",
                        "key_points": ["Proper notice required", "Due process must be followed", "Constitutional protection"],
                        "relevance_score": 0.85
                    }
                ],
                "family": [
                    {
                        "case_title": "Ramesh v. Suresh",
                        "court": "Supreme Court",
                        "year": "2020",
                        "citation": "AIR 2020 SC 567",
                        "outcome": "Custody awarded based on child welfare",
                        "summary": "Child custody determined on best interest principle",
                        "key_points": ["Child welfare paramount", "Parent capability assessment", "Stable environment"],
                        "relevance_score": 0.80
                    }
                ],
                "criminal": [
                    {
                        "case_title": "State v. XYZ",
                        "court": "High Court",
                        "year": "2022",
                        "citation": "2022 CrLJ 890",
                        "outcome": "Acquittal",
                        "summary": "Insufficient evidence led to acquittal",
                        "key_points": ["Burden of proof on prosecution", "Evidence standards", "Fair trial rights"],
                        "relevance_score": 0.75
                    }
                ]
            }
            judgments = default_judgments.get(category, [])
        
        return judgments[:5]  # Top 5 precedents
    
    def _calculate_confidence(self, keywords: List[str], category: str) -> float:
        """Calculate confidence score (0-100) based on keyword matches and category clarity."""
        base_score = 50.0
        
        # Increase confidence based on keyword matches
        if keywords:
            base_score += min(len(keywords) * 5, 30)
        
        # Category-specific confidence boost
        category_confidence = {
            "property": 15,
            "family": 15,
            "criminal": 20,
            "employment": 10,
            "consumer": 10
        }
        base_score += category_confidence.get(category, 5)
        
        return min(base_score, 95.0)
    
    def _get_detailed_classification(self, category: str, keywords: List[str], confidence: float) -> Dict[str, Any]:
        """Get detailed case classification for lawyers."""
        sub_domains = {
            "property": ["Tenant Eviction", "Security Deposit", "Rent Disputes", "Property Damage", "Lease Violations"],
            "family": ["Divorce", "Child Custody", "Maintenance", "Property Division", "Domestic Violence"],
            "criminal": ["Theft", "Assault", "Fraud", "Cheating", "Criminal Breach of Trust"],
            "employment": ["Wrongful Termination", "Salary Disputes", "Workplace Harassment", "Contract Violations"],
            "consumer": ["Product Defects", "Service Issues", "Refund Claims", "False Advertising"]
        }
        
        # Determine sub-domain based on keywords
        sub_domain = sub_domains.get(category, ["General"])[0]
        for kw in keywords:
            for sd in sub_domains.get(category, []):
                if kw.lower() in sd.lower() or sd.lower() in kw.lower():
                    sub_domain = sd
                    break
        
        return {
            "domain": self._get_category_name(category).upper(),
            "sub_domain": sub_domain,
            "confidence": round(confidence, 1),
            "keywords_identified": len(keywords),
            "classification_method": "NLP + Rule-based"
        }
    
    def _identify_basic_rights(self, category: str, keywords: List[str]) -> List[str]:
        """Identify basic legal rights in simple language for customers."""
        rights_map = {
            "property": [
                "You have the right to stay in your rented property as long as the lease is valid",
                "Your landlord cannot evict you without proper legal notice",
                "You have the right to get your security deposit back when you vacate",
                "You have the right to a safe and habitable living space"
            ],
            "family": [
                "You have the right to maintenance if you're financially dependent",
                "You have the right to custody of your children based on their best interests",
                "You have the right to a fair divorce settlement including property division",
                "You have the right to protection from domestic violence"
            ],
            "criminal": [
                "You have the right to a fair trial",
                "You have the right to remain silent and not incriminate yourself",
                "You have the right to legal representation",
                "You have the right to be presumed innocent until proven guilty"
            ],
            "employment": [
                "You have the right to fair treatment at the workplace",
                "You cannot be terminated without proper notice and reason",
                "You have the right to receive your full salary on time",
                "You have the right to a safe work environment free from harassment"
            ],
            "consumer": [
                "You have the right to get what you paid for",
                "You have the right to refund or replacement for defective products",
                "You have the right to complain about poor service",
                "You have the right to compensation for damages caused by products"
            ]
        }
        
        return rights_map.get(category, [
            "You have the right to legal recourse",
            "You have the right to seek justice through proper legal channels"
        ])[:4]  # Top 4 rights
    
    def _generate_simple_recommendations(self, category: str, confidence: float) -> List[str]:
        """Generate simple recommendations in plain language for customers."""
        recommendations = [
            "Gather all documents related to your case (contracts, letters, receipts, etc.)",
            "Keep records of all conversations and communications",
            "Contact a lawyer who specializes in this area of law"
        ]
        
        if category == "criminal":
            recommendations.insert(0, "Seek legal help immediately - this is important")
        elif category == "property":
            recommendations.append("Document everything related to your property - photos, videos, written communications")
        elif category == "family":
            recommendations.append("Consider mediation or counseling as an alternative to court proceedings")
        
        if confidence < 60:
            recommendations.append("Provide more details about your situation for better guidance")
        
        return recommendations[:5]
    
    def _predict_opponent_arguments(self, keywords: List[str], category: str) -> List[str]:
        """Predict potential opponent arguments (for lawyers - detailed)."""
        arguments = []
        
        # Property-related arguments
        if any(kw in keywords for kw in ["deposit", "rent", "evict", "landlord", "tenant"]):
            arguments.extend([
                "Opponent may claim property damage requiring deposit forfeiture",
                "Opponent may allege unpaid rent or late payments",
                "Opponent may argue breach of rental agreement terms",
                "Opponent may claim proper notice was served",
                "Opponent may assert legitimate business reasons for eviction"
            ])
        
        # Employment-related arguments
        if any(kw in keywords for kw in ["termination", "employment", "salary", "workplace"]):
            arguments.extend([
                "Opponent may cite performance issues or misconduct",
                "Opponent may claim policy violations as grounds for termination",
                "Opponent may argue business restructuring or redundancy",
                "Opponent may assert termination was justified under contract",
                "Opponent may claim proper procedures were followed"
            ])
        
        # Family-related arguments
        if any(kw in keywords for kw in ["divorce", "custody", "maintenance", "alimony"]):
            arguments.extend([
                "Opponent may challenge custody claims citing capability issues",
                "Opponent may dispute maintenance calculations",
                "Opponent may claim infidelity or misconduct as grounds",
                "Opponent may argue against property division claims",
                "Opponent may challenge child's best interest determination"
            ])
        
        # Criminal-related arguments
        if category == "criminal":
            arguments.extend([
                "Prosecution may argue intent and premeditation",
                "Prosecution may present witness testimony",
                "Prosecution may cite physical evidence",
                "Prosecution may challenge alibi or defense claims",
                "Prosecution may argue aggravating circumstances"
            ])
        
        # Consumer-related arguments
        if category == "consumer":
            arguments.extend([
                "Opponent may claim product was misused",
                "Opponent may argue warranty expired",
                "Opponent may dispute defect allegations",
                "Opponent may claim service was provided as per terms",
                "Opponent may argue consumer negligence"
            ])
        
        return arguments[:7] if arguments else [
            "Opponent will likely challenge the factual basis of your claims",
            "Opponent may raise jurisdictional or procedural objections",
            "Opponent may argue statute of limitations if applicable"
        ]
    
    def _assess_case_strength(self, sections: List[Dict], judgments: List[Dict]) -> float:
        """Assess case strength on a scale of 0-100 (for lawyers)."""
        strength = 45.0
        
        # Strength based on applicable sections
        if sections:
            strength += min(len(sections) * 4, 20)
        
        # Strength based on favorable precedents
        if judgments:
            favorable_count = sum(1 for j in judgments if "favorable" in str(j.get("outcome", "")).lower() or 
                                  j.get("outcome", "").lower() in ["won", "allowed", "granted"])
            strength += min(favorable_count * 5, 25)
        
        # Additional factors
        if len(sections) >= 5:
            strength += 5  # Strong legal foundation
        if len(judgments) >= 3:
            strength += 5  # Good precedent support
        
        return min(round(strength, 1), 95.0)


# Singleton instance
ai_service = LegalAIService()

# Role-Based Output Generation

## Overview

The AI case analysis system generates **different outputs** for **Customers** vs **Lawyers** based on their role. This ensures:
- **Customers** get simplified, understandable information
- **Lawyers** get detailed, technical information

## Implementation

### Common AI Process (Both Roles)

Before outputs are separated, the system performs:
1. NLP preprocessing (clean text, extract keywords)
2. Case classification (determine legal domain)
3. Domain prediction (category + sub-domain)
4. Rights & IPC section mapping
5. Precedent similarity search (for lawyers)
6. Lawyer matching (for customers)

---

## 🟢 CUSTOMER OUTPUT (Simple & Understandable)

### Goal
Help non-legal users understand their problem, rights, and next steps.

### Customer Receives:

#### 1. Case Category
- Simple category name: "Property Law", "Family Law", "Criminal Law", etc.
- Example: `"Your case falls under Property Law."`

#### 2. Simplified Explanation (Plain English)
- AI converts legal terms into easy language
- No legal jargon
- Example: `"Your landlord cannot evict you without proper notice or legal process."`

#### 3. Applicable Rights & Sections
- **Only high-level laws** are shown
- Simple descriptions
- Example:
  - "Rent Control Act - Protects your rights as a tenant"
  - "Article 21 - Right to Life and Shelter"

#### 4. Suggested Lawyers
- Top lawyers based on:
  - Specialization match
  - Experience
  - Location
  - Similarity score

### Customer View Summary
✅ Case Type (simple)  
✅ Rights Explanation (plain language)  
✅ Basic Legal Sections  
✅ Lawyer Recommendations  
❌ No legal jargon  
❌ No deep case law  
❌ No technical sections  

---

## 🔵 LAWYER OUTPUT (Detailed & Technical)

### Goal
Help lawyers prepare cases faster and stronger with technical precision.

### Lawyer Receives:

#### 1. Detailed Case Classification
- Primary domain (e.g., "PROPERTY_LAW")
- Sub-domain (e.g., "Tenant Eviction")
- Confidence score (0-100%)
- Keywords identified
- Classification method

#### 2. Exact IPC / Act Sections
- **Technical and precise** sections
- Includes:
  - Full Act name
  - Exact section number
  - Penalty/Remedy details
- Example:
  - "Rent Control Act, Section 15(2) - Prohibits eviction without proper notice"
  - "Penalty: Civil remedy, compensation possible"

#### 3. Relevant Past Judgments (Precedents)
- From Supreme Court and High Courts
- Includes:
  - Case title
  - Court name
  - Citation (e.g., "AIR 2021 SC 1234")
  - Year
  - Outcome
  - Key points
  - Relevance score

#### 4. Predicted Opponent Arguments (AI Insight)
- Advanced & unique feature
- Predicts what opponent may argue
- Example:
  - "Opponent may claim property damage requiring deposit forfeiture"
  - "Opponent may allege unpaid rent or late payments"

#### 5. Case Strength Assessment
- Score from 0-100
- Based on:
  - Applicable sections
  - Favorable precedents
  - Legal foundation strength

### Lawyer View Summary
✅ Detailed Classification  
✅ Exact Legal Sections (with act, section number, penalty)  
✅ Past Judgments with Citations  
✅ Predicted Opponent Arguments  
✅ Case Strength Score  
✅ Technical Depth  
❌ No simplification  
❌ No basic language  

---

## 📊 Side-by-Side Comparison

| Feature | Customer | Lawyer |
|---------|----------|--------|
| **Case Category** | ✅ Simple name | ✅ Technical classification |
| **Simplified Explanation** | ✅ Plain English | ❌ |
| **IPC / Legal Sections** | ✅ Basic/High-level | ✅ Detailed (exact sections) |
| **Lawyer Recommendations** | ✅ Top matches | ❌ |
| **Past Judgments** | ❌ | ✅ With citations |
| **Opponent Arguments** | ❌ | ✅ Predicted points |
| **Case Strength** | ❌ | ✅ 0-100 score |
| **Technical Depth** | ❌ | ✅ Full details |

---

## API Usage

### For Customers
```json
POST /api/cases/analyze
{
  "category": "property",
  "description": "My landlord is trying to evict me...",
  "user_role": "customer"
}
```

**Response:**
- `case_category`: "Property Law"
- `simplified_explanation`: Plain English explanation
- `applicable_rights`: Simple rights list
- `applicable_sections`: Basic sections
- `matched_lawyers`: Recommended lawyers
- `recommendations`: Simple next steps

### For Lawyers
```json
POST /api/cases/analyze
{
  "category": "property",
  "description": "Tenant eviction case...",
  "user_role": "lawyer"
}
```

**Response:**
- `case_classification`: {domain, sub_domain, confidence}
- `applicable_sections`: Detailed sections with act, section_number, penalty
- `past_cases`: Precedents with citations
- `opponent_points`: Predicted arguments
- `case_strength`: 0-100 score
- `summary`: Technical summary

---

## Code Structure

### AI Service (`app/services/ai_service.py`)
- `analyze_case()` - Main entry point (routes by role)
- `_generate_customer_output()` - Customer-specific generation
- `_generate_lawyer_output()` - Lawyer-specific generation
- `_generate_simplified_explanation()` - Plain English for customers
- `_find_basic_sections()` - High-level sections for customers
- `_find_detailed_sections()` - Technical sections for lawyers
- `_find_past_judgments()` - Precedents for lawyers
- `_predict_opponent_arguments()` - AI insights for lawyers

### Router (`app/routers/case_analysis.py`)
- Builds appropriate response based on `user_role`
- Adds lawyer recommendations only for customers
- Formats output according to role

---

## Notes

- The same AI pipeline processes both cases, but outputs are formatted differently
- Customer outputs focus on understanding and action
- Lawyer outputs focus on case preparation and strategy
- All outputs include confidence scores for transparency

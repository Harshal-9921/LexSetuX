from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "customer"


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    email: Optional[str] = None


# Case Schemas
class CaseCreate(BaseModel):
    category: str
    description: str
    documents: Optional[List[str]] = None


class CaseAnalysisResult(BaseModel):
    summary: str
    applicable_sections: List[Dict[str, Any]]
    confidence_score: float
    relevant_cases: Optional[List[Dict[str, Any]]] = None
    legal_rights: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None
    # Lawyer-specific fields
    past_cases: Optional[List[Dict[str, Any]]] = None
    opponent_points: Optional[List[str]] = None
    case_strength: Optional[float] = None


class CaseResponse(BaseModel):
    id: int
    user_id: int
    category: str
    description: str
    summary: Optional[str] = None
    applicable_sections: Optional[List[Dict[str, Any]]] = None
    confidence_score: Optional[float] = None
    analysis_result: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# Lawyer Schemas
class LawyerBase(BaseModel):
    specialization: List[str]
    experience_years: Optional[int] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    hourly_rate: Optional[float] = None


class LawyerCreate(LawyerBase):
    user_id: int


class LawyerResponse(LawyerBase):
    id: int
    user_id: int
    rating: float
    is_available: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class LawyerMatchResponse(BaseModel):
    lawyer: LawyerResponse
    match_score: float
    match_reasons: List[str]


# Analysis Request/Response
class CaseAnalysisRequest(BaseModel):
    description: str
    category: Optional[str] = None  # Optional - will be auto-classified by AI if not provided
    userId: Optional[str] = None
    documents: Optional[List[str]] = None
    user_role: Optional[str] = "customer"


# Customer Response Schema (Simplified)
class CustomerCaseAnalysisResponse(BaseModel):
    case_id: Optional[int] = None
    case_category: str  # "Property Law" / "Family Law" etc.
    simplified_explanation: str  # Plain English explanation
    applicable_rights: List[str]  # Basic rights in simple language
    applicable_sections: List[Dict[str, Any]]  # Basic/high-level sections only
    confidence_score: float
    recommendations: List[str]  # Simple recommendations
    matched_lawyers: Optional[List[Dict[str, Any]]] = None
    user_role: str = "customer"


# Lawyer Response Schema (Detailed)
class LawyerCaseAnalysisResponse(BaseModel):
    case_id: Optional[int] = None
    case_classification: Dict[str, Any]  # {domain, sub_domain, confidence, etc.}
    summary: str  # Technical summary
    applicable_sections: List[Dict[str, Any]]  # Detailed technical sections with act, section_number, penalty
    past_cases: List[Dict[str, Any]]  # Precedents with citations
    opponent_points: List[str]  # Predicted opponent arguments
    case_strength: float  # 0-100 score
    confidence_score: float
    user_role: str = "lawyer"


# Unified Response (handles both roles)
class CaseAnalysisResponse(BaseModel):
    case_id: Optional[int] = None
    user_role: str = "customer"
    confidence_score: float
    
    # Common fields
    case_category: Optional[str] = None  # For customer
    case_classification: Optional[Dict[str, Any]] = None  # For lawyer
    
    # Customer-specific fields
    simplified_explanation: Optional[str] = None
    applicable_rights: Optional[List[str]] = None
    recommendations: Optional[List[str]] = None
    matched_lawyers: Optional[List[Dict[str, Any]]] = None
    
    # Lawyer-specific fields
    summary: Optional[str] = None  # Technical summary
    past_cases: Optional[List[Dict[str, Any]]] = None
    opponent_points: Optional[List[str]] = None
    case_strength: Optional[float] = None
    
    # Sections (different detail level based on role)
    applicable_sections: List[Dict[str, Any]] = []


# Booking Schemas
class BookingCreate(BaseModel):
    case_id: int
    lawyer_id: int


class BookingUpdate(BaseModel):
    status: Optional[str] = None  # accepted, rejected, cancelled, etc.
    scheduled_date: Optional[datetime] = None
    lawyer_notes: Optional[str] = None


class BookingResponse(BaseModel):
    id: int
    case_id: int
    lawyer_id: int
    customer_id: int
    status: str
    booking_date: datetime
    scheduled_date: Optional[datetime] = None
    lawyer_notes: Optional[str] = None
    customer_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BookingDetailResponse(BookingResponse):
    """Detailed booking response with related case and lawyer info"""
    case: Optional[Dict[str, Any]] = None
    lawyer: Optional[Dict[str, Any]] = None
    customer: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True

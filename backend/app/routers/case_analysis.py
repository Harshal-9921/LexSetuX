from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.database import get_db, Case, User
from app.models.schemas import (
    CaseCreate,
    CaseAnalysisRequest,
    CaseAnalysisResponse,
    CaseResponse
)
from app.services.ai_service_factory import get_ai_service, get_ai_service_info
from app.services.lawyer_service import lawyer_service
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter()

# Get the configured AI service (rule-based or BERT)
ai_service = None

def get_service():
    global ai_service
    if ai_service is None:
        ai_service = get_ai_service()
    return ai_service


@router.get("/ai-info")
async def get_ai_info():
    """Get information about the active AI service."""
    return get_ai_service_info()


@router.post("/analyze", response_model=CaseAnalysisResponse)
async def analyze_case(
    request: CaseAnalysisRequest,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """
    Analyze a legal case using AI.
    Can work with or without authentication.
    Uses configured AI model (rule-based or LegalBERT).
    """
    try:
        # Get the service
        service = get_service()
        
        # Perform AI analysis (category is auto-detected if not provided)
        user_role = request.user_role or "customer"
        analysis_result = service.analyze_case(
            description=request.description,
            category=request.category,  # Optional - will be auto-classified if not provided
            user_role=user_role
        )
        
        # Get classified category from analysis result (AI auto-classified it)
        # The category was already determined by AI in analyze_case()
        # Try to extract from case_category or case_classification in result
        detected_category = request.category  # Use provided if available
        if not detected_category:
            # Extract from case_category field (customer view) - e.g. "Property Law" -> "property"
            cat_name = analysis_result.get("case_category", "")
            if cat_name:
                detected_category = cat_name.lower().replace(" law", "").replace(" ", "")
            # Or from case_classification domain (lawyer view) - e.g. "PROPERTY_LAW" -> "property"
            elif analysis_result.get("case_classification"):
                domain = analysis_result.get("case_classification", {}).get("domain", "").lower()
                detected_category = domain.replace("_law", "").replace("_", "")
            else:
                detected_category = "other"
        
        # Find matching lawyers (only for customers)
        matched_lawyers = None
        if user_role == "customer":
            matched_lawyers = await lawyer_service.find_matching_lawyers(
                db=db,
                category=detected_category,
                description=request.description,
                limit=5
            )
        
        # Save case to database if user is authenticated
        case_id = None
        if current_user:
            new_case = Case(
                user_id=current_user.id,
                category=detected_category,
                description=request.description,
                summary=analysis_result.get("summary"),
                applicable_sections=analysis_result.get("applicable_sections"),
                confidence_score=analysis_result.get("confidence_score"),
                analysis_result=analysis_result,
                document_paths=request.documents,
                status="analyzed"
            )
            db.add(new_case)
            await db.commit()
            await db.refresh(new_case)
            case_id = new_case.id
        
        # Build role-based response
        if user_role == "lawyer":
            # Lawyer response - detailed technical output
            response = CaseAnalysisResponse(
                case_id=case_id,
                user_role=user_role,
                confidence_score=analysis_result.get("confidence_score", 0.0),
                case_classification=analysis_result.get("case_classification"),
                summary=analysis_result.get("summary", ""),
                applicable_sections=analysis_result.get("applicable_sections", []),
                past_cases=analysis_result.get("past_cases", []),
                opponent_points=analysis_result.get("opponent_points", []),
                case_strength=analysis_result.get("case_strength", 0.0)
            )
        else:
            # Customer response - simplified output
            response = CaseAnalysisResponse(
                case_id=case_id,
                user_role="customer",
                confidence_score=analysis_result.get("confidence_score", 0.0),
                case_category=analysis_result.get("case_category", ""),
                simplified_explanation=analysis_result.get("simplified_explanation", ""),
                applicable_rights=analysis_result.get("applicable_rights", []),
                applicable_sections=analysis_result.get("applicable_sections", []),
                recommendations=analysis_result.get("recommendations", []),
                matched_lawyers=matched_lawyers
            )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error analyzing case: {str(e)}"
        )


@router.get("/my-cases", response_model=list[CaseResponse])
async def get_my_cases(
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get all cases for the current user. Requires authentication."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    """Get all cases for the current user."""
    from sqlalchemy import select
    
    result = await db.execute(
        select(Case).where(Case.user_id == current_user.id).order_by(Case.created_at.desc())
    )
    cases = result.scalars().all()
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(
    case_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    """Get a specific case by ID. Requires authentication."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    """Get a specific case by ID."""
    from sqlalchemy import select
    
    result = await db.execute(select(Case).where(Case.id == case_id))
    case = result.scalar_one_or_none()
    
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found"
        )
    
    # Check if user owns the case
    if case.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this case"
        )
    
    return case

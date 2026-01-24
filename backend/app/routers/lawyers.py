from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional
from sqlalchemy import select
from app.database import get_db, Lawyer, User
from app.models.schemas import LawyerCreate, LawyerResponse, LawyerMatchResponse
from app.services.lawyer_service import lawyer_service
from app.routers.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=LawyerResponse, status_code=status.HTTP_201_CREATED)
async def create_lawyer_profile(
    lawyer_data: LawyerCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create or update a lawyer profile."""
    # Check if user has lawyer role
    if current_user.role != "lawyer" and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only lawyers can create lawyer profiles"
        )
    
    # Check if lawyer profile already exists
    result = await db.execute(
        select(Lawyer).where(Lawyer.user_id == current_user.id)
    )
    existing_lawyer = result.scalar_one_or_none()
    
    if existing_lawyer:
        # Update existing profile
        for key, value in lawyer_data.model_dump(exclude_unset=True).items():
            setattr(existing_lawyer, key, value)
        await db.commit()
        await db.refresh(existing_lawyer)
        return existing_lawyer
    else:
        # Create new profile
        new_lawyer = Lawyer(
            user_id=current_user.id,
            **lawyer_data.model_dump()
        )
        db.add(new_lawyer)
        await db.commit()
        await db.refresh(new_lawyer)
        return new_lawyer


@router.get("/", response_model=List[LawyerResponse])
async def list_lawyers(
    category: Optional[str] = None,
    location: Optional[str] = None,
    available_only: bool = True,
    db: AsyncSession = Depends(get_db)
):
    """List all lawyers with optional filters."""
    query = select(Lawyer)
    
    if available_only:
        query = query.where(Lawyer.is_available == True)
    
    if category:
        query = query.where(Lawyer.specialization.contains([category]))
    
    if location:
        query = query.where(Lawyer.location.ilike(f"%{location}%"))
    
    result = await db.execute(query)
    lawyers = result.scalars().all()
    return lawyers


@router.get("/match", response_model=List[LawyerMatchResponse])
async def match_lawyers(
    category: str,
    description: str,
    location: Optional[str] = None,
    limit: int = 5,
    db: AsyncSession = Depends(get_db)
):
    """Find matching lawyers for a case."""
    matches = await lawyer_service.find_matching_lawyers(
        db=db,
        category=category,
        description=description,
        location=location,
        limit=limit
    )
    
    # Convert to response format
    result = []
    for match in matches:
        # Get lawyer from database
        lawyer_result = await db.execute(
            select(Lawyer).where(Lawyer.id == match["id"])
        )
        lawyer = lawyer_result.scalar_one_or_none()
        
        if lawyer:
            result.append(LawyerMatchResponse(
                lawyer=LawyerResponse.model_validate(lawyer),
                match_score=match["match_score"],
                match_reasons=match["match_reasons"]
            ))
    
    return result


@router.get("/{lawyer_id}", response_model=LawyerResponse)
async def get_lawyer(
    lawyer_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific lawyer by ID."""
    result = await db.execute(select(Lawyer).where(Lawyer.id == lawyer_id))
    lawyer = result.scalar_one_or_none()
    
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer not found"
        )
    
    return lawyer


@router.get("/me/profile", response_model=LawyerResponse)
async def get_my_lawyer_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's lawyer profile."""
    result = await db.execute(
        select(Lawyer).where(Lawyer.user_id == current_user.id)
    )
    lawyer = result.scalar_one_or_none()
    
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer profile not found. Create one first."
        )
    
    return lawyer

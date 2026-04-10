from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.database import get_db, Booking, Case, Lawyer, User
from app.models.schemas import BookingCreate, BookingUpdate, BookingResponse, BookingDetailResponse
from app.routers.auth import get_current_user

router = APIRouter(prefix="/api/bookings", tags=["bookings"])


def _to_booking_response(booking: Booking) -> BookingResponse:
    return BookingResponse(
        id=booking.id,
        case_id=booking.case_id,
        lawyer_id=booking.lawyer_id,
        customer_id=booking.customer_id,
        status=booking.status,
        message=booking.message,
        booking_notes=booking.booking_notes,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
    )


def _to_booking_detail_response(
    booking: Booking,
    customer_name: str,
    lawyer_name: str,
    case: Case,
) -> BookingDetailResponse:
    case_description = case.description
    if case_description and len(case_description) > 100:
        case_description = f"{case_description[:100]}..."

    return BookingDetailResponse(
        id=booking.id,
        case_id=booking.case_id,
        lawyer_id=booking.lawyer_id,
        customer_id=booking.customer_id,
        status=booking.status,
        message=booking.message,
        booking_notes=booking.booking_notes,
        created_at=booking.created_at,
        updated_at=booking.updated_at,
        customer_name=customer_name,
        lawyer_name=lawyer_name,
        case_category=case.category,
        case_description=case_description,
    )


@router.post("", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
async def create_booking(
    booking: BookingCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a booking request (Customer books a lawyer for a case)"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Verify the case exists and belongs to the current user
    result = await db.execute(
        select(Case).where(Case.id == booking.case_id)
    )
    case = result.scalar_one_or_none()
    
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case not found"
        )
    
    if case.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to create booking for this case"
        )
    
    # Verify the lawyer exists
    result = await db.execute(
        select(Lawyer).where(Lawyer.id == booking.lawyer_id)
    )
    lawyer = result.scalar_one_or_none()
    
    if not lawyer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lawyer not found"
        )
    
    # Check if booking already exists
    result = await db.execute(
        select(Booking).where(
            (Booking.case_id == booking.case_id) & 
            (Booking.lawyer_id == booking.lawyer_id) &
            (Booking.status.in_(["pending", "accepted"]))
        )
    )
    existing_booking = result.scalar_one_or_none()
    
    if existing_booking:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A booking already exists for this lawyer and case"
        )
    
    # Create booking
    new_booking = Booking(
        case_id=booking.case_id,
        lawyer_id=booking.lawyer_id,
        customer_id=current_user.id,
        message=booking.message,
        status="pending"
    )
    
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    
    return _to_booking_response(new_booking)


@router.get("/my-bookings", response_model=List[BookingDetailResponse])
async def get_my_bookings(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    status_filter: Optional[str] = Query(default=None, alias="status")
):
    """Get bookings for the current user (as customer or lawyer)"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    if current_user.role == "lawyer":
        # Lawyer portal view: show booking queue for lawyer users.
        result = await db.execute(
            select(Booking, User, Case, Lawyer).join(
                User, Booking.customer_id == User.id
            ).join(
                Case, Booking.case_id == Case.id
            ).join(
                Lawyer, Booking.lawyer_id == Lawyer.id
            )
        )
    else:
        # Get bookings where this user is the customer
        result = await db.execute(
            select(Booking, User, Case, Lawyer).join(
                User, Booking.customer_id == User.id
            ).join(
                Case, Booking.case_id == Case.id
            ).join(
                Lawyer, Booking.lawyer_id == Lawyer.id
            ).where(Booking.customer_id == current_user.id)
        )
    
    rows = result.all()
    
    bookings = []
    for booking, customer_user, case, lawyer in rows:
        if status_filter and booking.status != status_filter:
            continue
            
        # Get lawyer user name
        lawyer_user_result = await db.execute(
            select(User).where(User.id == lawyer.user_id)
        )
        lawyer_user = lawyer_user_result.scalar_one_or_none()
        
        booking_detail = _to_booking_detail_response(
            booking=booking,
            customer_name=customer_user.full_name,
            lawyer_name=lawyer_user.full_name if lawyer_user else "Unknown",
            case=case,
        )
        bookings.append(booking_detail)
    
    return bookings


@router.get("/{booking_id}", response_model=BookingDetailResponse)
async def get_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get booking details"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify authorization
    lawyer_result = await db.execute(
        select(Lawyer).where(Lawyer.id == booking.lawyer_id)
    )
    lawyer = lawyer_result.scalar_one_or_none()
    
    is_authorized = (
        booking.customer_id == current_user.id or
        current_user.role == "lawyer" or
        (lawyer and lawyer.user_id == current_user.id) or
        current_user.role == "admin"
    )
    
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this booking"
        )
    
    # Get related data
    customer_result = await db.execute(
        select(User).where(User.id == booking.customer_id)
    )
    customer_user = customer_result.scalar_one_or_none()
    
    lawyer_user_result = await db.execute(
        select(User).where(User.id == lawyer.user_id)
    )
    lawyer_user = lawyer_user_result.scalar_one_or_none()
    
    case_result = await db.execute(
        select(Case).where(Case.id == booking.case_id)
    )
    case = case_result.scalar_one_or_none()
    
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated case not found"
        )

    return _to_booking_detail_response(
        booking=booking,
        customer_name=customer_user.full_name if customer_user else "Unknown",
        lawyer_name=lawyer_user.full_name if lawyer_user else "Unknown",
        case=case,
    )


@router.put("/{booking_id}", response_model=BookingResponse)
async def update_booking_status(
    booking_id: int,
    update: BookingUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update booking status (Accept, Reject, Cancel) - Only lawyer or admin can update"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify only the lawyer or admin can update
    lawyer_result = await db.execute(
        select(Lawyer).where(Lawyer.id == booking.lawyer_id)
    )
    lawyer = lawyer_result.scalar_one_or_none()
    
    is_authorized = current_user.role in ["lawyer", "admin"]
    
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the lawyer can update this booking"
        )
    
    # Validate status transitions
    valid_statuses = ["accepted", "rejected", "cancelled"]
    if update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status must be one of: {', '.join(valid_statuses)}"
        )
    
    # Update booking
    booking.status = update.status
    booking.booking_notes = update.booking_notes
    
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    
    return _to_booking_response(booking)


@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_booking(
    booking_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a booking (Only customer who created it or admin can delete)"""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    result = await db.execute(
        select(Booking).where(Booking.id == booking_id)
    )
    booking = result.scalar_one_or_none()
    
    if not booking:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found"
        )
    
    # Verify authorization
    is_authorized = (
        booking.customer_id == current_user.id or
        current_user.role == "admin"
    )
    
    if not is_authorized:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this booking"
        )
    
    # Only allow deletion if status is pending
    if booking.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete booking with status '{booking.status}'"
        )
    
    await db.delete(booking)
    await db.commit()
    
    return None

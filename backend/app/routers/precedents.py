from fastapi import APIRouter, Depends, Query, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func, desc
from typing import List, Optional
import json
from datetime import datetime
from app.database import get_db, Precedent
from pydantic import BaseModel
import os
from pathlib import Path

router = APIRouter(prefix="/api/precedents", tags=["precedents"])


# Response schemas
class PrecedentResponse(BaseModel):
    id: int
    case_name: str
    year: int
    parties: Optional[str] = None
    court: Optional[str] = None
    summary: str
    pdf_file: Optional[str] = None
    keywords: Optional[List[str]] = None
    sections: Optional[List[str]] = None
    citation: Optional[str] = None
    
    class Config:
        from_attributes = True
    
    @classmethod
    def model_validate(cls, obj):
        """Parse JSON strings back to lists"""
        if isinstance(obj, dict):
            # Handle dictionary input
            if isinstance(obj.get('keywords'), str):
                try:
                    obj['keywords'] = json.loads(obj['keywords']) if obj['keywords'] else []
                except:
                    obj['keywords'] = []
            if isinstance(obj.get('sections'), str):
                try:
                    obj['sections'] = json.loads(obj['sections']) if obj['sections'] else []
                except:
                    obj['sections'] = []
        else:
            # Handle ORM object
            if hasattr(obj, 'keywords') and isinstance(obj.keywords, str):
                try:
                    obj.keywords = json.loads(obj.keywords) if obj.keywords else []
                except:
                    obj.keywords = []
            if hasattr(obj, 'sections') and isinstance(obj.sections, str):
                try:
                    obj.sections = json.loads(obj.sections) if obj.sections else []
                except:
                    obj.sections = []
        return super().model_validate(obj)


@router.get("/search", response_model=List[PrecedentResponse])
async def search_precedents(
    q: str = Query(..., min_length=1, description="Search query (case name, parties, keywords)"),
    year_from: Optional[int] = Query(None, description="Filter from year"),
    year_to: Optional[int] = Query(None, description="Filter to year"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db)
):
    """
    Search for precedents by case name, parties, or keywords.
    
    **Query Examples:**
    - `?q=murder` - Search for all murder cases
    - `?q=Article%2021&year_from=2000&year_to=2023` - Constitutional cases
    - `?q=dowry&limit=20` - Get 20 dowry cases
    """
    
    # Build search query
    query = select(Precedent)
    
    # Search in case_name, parties, and summary
    search_term = f"%{q}%"
    query = query.where(
        or_(
            Precedent.case_name.ilike(search_term),
            Precedent.parties.ilike(search_term),
            Precedent.summary.ilike(search_term)
        )
    )
    
    # Apply year filters
    if year_from:
        query = query.where(Precedent.year >= year_from)
    if year_to:
        query = query.where(Precedent.year <= year_to)
    
    # Order by year descending (newest first)
    query = query.order_by(desc(Precedent.year))
    
    # Pagination
    query = query.offset(offset).limit(limit)
    
    result = await db.execute(query)
    precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses


@router.get("/by-year/{year}", response_model=List[PrecedentResponse])
async def get_precedents_by_year(
    year: int,
    limit: int = Query(200, ge=1, le=500),
    db: AsyncSession = Depends(get_db)
):
    """Get all precedents from a specific year"""
    query = select(Precedent).where(
        Precedent.year == year
    ).order_by(Precedent.case_name).limit(limit)
    
    result = await db.execute(query)
    precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses


@router.get("/by-section/{section}", response_model=List[PrecedentResponse])
async def get_precedents_by_section(
    section: str,
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get precedents that mention a specific legal section.
    
    **Examples:**
    - `/by-section/498A` - Dowry cases
    - `/by-section/21` - Article 21 cases
    - `/by-section/302` - Murder cases
    """
    
    # Search in sections text field (contains JSON array)
    search_term = f'"{section}"'
    query = select(Precedent).where(
        Precedent.sections.ilike(f"%{search_term}%")
    ).order_by(desc(Precedent.year)).limit(limit)
    
    result = await db.execute(query)
    precedents = result.scalars().all()
    
    if not precedents:
        # Fallback: search in summary text
        search_term = f"%{section}%"
        query = select(Precedent).where(
            Precedent.summary.ilike(search_term)
        ).order_by(desc(Precedent.year)).limit(limit)
        result = await db.execute(query)
        precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses


@router.get("/list", response_model=List[PrecedentResponse])
async def list_all_precedents(
    skip: int = Query(0, ge=0),
    limit: int = Query(500, ge=1, le=1000),
    db: AsyncSession = Depends(get_db)
):
    """
    List all precedents with pagination.
    Returns up to 1000 precedents at a time.
    
    **Usage:**
    - `/list?skip=0&limit=500` - Get first 500
    - `/list?skip=500&limit=500` - Get next 500
    """
    query = select(Precedent).order_by(desc(Precedent.year)).offset(skip).limit(limit)
    result = await db.execute(query)
    precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses


@router.get("/count")
async def get_precedent_count(db: AsyncSession = Depends(get_db)):
    """Get total count of precedents in database"""
    query = select(func.count(Precedent.id))
    result = await db.execute(query)
    total = result.scalar() or 0
    return {"total": total, "status": "ready"}


@router.get("/random", response_model=List[PrecedentResponse])
async def get_random_precedents(
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """Get random precedents for discovery"""
    from sqlalchemy import func as sql_func
    
    query = select(Precedent).order_by(sql_func.random()).limit(limit)
    result = await db.execute(query)
    precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses


@router.get("/statistics")
async def get_precedent_statistics(db: AsyncSession = Depends(get_db)):
    """Get statistics about the precedents database"""
    
    # Total count
    total_result = await db.execute(select(func.count(Precedent.id)))
    total = total_result.scalar() or 0
    
    # Year range
    year_min_result = await db.execute(select(func.min(Precedent.year)))
    year_min = year_min_result.scalar()
    
    year_max_result = await db.execute(select(func.max(Precedent.year)))
    year_max = year_max_result.scalar()
    
    # Count by decade
    decades = {}
    if year_min and year_max:
        for decade_start in range(int(year_min / 10) * 10, int(year_max / 10) * 10 + 10, 10):
            decade_end = decade_start + 9
            count_result = await db.execute(
                select(func.count(Precedent.id)).where(
                    (Precedent.year >= decade_start) & (Precedent.year <= decade_end)
                )
            )
            count = count_result.scalar() or 0
            if count > 0:
                decades[f"{decade_start}s"] = count
    
    return {
        "total_precedents": total,
        "year_range": {
            "from": year_min,
            "to": year_max
        },
        "by_decade": decades
    }


@router.get("/{precedent_id}", response_model=PrecedentResponse)
async def get_precedent(
    precedent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get a specific precedent by ID"""
    query = select(Precedent).where(Precedent.id == precedent_id)
    result = await db.execute(query)
    precedent = result.scalar_one_or_none()
    
    if not precedent:
        raise HTTPException(status_code=404, detail="Precedent not found")
    
    # Convert to response model and parse JSON fields
    data = {
        'id': precedent.id,
        'case_name': precedent.case_name,
        'year': precedent.year,
        'parties': precedent.parties,
        'court': precedent.court,
        'summary': precedent.summary,
        'pdf_file': precedent.pdf_file,
        'keywords': json.loads(precedent.keywords) if isinstance(precedent.keywords, str) and precedent.keywords else [],
        'sections': json.loads(precedent.sections) if isinstance(precedent.sections, str) and precedent.sections else [],
        'citation': precedent.citation,
    }
    return PrecedentResponse(**data)


@router.get("/similar", response_model=List[PrecedentResponse])
async def get_similar_precedents(
    case_name: str = Query(..., description="Reference case name"),
    limit: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Find similar precedents based on case name and keywords.
    """
    # Get case to find similar ones
    query = select(Precedent).where(
        Precedent.case_name.ilike(f"%{case_name}%")
    ).limit(1)
    result = await db.execute(query)
    reference = result.scalar_one_or_none()
    
    if not reference:
        raise HTTPException(status_code=404, detail="Reference case not found")
    
    # Find cases with similar keywords
    if reference.keywords:
        try:
            keywords = json.loads(reference.keywords) if isinstance(reference.keywords, str) else reference.keywords
            if keywords:
                # Search for first keyword in case names
                similar_query = select(Precedent).where(
                    Precedent.case_name.ilike(f"%{keywords[0]}%"),
                    Precedent.id != reference.id
                ).order_by(desc(Precedent.year)).limit(limit)
            else:
                # Fallback: same year
                similar_query = select(Precedent).where(
                    (Precedent.year == reference.year) &
                    (Precedent.id != reference.id)
                ).order_by(func.random()).limit(limit)
        except:
            # Fallback: same year
            similar_query = select(Precedent).where(
                (Precedent.year == reference.year) &
                (Precedent.id != reference.id)
            ).order_by(func.random()).limit(limit)
    else:
        # Fallback: same year and similar summary
        similar_query = select(Precedent).where(
            (Precedent.year == reference.year) &
            (Precedent.id != reference.id)
        ).order_by(func.random()).limit(limit)
    
    result = await db.execute(similar_query)
    precedents = result.scalars().all()
    
    # Convert to response model and parse JSON fields
    responses = []
    for p in precedents:
        data = {
            'id': p.id,
            'case_name': p.case_name,
            'year': p.year,
            'parties': p.parties,
            'court': p.court,
            'summary': p.summary,
            'pdf_file': p.pdf_file,
            'keywords': json.loads(p.keywords) if isinstance(p.keywords, str) and p.keywords else [],
            'sections': json.loads(p.sections) if isinstance(p.sections, str) and p.sections else [],
            'citation': p.citation,
        }
        responses.append(PrecedentResponse(**data))
    
    return responses



@router.get("/pdf/{precedent_id}")
async def get_precedent_pdf(
    precedent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get PDF file for a precedent.
    Returns the PDF content or metadata if file doesn't exist.
    """
    query = select(Precedent).where(Precedent.id == precedent_id)
    result = await db.execute(query)
    precedent = result.scalar_one_or_none()
    
    if not precedent:
        raise HTTPException(status_code=404, detail="Precedent not found")
    
    if not precedent.pdf_file:
        raise HTTPException(status_code=404, detail="PDF not available for this precedent")
    
    # Try to find and serve the PDF file
    year_folder = str(precedent.year) if precedent.year else None
    pdf_paths = [
        Path(precedent.pdf_file),
        Path("supreme_court_judgments") / precedent.pdf_file,
        Path("dataset") / precedent.pdf_file,
        Path("..") / "supreme_court_judgments" / precedent.pdf_file,
    ]
    if year_folder:
        pdf_paths.extend([
            Path("supreme_court_judgments") / year_folder / precedent.pdf_file,
            Path("..") / "supreme_court_judgments" / year_folder / precedent.pdf_file,
        ])
    
    for pdf_path in pdf_paths:
        if pdf_path.exists() and pdf_path.is_file():
            try:
                return FileResponse(
                    path=pdf_path,
                    media_type="application/pdf",
                    headers={"Content-Disposition": f"inline; filename={precedent.case_name}.pdf"}
                )
            except Exception as e:
                continue
    
    # If file not found, return metadata only
    return JSONResponse(
        status_code=200,
        content={
            "status": "pdf_reference_only",
            "message": f"PDF file referenced as '{precedent.pdf_file}' but not found on disk",
            "case_name": precedent.case_name,
            "citation": precedent.citation,
            "summary": precedent.summary,
            "pdf_reference": precedent.pdf_file
        }
    )


@router.get("/pdf-info/{precedent_id}")
async def get_pdf_info(
    precedent_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Get PDF information and availability for a precedent"""
    query = select(Precedent).where(Precedent.id == precedent_id)
    result = await db.execute(query)
    precedent = result.scalar_one_or_none()
    
    if not precedent:
        raise HTTPException(status_code=404, detail="Precedent not found")
    
    if not precedent.pdf_file:
        return {
            "available": False,
            "message": "No PDF reference for this case"
        }
    
    # Check if PDF file exists
    year_folder = str(precedent.year) if precedent.year else None
    pdf_paths = [
        Path(precedent.pdf_file),
        Path("supreme_court_judgments") / precedent.pdf_file,
        Path("dataset") / precedent.pdf_file,
        Path("..") / "supreme_court_judgments" / precedent.pdf_file,
    ]
    if year_folder:
        pdf_paths.extend([
            Path("supreme_court_judgments") / year_folder / precedent.pdf_file,
            Path("..") / "supreme_court_judgments" / year_folder / precedent.pdf_file,
        ])
    
    for pdf_path in pdf_paths:
        if pdf_path.exists() and pdf_path.is_file():
            return {
                "available": True,
                "case_name": precedent.case_name,
                "citation": precedent.citation,
                "pdf_reference": precedent.pdf_file,
                "url": f"/api/precedents/pdf/{precedent_id}"
            }
    
    return {
        "available": False,
        "message": f"PDF reference exists ('{precedent.pdf_file}') but file not found on disk",
        "pdf_reference": precedent.pdf_file
    }


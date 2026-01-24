from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import Lawyer


class LawyerService:
    """Service for lawyer matching and management."""
    
    def __init__(self):
        pass
    
    async def find_matching_lawyers(
        self,
        db: AsyncSession,
        category: str,
        description: str,
        location: Optional[str] = None,
        limit: int = 5
    ) -> List[Dict[str, Any]]:
        """Find lawyers matching the case requirements."""
        
        # Get all available lawyers
        result = await db.execute(
            select(Lawyer).where(Lawyer.is_available == True)
        )
        lawyers = result.scalars().all()
        
        # Score and match lawyers
        scored_lawyers = []
        for lawyer in lawyers:
            score = self._calculate_match_score(lawyer, category, description, location)
            if score > 0:
                scored_lawyers.append({
                    "lawyer": lawyer,
                    "score": score,
                    "reasons": self._get_match_reasons(lawyer, category)
                })
        
        # Sort by score (highest first)
        scored_lawyers.sort(key=lambda x: x["score"], reverse=True)
        
        # Format response
        matches = []
        for item in scored_lawyers[:limit]:
            lawyer = item["lawyer"]
            lawyer_details = await self.get_lawyer_with_name(db, lawyer)
            matches.append({
                **lawyer_details,
                "match_score": item["score"],
                "match_reasons": item["reasons"]
            })
        
        return matches
    
    def _calculate_match_score(
        self,
        lawyer: Lawyer,
        category: str,
        description: str,
        location: Optional[str] = None
    ) -> float:
        """Calculate match score for a lawyer (0-100)."""
        score = 0.0
        
        # Check specialization match
        if lawyer.specialization and category in lawyer.specialization:
            score += 50.0
        elif lawyer.specialization and any(cat in str(lawyer.specialization).lower() for cat in category.split()):
            score += 30.0
        
        # Location match
        if location and lawyer.location:
            if location.lower() in lawyer.location.lower() or lawyer.location.lower() in location.lower():
                score += 20.0
        
        # Experience bonus
        if lawyer.experience_years:
            score += min(lawyer.experience_years * 0.5, 15.0)
        
        # Rating bonus
        if lawyer.rating:
            score += lawyer.rating * 3.0
        
        return min(score, 100.0)
    
    def _get_match_reasons(self, lawyer: Lawyer, category: str) -> List[str]:
        """Get reasons why this lawyer is a good match."""
        reasons = []
        
        if lawyer.specialization and category in lawyer.specialization:
            reasons.append(f"Specializes in {category}")
        
        if lawyer.experience_years and lawyer.experience_years >= 5:
            reasons.append(f"{lawyer.experience_years} years of experience")
        
        if lawyer.rating and lawyer.rating >= 4.0:
            reasons.append(f"Highly rated ({lawyer.rating}/5)")
        
        if lawyer.location:
            reasons.append(f"Located in {lawyer.location}")
        
        return reasons if reasons else ["Available lawyer"]
    
    async def _get_lawyer_name(self, db: AsyncSession, user_id: int) -> str:
        """Get lawyer's name from user table."""
        from app.database import User
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        return user.full_name if user else "Lawyer"
    
    async def get_lawyer_with_name(self, db: AsyncSession, lawyer: Lawyer) -> Dict[str, Any]:
        """Get lawyer details with name from user table."""
        from app.database import User
        result = await db.execute(select(User).where(User.id == lawyer.user_id))
        user = result.scalar_one_or_none()
        name = user.full_name if user else "Lawyer"
        
        return {
            "id": lawyer.id,
            "name": name,
            "specialization": lawyer.specialization,
            "experience_years": lawyer.experience_years,
            "location": lawyer.location,
            "rating": lawyer.rating,
            "hourly_rate": lawyer.hourly_rate
        }


# Singleton instance
lawyer_service = LawyerService()

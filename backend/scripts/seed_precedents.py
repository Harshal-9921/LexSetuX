#!/usr/bin/env python3
"""
Seed database with 26,285 Supreme Court judgments from extracted JSON
"""

import json
import asyncio
import sys
import sqlite3
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, Base

async def seed_precedents():
    """Load all judgments from supreme_court_judgments_full.json into database"""
    
    print("🔄 Loading Supreme Court judgments from JSON...")
    json_file = Path(__file__).parent.parent.parent / "dataset" / "supreme_court_judgments_full.json"
    
    if not json_file.exists():
        print(f"❌ File not found: {json_file}")
        return
    
    try:
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        judgments = data if isinstance(data, list) else data.get('judgments', [])
    except Exception as e:
        print(f"❌ Error loading JSON: {e}")
        return
    
    print(f"📊 Loaded {len(judgments)} judgments from JSON")
    
    # Create tables
    print("🗄️  Creating database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Get SQLite database file path
    db_file = "legal_case.db"
    
    # Direct SQLite insertion for better control
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    batch_size = 100
    total_inserted = 0
    
    try:
        # Check existing count
        cursor.execute("SELECT COUNT(*) FROM precedents")
        existing_count = cursor.fetchone()[0]
        print(f"✅ Database already has {existing_count} precedents")
        
        if existing_count > 0:
            print("📌 Precedents already seeded. Skipping insertion.")
            return
        
        for i in range(0, len(judgments), batch_size):
            batch = judgments[i:i+batch_size]
            
            for idx, judgment in enumerate(batch):
                case_name = judgment.get('case_name', f"Case_{i + idx}")[:500]
                year = judgment.get('year', 2023)
                parties = judgment.get('parties', '')[:500]
                summary = judgment.get('summary', '')[:3000]
                pdf_file = judgment.get('pdf_file', '')[:500]
                
                # Extract and serialize keywords/sections
                keywords = extract_keywords(case_name)
                sections = extract_sections(summary)
                keywords_json = json.dumps(keywords)
                sections_json = json.dumps(sections)
                
                citation = f"{year} SCC {(i + idx) % 1000}"
                
                cursor.execute("""
                    INSERT INTO precedents 
                    (case_name, year, parties, court, summary, pdf_file, keywords, sections, citation)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    case_name, year, parties, "Supreme Court of India", 
                    summary, pdf_file, keywords_json, sections_json, citation
                ))
            
            conn.commit()
            total_inserted += len(batch)
            progress = (i + len(batch)) / len(judgments) * 100
            print(f"✓ Inserted {total_inserted}/{len(judgments)} ({progress:.1f}%)")
    
    except Exception as e:
        print(f"❌ Error during insertion: {e}")
        conn.rollback()
        return
    finally:
        conn.close()
    
    print(f"\n✅ Successfully seeded {total_inserted} precedents!")

def extract_keywords(case_name: str) -> list:
    """Extract keywords from case name"""
    words = case_name.lower().split()
    # Filter common words
    stopwords = {'vs', 'and', 'the', 'of', 'in', 'to', 'v', 'a'}
    return [w for w in words if len(w) > 3 and w not in stopwords][:5]

def extract_sections(summary: str) -> list:
    """Extract legal section references like IPC 498, Article 21, etc."""
    import re
    
    sections = []
    # Find patterns like "IPC 498", "Article 21", "Section 304"
    patterns = [
        r'IPC\s+(\d+)',
        r'Article\s+(\d+)',
        r'Section\s+(\d+)',
        r'Act\s+(\d{4})',
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, summary[:1000])  # Search first 1000 chars
        sections.extend(matches[:3])  # Limit to 3 matches per pattern
    
    return sections[:5]

if __name__ == "__main__":
    print("=" * 70)
    print("🚀 SEEDING PRECEDENTS DATABASE")
    print("=" * 70)
    asyncio.run(seed_precedents())
    print("=" * 70)

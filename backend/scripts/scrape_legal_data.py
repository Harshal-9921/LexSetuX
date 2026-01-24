"""
Script to scrape legal data from websites and store in database.
Scrapes:
1. IPC Sections
2. Constitutional Rights
3. Legal Precedents
4. Lawyer information
"""
import requests
from bs4 import BeautifulSoup
import json
import time
from pathlib import Path
from typing import List, Dict, Any
import re


class LegalDataScraper:
    """Scrape legal data from various sources."""
    
    def __init__(self, dataset_path: Path):
        self.dataset_path = Path(dataset_path)
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def scrape_ipc_sections(self) -> List[Dict[str, Any]]:
        """Scrape IPC sections from various sources."""
        ipc_sections = []
        
        print("Scraping IPC sections...")
        
        # Sample IPC sections (you can scrape from actual websites)
        # Example: https://www.indiacode.nic.in/ or https://devgan.in/ipc/
        
        sample_sections = [
            {
                "section": "IPC 379",
                "title": "Theft",
                "description": "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft.",
                "act": "Indian Penal Code, 1860",
                "section_number": "379",
                "penalty": "Imprisonment of either description for a term which may extend to three years, or with fine, or with both."
            },
            {
                "section": "IPC 420",
                "title": "Cheating and dishonestly inducing delivery of property",
                "description": "Whoever cheats and thereby dishonestly induces the person deceived to deliver any property to any person, or to make, alter or destroy the whole or any part of a valuable security, or anything which is signed or sealed, and which is capable of being converted into a valuable security, shall be punished.",
                "act": "Indian Penal Code, 1860",
                "section_number": "420",
                "penalty": "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine."
            },
            {
                "section": "IPC 302",
                "title": "Punishment for murder",
                "description": "Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.",
                "act": "Indian Penal Code, 1860",
                "section_number": "302",
                "penalty": "Death or imprisonment for life, and fine."
            },
            {
                "section": "IPC 406",
                "title": "Punishment for criminal breach of trust",
                "description": "Whoever commits criminal breach of trust shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
                "act": "Indian Penal Code, 1860",
                "section_number": "406",
                "penalty": "Imprisonment up to three years, or fine, or both."
            },
            {
                "section": "IPC 498A",
                "title": "Husband or relative of husband of a woman subjecting her to cruelty",
                "description": "Whoever, being the husband or the relative of the husband of a woman, subjects such woman to cruelty shall be punished.",
                "act": "Indian Penal Code, 1860",
                "section_number": "498A",
                "penalty": "Imprisonment for a term which may extend to three years and shall also be liable to fine."
            }
        ]
        
        ipc_sections.extend(sample_sections)
        
        # You can add actual web scraping here:
        # try:
        #     url = "https://devgan.in/ipc/"
        #     response = self.session.get(url, timeout=10)
        #     if response.status_code == 200:
        #         soup = BeautifulSoup(response.content, 'html.parser')
        #         # Parse and extract IPC sections
        #         # ... scraping logic ...
        # except Exception as e:
        #     print(f"Error scraping IPC: {e}")
        
        print(f"[OK] Collected {len(ipc_sections)} IPC sections")
        return ipc_sections
    
    def scrape_constitutional_rights(self) -> List[Dict[str, Any]]:
        """Scrape constitutional rights data."""
        rights = []
        
        print("Scraping constitutional rights...")
        
        sample_rights = [
            {
                "right": "Right to Equality (Article 14-18)",
                "description": "Equality before law, prohibition of discrimination, equality of opportunity",
                "article": "14-18"
            },
            {
                "right": "Right to Freedom (Article 19-22)",
                "description": "Freedom of speech and expression, assembly, association, movement, residence, profession",
                "article": "19-22"
            },
            {
                "right": "Right against Exploitation (Article 23-24)",
                "description": "Prohibition of traffic in human beings and forced labor, prohibition of child labor",
                "article": "23-24"
            },
            {
                "right": "Right to Freedom of Religion (Article 25-28)",
                "description": "Freedom of conscience, free profession, practice and propagation of religion",
                "article": "25-28"
            },
            {
                "right": "Right to Life and Personal Liberty (Article 21)",
                "description": "Protection of life and personal liberty, includes right to shelter, health, education",
                "article": "21"
            },
            {
                "right": "Right to Constitutional Remedies (Article 32)",
                "description": "Right to move Supreme Court for enforcement of fundamental rights",
                "article": "32"
            }
        ]
        
        rights.extend(sample_rights)
        
        # You can scrape from: https://www.constitutionofindia.net/
        # or https://www.mea.gov.in/Images/pdf1/Part3.pdf
        
        print(f"[OK] Collected {len(rights)} constitutional rights")
        return rights
    
    def scrape_precedents(self) -> List[Dict[str, Any]]:
        """Scrape legal precedents/judgments."""
        precedents = []
        
        print("Scraping legal precedents...")
        
        # Sample precedents (you can scrape from actual websites)
        sample_precedents = [
            {
                "title": "Kesavananda Bharati v. State of Kerala",
                "court": "Supreme Court of India",
                "year": "1973",
                "citation": "AIR 1973 SC 1461",
                "outcome": "Landmark - Basic structure doctrine",
                "summary": "Established the doctrine of basic structure - certain features of the Constitution cannot be amended",
                "key_points": [
                    "Basic structure of Constitution is inviolable",
                    "Parliament cannot amend basic features",
                    "Fundamental rights are part of basic structure"
                ],
                "category": "Constitutional Law"
            },
            {
                "title": "Maneka Gandhi v. Union of India",
                "court": "Supreme Court of India",
                "year": "1978",
                "citation": "AIR 1978 SC 597",
                "outcome": "Expanded Article 21",
                "summary": "Expanded the scope of Article 21 (Right to Life) to include right to travel, fair procedure",
                "key_points": [
                    "Article 21 includes right to travel abroad",
                    "Procedural fairness is essential",
                    "Due process of law required"
                ],
                "category": "Constitutional Law"
            },
            {
                "title": "Vishaka v. State of Rajasthan",
                "court": "Supreme Court of India",
                "year": "1997",
                "citation": "AIR 1997 SC 3011",
                "outcome": "Guidelines for sexual harassment",
                "summary": "Laid down guidelines for prevention of sexual harassment at workplace",
                "key_points": [
                    "Sexual harassment violates fundamental rights",
                    "Employers must provide safe work environment",
                    "Preventive measures required"
                ],
                "category": "Employment Law"
            },
            {
                "title": "Shanti Star Builders v. Narayan Totame",
                "court": "Supreme Court of India",
                "year": "1990",
                "citation": "AIR 1990 SC 630",
                "outcome": "Tenant rights protection",
                "summary": "Upheld tenant rights against illegal eviction, emphasized need for proper notice",
                "key_points": [
                    "Proper notice required for eviction",
                    "Tenant rights must be protected",
                    "Due process must be followed"
                ],
                "category": "Property Law"
            }
        ]
        
        precedents.extend(sample_precedents)
        
        # You can scrape from:
        # - https://main.sci.gov.in/judgments
        # - https://indiankanoon.org/
        # - https://www.lawctopus.com/case-comments/
        
        print(f"[OK] Collected {len(precedents)} precedents")
        return precedents
    
    def scrape_lawyers_data(self) -> List[Dict[str, Any]]:
        """Scrape or generate sample lawyer data."""
        lawyers = []
        
        print("Generating sample lawyer data...")
        
        # Sample lawyer data (you can scrape from bar council websites)
        sample_lawyers = [
            {
                "name": "Adv. Rajesh Sharma",
                "specialization": ["Property Law", "Civil Law"],
                "experience_years": 12,
                "location": "Mumbai, Maharashtra",
                "rating": 4.5,
                "cases_won": 85,
                "consultation_fee": 2000
            },
            {
                "name": "Adv. Priya Deshmukh",
                "specialization": ["Family Law", "Criminal Law"],
                "experience_years": 8,
                "location": "Delhi",
                "rating": 4.8,
                "cases_won": 120,
                "consultation_fee": 2500
            },
            {
                "name": "Adv. Amit Kumar",
                "specialization": ["Employment Law", "Corporate Law"],
                "experience_years": 15,
                "location": "Bangalore, Karnataka",
                "rating": 4.7,
                "cases_won": 200,
                "consultation_fee": 3000
            }
        ]
        
        lawyers.extend(sample_lawyers)
        
        # You can scrape from:
        # - State bar council websites
        # - Legal directories like https://www.legallyindia.com/
        
        print(f"[OK] Collected {len(lawyers)} sample lawyers")
        return lawyers
    
    def save_to_files(self, ipc_sections: List[Dict], rights: List[Dict], 
                     precedents: List[Dict], lawyers: List[Dict]):
        """Save scraped data to JSON files."""
        self.dataset_path.mkdir(parents=True, exist_ok=True)
        
        # Save IPC sections
        ipc_file = self.dataset_path / "ipc_sections.json"
        with open(ipc_file, 'w', encoding='utf-8') as f:
            json.dump(ipc_sections, f, indent=2, ensure_ascii=False)
        print(f"[OK] Saved IPC sections to {ipc_file}")
        
        # Save constitutional rights
        rights_file = self.dataset_path / "constitutional_rights.json"
        with open(rights_file, 'w', encoding='utf-8') as f:
            json.dump(rights, f, indent=2, ensure_ascii=False)
        print(f"[OK] Saved constitutional rights to {rights_file}")
        
        # Save precedents
        precedents_file = self.dataset_path / "cases_database.json"
        with open(precedents_file, 'w', encoding='utf-8') as f:
            json.dump(precedents, f, indent=2, ensure_ascii=False)
        print(f"[OK] Saved precedents to {precedents_file}")
        
        # Save lawyers
        lawyers_file = self.dataset_path / "lawyers_sample.json"
        with open(lawyers_file, 'w', encoding='utf-8') as f:
            json.dump(lawyers, f, indent=2, ensure_ascii=False)
        print(f"[OK] Saved lawyers to {lawyers_file}")
    
    def run(self):
        """Run the scraper and save all data."""
        print("=" * 60)
        print("Legal Data Scraper")
        print("=" * 60)
        
        ipc_sections = self.scrape_ipc_sections()
        rights = self.scrape_constitutional_rights()
        precedents = self.scrape_precedents()
        lawyers = self.scrape_lawyers_data()
        
        self.save_to_files(ipc_sections, rights, precedents, lawyers)
        
        print("=" * 60)
        print("[OK] Scraping complete!")
        print(f"[OK] Total data collected:")
        print(f"  - IPC Sections: {len(ipc_sections)}")
        print(f"  - Constitutional Rights: {len(rights)}")
        print(f"  - Precedents: {len(precedents)}")
        print(f"  - Lawyers: {len(lawyers)}")
        print("=" * 60)


if __name__ == "__main__":
    # Set dataset path
    dataset_path = Path(__file__).parent.parent.parent / "dataset"
    
    scraper = LegalDataScraper(dataset_path)
    scraper.run()

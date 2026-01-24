# Legal Data Scraping Guide

## Overview

This guide explains how to scrape legal data from websites and store it in your database/datasets.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install beautifulsoup4 requests lxml
```

### 2. Run the Scraper

```bash
python scripts/scrape_legal_data.py
```

This will:
- Scrape/generate sample IPC sections
- Scrape/generate constitutional rights
- Scrape/generate legal precedents
- Save all data to `dataset/` folder as JSON files

## Data Sources

### IPC Sections
- **India Code**: https://www.indiacode.nic.in/
- **Devgan.in**: https://devgan.in/ipc/
- **Legal Service India**: https://www.legalserviceindia.com/ipc/

### Constitutional Rights
- **Constitution of India**: https://www.constitutionofindia.net/
- **Ministry of External Affairs**: https://www.mea.gov.in/

### Legal Precedents
- **Supreme Court of India**: https://main.sci.gov.in/judgments
- **Indian Kanoon**: https://indiankanoon.org/
- **Legal Service India**: https://www.legalserviceindia.com/case-laws/

### Lawyers
- **Bar Council of India**: https://www.barcouncilofindia.org/
- **State Bar Councils**
- **Legal Directories**: https://www.legallyindia.com/

## Scraping Examples

### Example 1: Scrape IPC Sections

```python
from scripts.scrape_legal_data import LegalDataScraper
from pathlib import Path

scraper = LegalDataScraper(Path("dataset"))
ipc_sections = scraper.scrape_ipc_sections()
```

### Example 2: Scrape Precedents

```python
scraper = LegalDataScraper(Path("dataset"))
precedents = scraper.scrape_precedents()
```

## Storing in Database

### Option 1: Store in JSON Files (Current)

Data is stored in `dataset/` folder:
- `dataset/ipc_sections.json`
- `dataset/constitutional_rights.json`
- `dataset/cases_database.json`
- `dataset/lawyers_sample.json`

### Option 2: Store in Database

You can create database models and store scraped data:

```python
# backend/app/models/scraped_data.py
from sqlalchemy import Column, Integer, String, Text, JSON
from app.database import Base

class IPCSection(Base):
    __tablename__ = "ipc_sections"
    
    id = Column(Integer, primary_key=True)
    section_number = Column(String(50))
    title = Column(String(255))
    description = Column(Text)
    act = Column(String(255))
    penalty = Column(Text)

class Precedent(Base):
    __tablename__ = "precedents"
    
    id = Column(Integer, primary_key=True)
    title = Column(String(500))
    court = Column(String(255))
    year = Column(String(10))
    citation = Column(String(255))
    outcome = Column(String(255))
    summary = Column(Text)
    key_points = Column(JSON)
    category = Column(String(100))
```

Then use Alembic migrations to create tables and import data.

## Advanced Scraping

### Using Selenium (for JavaScript-heavy sites)

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://example.com")

# Wait for JavaScript to load
time.sleep(3)

# Extract data
sections = driver.find_elements(By.CLASS_NAME, "section")
for section in sections:
    # Extract data
    pass

driver.quit()
```

### Rate Limiting

Always respect website rate limits:

```python
import time

for url in urls:
    response = requests.get(url)
    time.sleep(2)  # Wait 2 seconds between requests
```

### Error Handling

```python
try:
    response = requests.get(url, timeout=10)
    response.raise_for_status()
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
    continue  # Skip this item
```

## Ethical Considerations

1. **Check robots.txt**: `https://example.com/robots.txt`
2. **Respect rate limits**: Don't overload servers
3. **Terms of Service**: Check if scraping is allowed
4. **Attribution**: Credit sources when using scraped data
5. **Use APIs when available**: Many sites offer APIs

## Automated Updates

Create a scheduled task to update data:

```python
# scripts/update_datasets.py
import schedule
import time
from scrape_legal_data import LegalDataScraper

def update_datasets():
    scraper = LegalDataScraper(Path("dataset"))
    scraper.run()

# Schedule daily updates
schedule.every().day.at("02:00").do(update_datasets)

while True:
    schedule.run_pending()
    time.sleep(3600)  # Check every hour
```

## Data Format

### IPC Sections
```json
{
  "section": "IPC 379",
  "title": "Theft",
  "description": "Full description...",
  "act": "Indian Penal Code, 1860",
  "section_number": "379",
  "penalty": "Imprisonment up to 3 years..."
}
```

### Precedents
```json
{
  "title": "Case Title v. Respondent",
  "court": "Supreme Court of India",
  "year": "2023",
  "citation": "AIR 2023 SC 1234",
  "outcome": "Favorable",
  "summary": "Case summary...",
  "key_points": ["Point 1", "Point 2"],
  "category": "Property Law"
}
```

## Testing

After scraping, test that data loads correctly:

```python
from app.services.dataset_loader import dataset_loader

# Reload datasets
dataset_loader.reload()

# Check data
print(f"IPC Sections: {len(dataset_loader.ipc_sections)}")
print(f"Precedents: {len(dataset_loader.cases_db)}")
```

## Next Steps

1. **Customize scrapers** for your specific needs
2. **Add more data sources** as needed
3. **Set up scheduled updates** for fresh data
4. **Store in database** for better querying
5. **Add search/indexing** for faster lookups

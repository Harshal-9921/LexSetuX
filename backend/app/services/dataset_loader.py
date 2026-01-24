"""
Dataset loader for legal case analysis.
Loads datasets from the dataset/ directory.
"""
import json
from pathlib import Path
from typing import List, Dict, Any, Optional


class DatasetLoader:
    """Loads and manages legal datasets."""
    
    def __init__(self, dataset_path: Optional[Path] = None):
        if dataset_path is None:
            # Default to dataset folder at project root
            self.dataset_path = Path(__file__).parent.parent.parent.parent / "dataset"
        else:
            self.dataset_path = Path(dataset_path)
        
        self.cases_db: List[Dict[str, Any]] = []
        self.ipc_sections: List[Dict[str, Any]] = []
        self.constitutional_rights: List[Dict[str, Any]] = []
        self.lawyers_sample: List[Dict[str, Any]] = []
        
        self._load_all_datasets()
    
    def _load_all_datasets(self):
        """Load all available datasets."""
        self._load_cases_database()
        self._load_ipc_sections()
        self._load_constitutional_rights()
        self._load_lawyers_sample()
    
    def _load_cases_database(self):
        """Load past cases database."""
        try:
            cases_file = self.dataset_path / "cases_database.json"
            if cases_file.exists():
                with open(cases_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        self.cases_db = json.loads(content)
                        if not isinstance(self.cases_db, list):
                            self.cases_db = []
                        print(f"✓ Loaded {len(self.cases_db)} cases from database")
                    else:
                        print("⚠ cases_database.json is empty")
            else:
                print(f"⚠ cases_database.json not found at {cases_file}")
        except Exception as e:
            print(f"⚠ Could not load cases database: {e}")
            self.cases_db = []
    
    def _load_ipc_sections(self):
        """Load IPC (Indian Penal Code) sections."""
        try:
            ipc_file = self.dataset_path / "ipc_sections.json"
            if ipc_file.exists():
                with open(ipc_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        self.ipc_sections = json.loads(content)
                        if not isinstance(self.ipc_sections, list):
                            self.ipc_sections = []
                        print(f"✓ Loaded {len(self.ipc_sections)} IPC sections")
                    else:
                        print("⚠ ipc_sections.json is empty")
            else:
                print(f"⚠ ipc_sections.json not found at {ipc_file}")
        except Exception as e:
            print(f"⚠ Could not load IPC sections: {e}")
            self.ipc_sections = []
    
    def _load_constitutional_rights(self):
        """Load constitutional rights data."""
        try:
            rights_file = self.dataset_path / "constitutional_rights.json"
            if rights_file.exists():
                with open(rights_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        self.constitutional_rights = json.loads(content)
                        if not isinstance(self.constitutional_rights, list):
                            self.constitutional_rights = []
                        print(f"✓ Loaded {len(self.constitutional_rights)} constitutional rights")
                    else:
                        print("⚠ constitutional_rights.json is empty")
            else:
                print(f"⚠ constitutional_rights.json not found at {rights_file}")
        except Exception as e:
            print(f"⚠ Could not load constitutional rights: {e}")
            self.constitutional_rights = []
    
    def _load_lawyers_sample(self):
        """Load sample lawyers data."""
        try:
            lawyers_file = self.dataset_path / "lawyers_sample.json"
            if lawyers_file.exists():
                with open(lawyers_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        self.lawyers_sample = json.loads(content)
                        if not isinstance(self.lawyers_sample, list):
                            self.lawyers_sample = []
                        print(f"✓ Loaded {len(self.lawyers_sample)} sample lawyers")
                    else:
                        print("⚠ lawyers_sample.json is empty")
            else:
                print(f"⚠ lawyers_sample.json not found at {lawyers_file}")
        except Exception as e:
            print(f"⚠ Could not load lawyers sample: {e}")
            self.lawyers_sample = []
    
    def reload(self):
        """Reload all datasets."""
        self._load_all_datasets()


# Global instance
dataset_loader = DatasetLoader()

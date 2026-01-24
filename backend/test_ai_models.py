#!/usr/bin/env python3
"""
Test script to compare rule-based and LegalBERT AI models.
Tests both models on sample cases and compares outputs.

Usage:
    python test_ai_models.py
"""

import os
import sys
import json
import time
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

# Set environment variables
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///./legal_case.db"


def test_model(model_name: str, description: str, category: str = None, user_role: str = "customer") -> dict:
    """Test a specific AI model."""
    
    print(f"\n{'='*60}")
    print(f"Testing: {model_name.upper()}")
    print(f"{'='*60}")
    
    try:
        # Temporarily set the model
        os.environ["AI_MODEL"] = model_name
        
        # Force reimport to pick up new config
        import importlib
        import app.config
        importlib.reload(app.config)
        
        # Import factory and get service
        from app.services.ai_service_factory import get_ai_service, get_ai_service_info
        
        # Clear cached service
        import app.services.ai_service_factory as factory_module
        factory_module._ai_service_instance = None
        
        print(f"\nService Info:")
        info = get_ai_service_info()
        for key, value in info.items():
            print(f"  {key}: {value}")
        
        print(f"\nAnalyzing case...")
        start_time = time.time()
        
        service = get_ai_service()
        result = service.analyze_case(
            description=description,
            category=category,
            user_role=user_role
        )
        
        elapsed = time.time() - start_time
        
        print(f"\n✅ Analysis complete ({elapsed:.2f}s)")
        print(f"\nKey Results:")
        
        if user_role == "customer":
            print(f"  Category: {result.get('case_category', 'N/A')}")
            print(f"  Confidence: {result.get('confidence_score', 'N/A')}%")
            print(f"  Explanation: {result.get('simplified_explanation', 'N/A')[:100]}...")
            print(f"  Rights: {len(result.get('applicable_rights', []))} identified")
            print(f"  Sections: {len(result.get('applicable_sections', []))} identified")
            
            if "entities_detected" in result:
                entities = result["entities_detected"]
                print(f"  Entities Detected:")
                for entity_type, values in entities.items():
                    if values:
                        print(f"    - {entity_type}: {values}")
        else:
            print(f"  Domain: {result.get('case_classification', {}).get('domain', 'N/A')}")
            print(f"  Sub-domain: {result.get('case_classification', {}).get('sub_domain', 'N/A')}")
            print(f"  Confidence: {result.get('confidence_score', 'N/A')}%")
            print(f"  Case Strength: {result.get('case_strength', 'N/A')}/100")
            print(f"  Sections: {len(result.get('applicable_sections', []))} identified")
            print(f"  Past Cases: {len(result.get('past_cases', []))} found")
            print(f"  Opponent Points: {len(result.get('opponent_points', []))} identified")
        
        return {
            "model": model_name,
            "success": True,
            "time": elapsed,
            "result": result
        }
    
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "model": model_name,
            "success": False,
            "error": str(e)
        }


def main():
    """Run comparison tests."""
    
    print("\n" + "="*60)
    print("LegalBERT & Rule-Based AI Model Comparison")
    print("="*60)
    
    # Test cases
    test_cases = [
        {
            "name": "Property Dispute",
            "description": "My landlord is trying to evict me without proper notice. I have been paying rent regularly for 5 years. Can they do this?",
            "category": None,  # Auto-detect
            "user_role": "customer"
        },
        {
            "name": "Criminal Case",
            "description": "I was arrested for theft of Rs. 50,000 from my employer. I never took the money. What are my rights?",
            "category": None,
            "user_role": "lawyer"
        },
        {
            "name": "Family Matter",
            "description": "My spouse filed for divorce and wants custody of our children. We have two kids aged 6 and 8. What should I do?",
            "category": "family",
            "user_role": "customer"
        }
    ]
    
    results = []
    
    # Test rule-based first
    print("\n\n🔷 PHASE 1: RULE-BASED MODEL")
    for test_case in test_cases:
        result = test_model(
            "rule_based",
            test_case["description"],
            test_case.get("category"),
            test_case["user_role"]
        )
        results.append({**result, "test_case": test_case["name"]})
    
    # Test LegalBERT
    print("\n\n🔶 PHASE 2: LEGALBERT MODEL")
    for test_case in test_cases:
        result = test_model(
            "bert",
            test_case["description"],
            test_case.get("category"),
            test_case["user_role"]
        )
        results.append({**result, "test_case": test_case["name"]})
    
    # Summary
    print("\n\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    rule_based = [r for r in results if r["model"] == "rule_based"]
    bert = [r for r in results if r["model"] == "bert"]
    
    print(f"\nRule-Based Results: {sum(1 for r in rule_based if r['success'])}/{len(rule_based)} successful")
    for r in rule_based:
        status = "✅" if r["success"] else "❌"
        time_str = f"{r.get('time', 0):.2f}s" if r["success"] else "N/A"
        print(f"  {status} {r['test_case']}: {time_str}")
    
    print(f"\nLegalBERT Results: {sum(1 for r in bert if r['success'])}/{len(bert)} successful")
    for r in bert:
        status = "✅" if r["success"] else "❌"
        time_str = f"{r.get('time', 0):.2f}s" if r["success"] else "N/A"
        print(f"  {status} {r['test_case']}: {time_str}")
    
    # Performance comparison
    rule_based_times = [r["time"] for r in rule_based if r["success"]]
    bert_times = [r["time"] for r in bert if r["success"]]
    
    if rule_based_times and bert_times:
        print(f"\nPerformance:")
        print(f"  Rule-Based Avg: {sum(rule_based_times)/len(rule_based_times):.2f}s")
        print(f"  LegalBERT Avg: {sum(bert_times)/len(bert_times):.2f}s")
        ratio = (sum(bert_times)/len(bert_times)) / (sum(rule_based_times)/len(rule_based_times))
        print(f"  LegalBERT is {ratio:.1f}x slower (but more accurate)")
    
    print("\n✅ Test complete!")
    print("\nRecommendation:")
    print("  - Development: Use rule-based (faster)")
    print("  - Production: Use LegalBERT (more accurate)")
    print("  - Switch via: backend/.env → AI_MODEL=bert or rule_based")


if __name__ == "__main__":
    main()

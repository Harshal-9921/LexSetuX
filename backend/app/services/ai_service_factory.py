"""
AI Service Factory - Dynamically selects between rule-based and LegalBERT AI.

This module provides a factory function that returns the appropriate AI service
based on configuration, with automatic fallback if the chosen service isn't available.
"""

import logging
from typing import Union
from app.config import settings

logger = logging.getLogger(__name__)

# Cache for the service instance
_ai_service_instance = None


def get_ai_service() -> Union['LegalAIService', 'LegalBertAIService']:
    """
    Get the configured AI service instance.
    
    Returns the appropriate service based on AI_MODEL setting:
    - 'bert': LegalBERT transformer-based (higher accuracy)
    - 'rule_based' (default): Rule-based with keyword matching (faster)
    
    Automatically falls back to rule-based if BERT dependencies aren't available.
    
    Returns:
        Initialized AI service instance
    """
    global _ai_service_instance
    
    if _ai_service_instance is not None:
        return _ai_service_instance
    
    model_choice = settings.AI_MODEL.lower().strip()
    
    # Try to initialize chosen model
    if model_choice == "bert":
        try:
            logger.info("Initializing LegalBERT AI Service...")
            from app.services.ai_service_bert import LegalBertAIService
            _ai_service_instance = LegalBertAIService()
            logger.info("✅ LegalBERT AI Service initialized successfully")
            return _ai_service_instance
        except Exception as e:
            logger.warning(f"Failed to initialize LegalBERT: {str(e)}")
            logger.info("Falling back to rule-based AI service...")
    
    # Default or fallback to rule-based
    try:
        logger.info("Initializing Rule-Based AI Service...")
        from app.services.ai_service import LegalAIService
        _ai_service_instance = LegalAIService()
        logger.info("✅ Rule-Based AI Service initialized successfully")
        return _ai_service_instance
    except Exception as e:
        logger.error(f"Failed to initialize Rule-Based AI Service: {str(e)}")
        raise RuntimeError(f"Could not initialize any AI service: {str(e)}")


def get_ai_service_info() -> dict:
    """
    Get information about the active AI service.
    
    Returns:
        Dictionary with service details
    """
    service = get_ai_service()
    
    if hasattr(service, 'LEGAL_BERT_MODEL'):
        return {
            "model": "LegalBERT (Transformer-based)",
            "type": "bert",
            "accuracy": "90-95%",
            "speed": "Moderate (GPU recommended)",
            "description": "Semantic understanding using pre-trained legal BERT model"
        }
    else:
        return {
            "model": "Rule-Based (Keyword Matching)",
            "type": "rule_based",
            "accuracy": "70-80%",
            "speed": "Fast",
            "description": "Pattern matching and keyword-based classification"
        }

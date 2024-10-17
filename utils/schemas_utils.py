
"""Schemas for API Requests and Responses.
"""

__author__ = 'Sahil Mulla'

# built-in imports
from typing import List, Dict

# schemas imports
from pydantic import BaseModel

class PredictionIn(BaseModel):
    """Used for prediction requests."""
    entries: List[Dict]

class AIPredictionOut(BaseModel):
    """Used for service prediction response."""
    predictions: List[Dict]
 
class AnalysisNutritionsIn(BaseModel):
    """Used for prediction requests."""
    
    image_url : str = None
    query : str = None
    action : str
    entries: List[Dict] = None


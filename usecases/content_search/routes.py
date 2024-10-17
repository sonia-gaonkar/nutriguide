
"""Content Search API routes.
"""

__author__ = 'Sahil Mulla'

#libraries
import sys, os

# fastapi imports
from fastapi import APIRouter, status, Header

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

# utils imports
from utils.constant_utils import Routes
from utils import schemas_utils as schemas
from utils.configuration_utils import get_logger

# package imports
from . import ai

router = APIRouter(prefix=Routes.PREFIX)

logger = get_logger('Content Search')


# prediction
@router.post(Routes.CONTENT_ANALYSIS, response_model=schemas.AIPredictionOut, status_code=status.HTTP_200_OK)
async def upload_rfp(request: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    """
    POST request for analysis of content provided as input.
        :return analyzed content in 'AIPredictionOut' format.
    """
    logger.info(msg=request)
    return ai.predict(data=request, authorization=authorization)

# prediction
@router.post(Routes.CHAT_ANALYSIS, response_model=schemas.AIPredictionOut, status_code=status.HTTP_200_OK)
async def upload_rfp(request: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    """
    POST request for advisor APIS.
        :return analyzed content in 'AIPredictionOut' format.
    """
    logger.info(msg=request)
    return ai.predict_chat(data=request, authorization=authorization)
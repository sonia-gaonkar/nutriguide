
"""Controller Prediction API Router.
"""

__author__ = 'Sahil Mulla'

# built-in imports
from typing import Dict, Optional

# API imports
import requests
from fastapi import APIRouter, HTTPException, status, Header

# utils imports
from utils.configuration_utils import ControllerConfig, NodeServerConfig, ContentSearchConfig
from utils.constant_utils import Routes, MessageCode, Constants
from utils import schemas_utils as schemas
from utils.configuration_utils import get_logger
from utils.common_utils import CommonUtils

# package imports
from ._helper import is_available

prediction_router = APIRouter(prefix=Routes.PREFIX, tags=['Prediction'])
logger = get_logger('Controller')


def _predict(service_name: str, port: str, url: str, json: Dict, authorization: str = Header(...)) -> Optional[Dict]:
    """
    Base prediction function.
    Call prediction endpoint of specified service and return the response.

        :param service_name: Name of the service
        :param port: Service port
        :param url: Prediction URL
        :param json: Request body
        :returns: Response dictionary
        :raises HTTPException[503]: If service unavailable.
        :raises HTTPException[404]: If model not found.
        :raises HTTPException[422]: If invalid request format.
        :raises HTTPException[500]: Other exception
    """
    
    # This is body fo JWT token authentication, it will send JWT token and return response whether it is valid or not.
    auth_body = {
        'token' : authorization
    }
    
    #creating endpoint for node server
    node_url =f'https://{NodeServerConfig.HOST}:{NodeServerConfig.PORT}{Routes.TOKEN_ENPOINT}'
    
    #calling node server api for JWT token authentication
    auth = requests.post(url=node_url,json=auth_body,verify=False)
    
    #check if it return 200 status code then it simply add '#' to JWT token and move further
    if auth.status_code == status.HTTP_200_OK:
        authorization = '#' + authorization
    else:
        logger.error(msg=f'Unauthorised user...')
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail=CommonUtils.get_error_message(MessageCode.UNAUTHORIZED_USER, Constants.GENERIC))
    
    # check if service is available
    if not is_available(port):
        logger.critical(msg=f'{service_name} service unavailable.')
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail=f'ERROR: {service_name} service is unavailable. Please contact system administrator to check status.')

    logger.info(msg=f'Forwarding request to {service_name} service.')
    
    #creating headers for our internal genai service
    headers = {
        "authorization" : authorization
    }
    
    #reading path for certificate file
    certificate_file = ControllerConfig.certificate_file
    
    # call prediction API
    response = requests.post(url=url, json=json,verify=certificate_file,headers=headers)
    logger.info(msg=f'Response from {service_name} service: {response.json()}')
    logger.info(msg=response.json())
    # check status codes and return response
    if response.status_code == status.HTTP_200_OK:
        return response.json()
    elif response.status_code == status.HTTP_404_NOT_FOUND:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=response.json()['detail'])
    elif response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=response.json()['detail'])
    else:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail=response.json()['detail'])


#API to call the service
@prediction_router.post(Routes.CONTENT_ANALYSIS,
                        status_code=status.HTTP_200_OK, 
                        response_model=schemas.AIPredictionOut,
                        summary='Auto Content search of Input(s).')
def content_search_upload(request: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    
    #creating URL for service
    url = f'https://{ContentSearchConfig.HOST}:{ContentSearchConfig.PORT}{Routes.PREFIX}{Routes.CONTENT_ANALYSIS}'
    
    logger.info(msg=f'Request data {request}')
    return _predict(
        service_name=ContentSearchConfig.NAME,
        port=ContentSearchConfig.PORT,
        url=url,
        json=request.dict(),
        authorization=authorization
    )

# prediction
@prediction_router.post(Routes.CHAT_ANALYSIS,
                        status_code=status.HTTP_200_OK, 
                        response_model=schemas.AIPredictionOut,
                        summary='Auto Content search of Input(s).')
def content_search_upload(request: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    
    #creating URL for service
    url = f'https://{ContentSearchConfig.HOST}:{ContentSearchConfig.PORT}{Routes.PREFIX}{Routes.CHAT_ANALYSIS}'
    logger.info(msg=f'Request data {request}')
    return _predict(
        service_name=ContentSearchConfig.NAME,
        port=ContentSearchConfig.PORT,
        url=url,
        json=request.dict(),
        authorization=authorization
    )

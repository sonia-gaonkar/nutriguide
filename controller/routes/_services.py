
"""Controller Services API Router.
"""

__author__ = 'Sahil Mulla'

# API imports
from fastapi import APIRouter, status

# utils imports
from utils.configuration_utils import ControllerConfig, ContentSearchConfig
from utils.constant_utils import Routes
from utils import schemas_utils as schemas
from utils.configuration_utils import get_logger

# package imports
from ._helper import is_available

services_router = APIRouter(prefix=Routes.PREFIX, tags=['Services'])
logger = get_logger('Controller')

# This API is for check the status of the services
@services_router.get(Routes.CONTROLLER_SERVICES,
                     response_model=schemas.CtrServicesOut,
                     status_code=status.HTTP_200_OK,
                     summary='Fetch service(s) status.')
def get_services():
    """
    Fetch status of all active services.
    """
    
    services = {}
    response = {}

    if is_available(ControllerConfig.PORT):
        services[ControllerConfig.NAME] = 'Started'
    else:
        services[ControllerConfig.NAME] = 'Not started'
    
    if is_available(ContentSearchConfig.PORT):
        services[ContentSearchConfig.NAME] = 'Started'
    else:
        services[ContentSearchConfig.NAME] = 'Not started'
        
    logger.info(msg=f'services: {services}')
    response['services'] = services
    return response

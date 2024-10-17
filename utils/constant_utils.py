
"""Constant utilities.
"""

__author__ = 'Sahil Mulla'

#  built-in imports
from os import environ


class ServiceType(object):
    """Service type constants."""

    CONTENT_GENERATION = '_Content_Generation'


class Path(object):
    """Path constants."""

    # file names
    # configuration files
    _CONFIG_FILE_NAME = 'ai_configuration.ini'
    _DEFAULT_CONFIG_FILE_NAME = 'ai_configuration.ini.default'

    # watsonx home path
    _TOP = environ['TOP']

    # watsonx ai home path
    HOME_PATH = f'{_TOP}/nutriguide'

    # configuration file path
    CONFIG_PATH = f'{HOME_PATH}/config/{_CONFIG_FILE_NAME}'

    # log configuration file paths
    DEFAULT_CONFIG_PATH = f'{HOME_PATH}/config/{_DEFAULT_CONFIG_FILE_NAME}'

    # log file directory
    LOG_FILE_DIR = f'{HOME_PATH}/logs'
    
    # certificate file directory
    CERTIFICATE_FILE_DIR = f'{HOME_PATH}/certificates'
    
    #resource folder path
    RESOURCES_PATH = f'{HOME_PATH}/resources'
    
class MessageCode(object):
    """Message code constants."""
    
    #Error codes
    #Generics error codes Range[ER001-ER020]
    INVALID_PROMPT = "ER001"
    ATTRS_KEYWORD_MISSING = "ER002"
    PK_KEYWORD_MISSING = "ER003"
    INSUFFICEINT_ATTRIBUTES = "ER004"
    INVALID_INPUT = "ER005"
    INVALID_MODEL_ID = "ER006"
    UNAUTHORIZED_USER = "ER007"

class Constants(object):
    
    GENERIC  = "Generic"
     
class Routes(object):
    """API Route constants."""

    # prefix
    PREFIX = '/aiapi/v1'

    # controller
    CONTROLLER_SERVICES = '/services'

    # watsonx_model_list
    WATSON_MODELS = '/models'
    CONTENT_ANALYSIS = '/analysis'
    CHAT_ANALYSIS='/chat'

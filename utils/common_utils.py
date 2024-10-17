
#  built-in imports
from configparser import ConfigParser

from .constant_utils import Path

class CommonUtils(object):
    
    # This will return the error message as per the error code.
    def get_error_message(error_code:str, section:str):
        config_parser = ConfigParser()
        config_parser.read(Path.RESOURCES_PATH + '/messages_en_US.properties')
        error_message = config_parser.get(section, error_code)
        return error_message
    
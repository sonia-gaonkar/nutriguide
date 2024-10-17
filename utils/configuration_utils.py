
"""Configuration utilities.
"""

__author__ = 'Sahil Mulla'

#  built-in imports
from configparser import ConfigParser

from .constant_utils import Path
import logging
import datetime
from logging.handlers import RotatingFileHandler


def _get_configparser() -> ConfigParser:
    """
    Get ConfigParser for configuration file.

        :returns Configuration parser.
    """
    config_parser = ConfigParser()
    config_parser.read(Path.CONFIG_PATH)
    return config_parser


def get_logger(name:str):

   """
    Get Logger for particular service.
     :return the logger as per the 'name' given in input
   """
   configur = _get_configparser()
   current_date = datetime.date.today().strftime('%Y-%m-%d')
 
   level = configur.get('log_details','level')
   handler = configur.get('log_details','log_path') + '/' + configur.get(name,'log_file_name') + '-' + current_date + '.log'
   name = configur.get('log_details','name')
   
   
   logger = logging.getLogger(name)
   
   logger.setLevel(level)
   
   formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
   file_size = 10 * 1024 * 1024  #10MB
   file_handler = RotatingFileHandler(handler,mode='a',maxBytes=file_size,backupCount=5)
   file_handler.setFormatter(formatter)
   
   logger.addHandler(file_handler)
   return logger

class ControllerConfig(object):
    """Controller configuration."""

    _CONFIG = _get_configparser()
    NAME = 'Controller'

    HOST = _CONFIG[NAME]['host']
    PORT = _CONFIG[NAME]['port']
    
    certificate_path = _CONFIG['certificate_paths']['path']
    certificate_file = certificate_path + '/' + _CONFIG['certificate_paths']['cert_file_name']
    key_file = certificate_path + '/' + _CONFIG['certificate_paths']['key_file_name']
    
    # start-up command
    CMD = f'nohup hypercorn --certfile {certificate_file} --keyfile {key_file} controller.main:app --bind={HOST}:{PORT} &'


class ContentSearchConfig(object):
    """Search configuration."""

    _CONFIG = _get_configparser()
    NAME = 'Content Search'

    HOST = _CONFIG[NAME]['host']
    PORT = _CONFIG[NAME]['port']
    
    certificate_path = _CONFIG['certificate_paths']['path']
    certificate_file = certificate_path + '/' + _CONFIG['certificate_paths']['cert_file_name']
    key_file = certificate_path + '/' + _CONFIG['certificate_paths']['key_file_name']
    
    # start-up command
    CMD = f'nohup hypercorn --certfile {certificate_file} --keyfile {key_file} content_search.main:app --bind={HOST}:{PORT} &'

#This is node server config for JWT token authentication
class NodeServerConfig(object):
    """FeatureExtraction configuration."""

    _CONFIG = _get_configparser()
    NAME = 'Node Server'

    HOST = _CONFIG[NAME]['host']
    PORT = _CONFIG[NAME]['port']
    
    certificate_path = _CONFIG['certificate_paths']['path']
    certificate_file = certificate_path + '/' + _CONFIG['certificate_paths']['cert_file_name']
    key_file = certificate_path + '/' + _CONFIG['certificate_paths']['key_file_name']
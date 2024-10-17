
"""Configure environment.
Configure logging (create log configuration file for each service).
"""

__author__ = 'Sahil Mulla'

# built-in imports
import os
import sys

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

from utils.constant_utils import Path

# Configure the logging for the application
def configure_logging():
    if not os.path.exists(Path.LOG_FILE_DIR):
        os.mkdir(Path.LOG_FILE_DIR)


    output = open(Path.CONFIG_PATH,'w')
    inp = open(Path.DEFAULT_CONFIG_PATH,'r')

    path = Path.LOG_FILE_DIR
    cert_path = Path.CERTIFICATE_FILE_DIR 
    
    data = inp.read()
    data = data.replace('<log-path>',path)
    data = data.replace('<certificate-path>',cert_path)
    output.write(data)

if __name__ == '__main__':
    print('Configuring logging')
    configure_logging()
    print('Done!')

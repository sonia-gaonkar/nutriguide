
"""Get status of all services.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import os
import sys
from pprint import pprint

# API imports
import requests

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

import urllib3
urllib3.disable_warnings(urllib3.exceptions.SubjectAltNameWarning)

def _is_available(port) -> bool:
    """
    Check if a service is available.
    Check if the port used by a service is in use or not.

        :param port: Port
        :return: True if service is available else False.
    """
    # Getting the process information running on specific port
    process_info = os.popen(f'lsof -i:{port} | grep hypercorn').read().strip()

    if len(process_info) == 0:
        return False
    return True


def get_status():
    
    #import of configuration classes
    from utils.configuration_utils import ControllerConfig, ContentSearchConfig
    from utils.constant_utils import Routes

    #Configuration of service for Name and Port
    service_ports = {
        ControllerConfig.NAME: ControllerConfig.PORT,
        ContentSearchConfig.NAME : ContentSearchConfig.PORT
    }
    flag_unavailable = 0
    try:
        for service, port in service_ports.items():
            if not _is_available(port):
                print(f'{service} service is in stopped state.')
                flag_unavailable = 1
            else:
                print(f'{service} service is in started state.')

        if not flag_unavailable:
            print('==========================')
            response = requests.get(
                f'https://{ControllerConfig.HOST}:{ControllerConfig.PORT}{Routes.PREFIX}{Routes.CONTROLLER_SERVICES}',verify=ControllerConfig.certificate_file)
            pprint(response.json())
    except Exception as e:
        print('Failed to get the status.\nException:\n==========')
        print(e)


if __name__ == '__main__':
    
    #calling get_status() method to processing
    get_status()

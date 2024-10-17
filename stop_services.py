
"""Stop all services.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import os
import sys

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

def stop_services():
    
    #import of configuration classes
    from utils.configuration_utils import ControllerConfig, ContentSearchConfig

    #Configuration of service for Name and Port
    service_ports = {
        ControllerConfig.NAME: ControllerConfig.PORT,
        ContentSearchConfig.NAME : ContentSearchConfig.PORT
    }

    print('Stopping Watsonx AI services...')
    try:
        for service, port in service_ports.items():
            # Getting the process information running on specific port
            process_info = os.popen(f'lsof -i:{port} | grep hypercorn').read().strip()
 
            if len(process_info) == 0:
                print(f'{service} service is already in stopped state.')
            else:
                #kill the service which is running on particular port
                os.system(f'kill $(lsof -t -i:{port})')
                print(f'{service} service stopped.')
    except Exception as e:
        print('Failed to stop services.\nException:\n==========')
        print(e)


if __name__ == '__main__':
    
    #calling the stop services method
    stop_services()

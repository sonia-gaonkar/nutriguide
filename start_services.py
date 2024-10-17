
"""Start services.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import os
import sys

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

def start_services():

    from utils.configuration_utils import ControllerConfig, ContentSearchConfig
    
    # preparing the command to start the services by moving to HOME_PATH
    PATH = HOME_PATH + '/usecases'
    controller_command = f'cd {HOME_PATH} && {ControllerConfig.CMD}'
    content_search_command = f'cd {PATH} && {ContentSearchConfig.CMD}'

    print('Starting Watsonx AI services...')
    try:
        
        #execute the command to start controller service
        os.system(command=controller_command)
        print(f'{controller_command}')
        print(f'{ControllerConfig.NAME} service started.')
        
         #execute the command to start content_search service
        os.system(command=content_search_command)
        print(f'{content_search_command}')
        print(f'{ContentSearchConfig.NAME} service started.')
        
    except Exception as e:
        print('Failed to start services.\nException:\n==========')
        print(e)


if __name__ == '__main__':
    start_services()

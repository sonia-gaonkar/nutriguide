
"""Controller API Routes utilities.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import os

#to check the availability of the port
def is_available(*ports) -> bool:
    """
    Check if a service is available.
    Check if the port used by a service is in use or not.

        :param ports: Single or multiple ports.
        :return: True if service is available else False.
    """
    # iteratre on the ports and check the status
    for port in ports:
        pid = os.popen(f'lsof -t -i:{port}').read().strip()
        if not pid:
            return False
    return True

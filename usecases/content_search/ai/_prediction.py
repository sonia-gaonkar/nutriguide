
"""Content Search prediction.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import sys, os

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

#watsonx libraries
from ibm_watson_machine_learning.foundation_models import Model
from utils.configuration_utils import get_logger
from utils.latch import CountDownLatch
import pandas as pd
import json


logger = get_logger('Content Search')
latch = CountDownLatch(5)

global search_cache
search_cache = {}

# This method is written for analysis use case which generate result in JSON format.
def analysis(mod : Model, prompt : str):

    global model 
    model = mod

    outputs =[]

    gen_parms_override = None
    generated_response = model.generate( prompt, gen_parms_override)
    result = generated_response['results'][0]['generated_text']
    logger.info(msg=f'Result : {result}')
    
    #Converting result got from WATSONX into JSON format.
    result_json = result.replace('```json','').strip()
    result_json1 = json.loads(result_json.replace('```','').strip())
    outputs.append(result_json1)
    return outputs

# This method is written for chat analysis APIS which return text from watsonx api
def chat_analysis(mod : Model, prompt : str):
    global model 
    model = mod

    outputs ={}
    predictions = []

    gen_parms_override = None
    generated_response = model.generate( prompt, gen_parms_override)
    result = generated_response['results'][0]['generated_text']
    logger.info(msg=f'Result : {result}')
    outputs['response'] = result.strip()
    predictions.append(outputs)
    
    return predictions
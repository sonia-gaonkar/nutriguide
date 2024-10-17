
"""Content Search operations.
"""

__author__ = 'Sahil Mulla'

# built-in imports
import sys, os

# fastapi imports
from fastapi import HTTPException, status, Header

HOME_PATH = os.environ['TOP'] + '/nutriguide'
sys.path.append(HOME_PATH)

# package imports
from ._prediction import analysis,chat_analysis
from utils import schemas_utils as schemas
from utils.configuration_utils import get_logger, _get_configparser
from utils.constant_utils import MessageCode, Constants
from utils.common_utils import CommonUtils

#watsonx libraries
from ibm_watson_machine_learning.foundation_models import Model

logger = get_logger('Content Search')
_CONFIG = _get_configparser()

global model_cache
model_cache = {}

# Analysis of the input data
def predict(data: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    logger.info(msg=f'Request data for prediction {data}')
    
    # Check whether JWT token start with '#' if yes then only it move forward
    if not authorization.startswith('#'):
        logger.error(msg=f"Unauthorised user")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Unautorized User...')
    
    #initialization of required things by reading from configuration file
    NAME = 'WATSON_CONF'
    url =  _CONFIG[NAME]['url']
    api_key=  _CONFIG[NAME]['api_key']
    project_id = _CONFIG[NAME]['project_id']
    my_credentials = { 
            "url"    : url, 
            "apikey" : api_key
    } 
    space_id = None
    verify = None
    
    # Declaration of the variable which requires for proccessing
    prompt_txt = ''
    const_model = ''
    model_id = ''
    gen_parms = {}
    predictions = []
    actual_result = {}
    global model
    action = data.action
    
    """
        In This section we identify the action which user want to do.
         : Initialize the below things as per use case:
            -max_tokens
            -model_id
            -gen_parms
        
    """
    match action:
        case 'IMAGE_ANALYSIS':
            image_url = data.image_url
            max_tokens = 2000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
            }
            
            # Replacing input values into prompt
            prompt_txt = f"""Analyze the given input image and identify all food items present. Categorize these food items based on their impact on women's health with PCOD/PCOS into two categories: 'Good' and 'Bad.' For each food item, explain why it is categorized as good or bad for managing PCOD/PCOS. Take into account factors such as glycemic index, hormone regulation, inflammation, and overall nutritional value. Provide a detailed analysis explaining how these foods influence PCOD symptoms either positively or negatively.\nGenerated output should be in JSON format only.Do not add ``` at start or end of result.\nInput:{image_url}\nOutput:"""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
        
        case 'WEEKLY_DIET_PLAN' :
            personal_data = data.entries
            max_tokens = 3000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Create a weekly diet plan for a {personal_data[0]}. Focus on balanced meals that promote hormonal balance and avoid foods that could aggravate PCOS symptoms. Please ensure each day includes three meals and two snacks, with clear portion sizes and nutritional balance. Additionally, suggest foods rich in fiber, lean proteins, and low-glycemic index carbs. Avoid processed foods, sugary drinks, and excessive dairy. Incorporate a variety of vegetables, whole grains, and herbal teas. Include any recommendations for supplements or hydration.Output should be only in JSON format.Do not add ``` at start or end of result."""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
        
        case 'WEEKLY_EXCERSIZE_PLAN' :
            personal_data = data.entries
            max_tokens = 3000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Generate a personalized weekly physical activity plan for {personal_data[0]} focusing on her pre-conception health (PCD). She is moderately active, enjoys light jogging, yoga, and swimming, and aims to improve her overall fitness, including core strength, flexibility, and stamina. The plan should balance cardio, strength training, and relaxation exercises, with daily activities tailored to her current fitness level, providing variety while avoiding high-intensity workouts. Include recommended rest days, and consider safety for reproductive health.Output should be only in JSON format.Do not add ``` at start or end of result."""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
        
        case 'FOOD_GROUP_OVERVIEW' :
            personal_data = data.entries
            max_tokens = 2000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Provide an overview of the major food groups, including their classifications, examples, and the nutritional benefits they offer on the basis of {personal_data[0]} women personal information. Organize the information in a clear format, and include details on recommended daily servings for a balanced diet. Output should be only in JSON format.Do not add any heading, extra information or note."""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
            
        case 'HYDRATION_TIPS' :
            personal_data = data.entries
            max_tokens = 2000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Generate a list of practical hydration tips tailored for {personal_data[0]} women. Include advice on daily water intake, hydration strategies during exercise, and suggestions for incorporating more fluids into their diet. Additionally, mention the importance of hydration for women's health and wellness. Output should be only in JSON format as hydration_tips : [tip1,tip2,.....].Do not add any heading, extra information or note."""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
        
        case 'NUTRITIONAL_MYTHS_FACTS' :
            personal_data = data.entries
            max_tokens = 2000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Please provide a list of common nutritional myths and the corresponding facts that debunk them on the basis of {personal_data[0]} of a person. Include at least five myths, along with explanations for why they are misconceptions and the evidence supporting the correct information. Focus on areas like dieting, food groups, and nutritional supplements.Output should be only in JSON format. Do not add any heading, extra information or note."""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
            
        case 'SEASONAL_FOOD_GUIDE' :
            personal_data = data.entries
            max_tokens = 4000
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            #model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 500,
                                "repetition_penalty": 1.11
                        }
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
            
            # Replacing input values into prompt
            prompt_txt = f"Create a seasonal food guide that highlights the best fruits, vegetables, and other produce available in each season (spring, summer, fall, and winter) for {personal_data[0]} personal information of a person. For each season, include the following:\n\nA list of 5-10 seasonal fruits and vegetables, with brief descriptions of their taste, nutritional benefits, and popular uses.\nA selection of 2-3 seasonal recipes that showcase these ingredients.\nTips for selecting, storing, and preparing each type of produce.\nInformation on local farms or markets where these seasonal foods can be sourced.\nMake sure the guide is engaging and encourages readers to explore seasonal eating.\nOutput should be only in JSON format. Do not add any heading, extra information or note/json keyword."
            
    #Check for watsonx model
    if const_model not in model_cache.keys():
            logger.info(msg=f'Generating new Model..')
            model = Model( model_id, my_credentials, gen_parms, project_id, space_id, verify)
            model_cache[const_model] = model
    else:
            logger.info(msg=f'Using already generated model..')
            model = model_cache[const_model]
            
    predictions = analysis(model,prompt_txt)
    
    actual_result['predictions'] = predictions
    logger.info(msg=f'Actual Result : {actual_result}')
 
    if not actual_result:
        logger.error(msg="Cannot predict with the input given for the 'Feature extraction', try again with a different prompt")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=CommonUtils.get_error_message(MessageCode.INVALID_INPUT, Constants.GENERIC))
    logger.info(msg=f'{actual_result}')
    return actual_result


def predict_chat(data: schemas.AnalysisNutritionsIn, authorization: str = Header(...)):
    logger.info(msg=f'Request data for prediction {data}')
    
    if not authorization.startswith('#'):
        logger.error(msg=f"Unauthorised user")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Unautorized User...')
    
    #initialization of required things by reading from configuration file
    NAME = 'WATSON_CONF'
    url =  _CONFIG[NAME]['url']
    api_key=  _CONFIG[NAME]['api_key']
    project_id = _CONFIG[NAME]['project_id']
    my_credentials = { 
            "url"    : url, 
            "apikey" : api_key
    } 
    space_id = None
    verify = None
    
    # Declaration of the variable which requires for proccessing
    prompt_txt = ''
    const_model = ''
    model_id = ''
    gen_parms = {}
    predictions = []
    actual_result = {}
    global model
    action = data.action
    match action:
        case 'USER_QUERY' :
            query = data.query
            personal_data = data.entries
            max_tokens = 500
            #model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            model_id = "mistralai/mixtral-8x7b-instruct-v01"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 100,
                                "repetition_penalty": 1.11
                        }
            
            # Replacing input values into prompt
            prompt_txt = f"""Using the following personal information, answer the questions provided below in a detailed and personalized manner. The answers should take into account the individual's dietary preferences, restrictions and health goals, offering useful advice or suggestions where applicable. Ensure the responses are conversational, informative, and aligned with the person's lifestyle and needs.\n\nPersonal Information:\n{personal_data}\n\nQuestions:\n{query}\n\nGenerate personalized answers for each question, offering practical tips and insights based on the individual’s unique profile.\nResponse:"""
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
        
        case 'USER_IMAGE_QUERY' :
            personal_data = data.entries
            image_url = data.image_url
            query = data.query
            max_tokens = 500
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 100,
                                "repetition_penalty": 1.11
                        }
           
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
            
            # Replacing input values into prompt
            prompt_txt = f"""Analyze the given image data. Below are the details of a person's profile, along with an image that needs to be analyzed. Based on the image and the provided personal information, answer the query that follows.\n\nPersonal Information:\n\n{personal_data[0]}\nImage Data: {image_url}\nQuery:{query}\nAnswer:"""
        
        case 'USER_IMAGE' :
            personal_data = data.entries
            image_url = data.image_url
            max_tokens = 500
            model_id = "meta-llama/llama-3-2-90b-vision-instruct"
            gen_parms   = {
                                "decoding_method": "greedy",
                                "max_new_tokens": max_tokens,
                                "min_new_tokens": 100,
                                "repetition_penalty": 1.11
                        }
            
            #This is for performance optimization. We had stored this key and object of LLM model into a dict and used in future
            const_model = str(project_id) + '_' + str(model_id) + '_' + action + '_' + str(max_tokens)
            
            # Replacing input values into prompt
            prompt_txt = f"""You are a model that analyzes images to assess their health implications based on personal information. Given the following details, determine whether the image is good for health.\n\nPersonal Information:\n\n{personal_data[0]}\nImage Data: {image_url}\n\nTask: Based on the image and personal information, evaluate and respond whether the image is good for health or not, providing a brief explanation for your conclusion.\n\nResponse:"""
            
    #Check for watsonx model
    if const_model not in model_cache.keys():
            logger.info(msg=f'Generating new Model..')
            model = Model( model_id, my_credentials, gen_parms, project_id, space_id, verify)
            model_cache[const_model] = model
    else:
            logger.info(msg=f'Using already generated model..')
            model = model_cache[const_model]
            
    predictions = chat_analysis(model,prompt_txt)
    
    actual_result['predictions'] = predictions
    logger.info(msg=f'Actual Result : {actual_result}')
 
    if not actual_result:
        logger.error(msg="Cannot predict with the input given for the 'Feature extraction', try again with a different prompt")
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail=CommonUtils.get_error_message(MessageCode.INVALID_INPUT, Constants.GENERIC))
    logger.info(msg=f'{actual_result}')
    return actual_result
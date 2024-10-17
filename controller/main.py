
"""Controller FastAPI application.
"""

__author__ = 'Sahil Mulla'


# fastapi imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# router imports
from .routes import services_router, prediction_router

#creating the instance of FastAPI with title, description and version
app = FastAPI(title='WatsonX Integration APIs',
              description='Documentation for WatsonX Integration REST APIs', version='1.0.0')


# adding middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router=services_router)
app.include_router(router=prediction_router)



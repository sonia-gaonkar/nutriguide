
"""Content Search FastAPI application.
"""

__author__ = 'Sahil Mulla'

# fastapi imports
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# package imports
from .routes import router

# Instance of FastAPI application
app = FastAPI(title='Content Search API', description='Watsonx Auto-Content Search service APIs.', version='v1')

# Adding middleware for the api
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(router=router)


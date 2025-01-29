from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mlflow
import requests
from requests.auth import HTTPBasicAuth
import os
import numpy as np
import logging

# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Ensure this matches your front-end origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define a request body model using Pydantic to match the features of the Iris dataset
class InputData(BaseModel):
    sepal_length: float
    sepal_width: float
    petal_length: float
    petal_width: float

@app.post("/predict")
async def predict(data: InputData):
    # Load the MLflow model
    try:
        # Set our tracking server uri for logging
        mlflow_tracking_uri = os.getenv("MLFLOW_TRACKING_URI")
        mlflow.set_tracking_uri(uri=mlflow_tracking_uri)

        model_uri = "models:/logistic_regression_basic@champion"
        model = mlflow.pyfunc.load_model(model_uri)
        logger.info("Model loaded successfully")

    except Exception as e:
        logger.error(f"Model loading failed: {e}")
        raise HTTPException(status_code=500, detail=f"Model loading failed: {e}")

    try:
        # Convert input data to numpy array
        input_features = np.array([[data.sepal_length, data.sepal_width, data.petal_length, data.petal_width]])
        prediction = model.predict(input_features)  # Make a prediction using the loaded model
        logger.info(f"Prediction successful: {prediction}")

        return {"prediction": int(prediction[0])}  # Return the prediction as JSON
    except Exception as e:
        logger.error(f"An error occurred during prediction: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred during prediction: {e}")

@app.post("/train")
async def train():
    try:
        dag_trigger_url = "http://airflow-webserver:8080/api/v1/dags/retrain_model/dagRuns"

        # Load credentials from environment variables
        username = os.getenv('_AIRFLOW_WWW_USER_USERNAME')
        password = os.getenv('_AIRFLOW_WWW_USER_PASSWORD')

        # Basic authentication credentials from environment variables
        auth = HTTPBasicAuth(username, password)

        response = requests.post(dag_trigger_url, json={}, auth=auth)

        if response.status_code != 200:
            logger.error(f"Failed to trigger the DAG: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail=f"Failed to trigger the DAG: {response.text}")

        logger.info("DAG triggered successfully")
        return {"message": "DAG triggered successfully"}
    except Exception as e:
        logger.error(f"An error occurred while triggering the DAG: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred while triggering the DAG: {e}")
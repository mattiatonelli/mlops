from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from datetime import datetime
import logging

import mlflow
from mlflow import MlflowClient
from mlflow.models import infer_signature
from mlflow.exceptions import RestException
import os

from sklearn import datasets
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

from random import randint

def train(**kwargs):
    # Set up logging
    logger = logging.getLogger("airflow.task")

    # Set a time tag
    current_time = datetime.now().strftime('%Y-%m-%d_%H:%M')

    # Load the Iris dataset
    X, y = datasets.load_iris(return_X_y=True)

    # Split the data into training and test sets
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Define the model hyperparameters
    params = {
        "solver": "lbfgs",
        "max_iter": 1000,
        "multi_class": "auto",
        "random_state": randint(1, 8888),
    }

    model_name = "logistic_regression_basic"

    # Train the model
    model = LogisticRegression(**params)
    model.fit(X_train, y_train)

    # Predict on the test set
    y_pred = model.predict(X_test)

    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)

    mlflow_tracking_uri = os.getenv("MLFLOW_TRACKING_URI")

    # Set our tracking server uri for logging
    mlflow.set_tracking_uri(uri=mlflow_tracking_uri)

    # Create a new MLflow Experiment
    mlflow.set_experiment("Iris Dataset")

    # Start an MLflow run
    with mlflow.start_run(run_name="LogisticRegression"):
        # Log the hyperparameters
        mlflow.log_params(params)

        # Log the accuracy metric
        mlflow.log_metric("accuracy", accuracy)

        # Set tags that can be used to remind ourselves what this run was for
        mlflow.set_tag("Training Info", f"Basic LR model for iris data ran on {current_time}")

        # Infer the model signature
        signature = infer_signature(X_train, model.predict(X_train))

        # Log the model
        mlflow.sklearn.log_model(
            sk_model=model,
            artifact_path="iris_model",
            signature=signature,
            input_example=X_train,
            registered_model_name=model_name,
        )

        client = MlflowClient()
        model = client.get_registered_model(model_name)
        logger.info(model)
        # Get the latest version of the registered model
        filter_string = f"name='{model_name}'"
        latest_versions = client.search_model_versions(filter_string)
        latest_version = max(int(version.version) for version in latest_versions)
        logger.info(f"VERSION {type(latest_version)}")

        # Update the alias to point to the latest model version
        client.set_registered_model_alias(model_name, "champion", str(latest_version))

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2023, 1, 1),
}

with DAG('retrain_model', default_args=default_args, schedule_interval=None) as dag:
    train_model_task = PythonOperator(
        task_id='train',
        python_callable=train,
        provide_context=True,
    )
# Dockerfile for MLflow
FROM python:3.12.8-slim-bullseye

WORKDIR /mlflow

RUN pip install mlflow

EXPOSE 5000

CMD ["mlflow", "server", "--host", "0.0.0.0", "--port", "5000"]
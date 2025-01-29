# Custom Dockerfile
FROM apache/airflow:2.10.4

# This fixes permission issues on Linux.
# The airflow user should have the same UID as the user running Docker on the host system.
ARG AIRFLOW_UID

USER root
RUN usermod -u ${AIRFLOW_UID} airflow \
    && find / -path /proc -prune -o -user 50000 -exec chown -h airflow {} \;

USER airflow

# Install required Python packages
RUN pip install --no-cache-dir \
    scikit-learn \
    mlflow
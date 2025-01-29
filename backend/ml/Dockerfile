FROM python:3.12.8-slim-bullseye

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

# Copy application files and set ownership
COPY --chown=1000:0 /models/ src/main.py /app/

EXPOSE 8000

CMD ["fastapi", "run", "main.py", "--host", "0.0.0.0", "--port", "8000"]
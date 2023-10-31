FROM python:3.10-bullseye

WORKDIR /backend
COPY . .
RUN pip install -r requirements.txt 
CMD ["uvicorn", "main:app", "--host", ""]
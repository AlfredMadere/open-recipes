FROM python:3.10-bullseye

WORKDIR /backend
COPY . .
RUN pip install -r requirements.txt 
EXPOSE 8000
CMD ["python3","open-recipes/main.py"]
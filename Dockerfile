# Set base image (host OS)
FROM python:3.9-slim-buster

#install os dependencies
RUN apt-get update && \
    apt-get install -y curl

# By default, listen on port 5002
EXPOSE 80

# Set the working directory in the container
WORKDIR .

# Copy the dependencies file to the working directory
COPY requirements.txt .


COPY static/logos ./static/logos

# Install any dependencies
RUN pip install -r requirements.txt

#COPYING .aws to your image, note this is not the secure way to do this, only do this if you keep your images private(e.g. in a Private ECR Repo)
RUN mkdir .aws
COPY .aws /root/.aws

COPY app.py .

# Specify the command to run on container start
CMD [ "python", "app.py", "--prod", "y"]
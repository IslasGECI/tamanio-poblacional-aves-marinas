FROM python:3
WORKDIR /workdir
COPY . .
RUN apt-get update && apt-get install --yes \
    curl \
    docker.io \
    make
RUN pip install --upgrade pip && pip install \
    black \
    codecov \
    flake8 \
    mutmut \
    pylint \
    pytest \
    pytest-cov
RUN curl --location "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" --output /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

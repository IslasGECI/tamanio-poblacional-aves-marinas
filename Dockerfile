FROM ubuntu:18.04
WORKDIR /workdir
RUN apt-get update && apt-get install --yes \
    curl \
    docker.io \
    make
RUN curl --location "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" --output /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

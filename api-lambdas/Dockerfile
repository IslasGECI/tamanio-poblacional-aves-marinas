FROM python:3
COPY . /workdir/
WORKDIR /workdir
RUN pip install \
    flask \
    pandas \
    scipy
CMD make

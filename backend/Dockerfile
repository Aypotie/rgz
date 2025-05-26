FROM ubuntu:24.04

RUN apt-get update && apt-get install -y \
    build-essential \
    g++ \
    libpqxx-dev \
    libpq-dev \
    libasio-dev \
    libssl-dev \
    libkrb5-dev \
    libgssapi-krb5-2 git cmake make

RUN git clone https://github.com/trusch/libbcrypt
RUN mkdir libbcrypt/build
RUN cd libbcrypt/build && cmake ..
RUN cd libbcrypt/build && make
RUN cd libbcrypt/build && make install
RUN cd libbcrypt/build && ldconfig


WORKDIR /app

COPY ./lib /app/lib
COPY ./src /app/src
COPY ./main.cpp /app/main.cpp

RUN g++ main.cpp -lpqxx -lpq -lpthread -lcrypto -lbcrypt -o /app/main

COPY .env.docker /app/.env

ENTRYPOINT ["./main"]
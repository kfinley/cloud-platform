FROM jwilder/dockerize as dockerize

FROM mcr.microsoft.com/dotnet/sdk:6.0-alpine as final
ARG Port

COPY --from=dockerize /usr/local/bin/dockerize /usr/local/bin

# ENV DOCKERIZE_VERSION v0.6.1

# RUN apt-get update && apt-get -y install wget procps && \
#     wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
#     tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
#     rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz; \
#     apt-get update; \
#     apt-get install -y --no-install-recommends apt-utils && \
#     apt-get install curl unzip -y && \
#     curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -l /vsdbg;

RUN apk update && \
    apk add --upgrade procps

VOLUME /Api
VOLUME /vsdbg

EXPOSE ${Port}

WORKDIR /Api/bin/Debug/net6.0

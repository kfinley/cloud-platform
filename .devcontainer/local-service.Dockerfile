FROM jwilder/dockerize as dockerize

FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine as final
ARG Port

COPY --from=dockerize /usr/local/bin/dockerize /usr/local/bin

RUN apk update && \
    apk add --upgrade procps

VOLUME /Api
VOLUME /vsdbg

EXPOSE ${Port}

WORKDIR /Api/bin/Debug/net5.0

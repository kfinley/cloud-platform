FROM mcr.microsoft.com/dotnet/core/aspnet:3.1-buster-slim

WORKDIR /sls-offline

RUN apt-get update -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash --debug
RUN apt-get install wget nodejs -yq

RUN wget https://packages.microsoft.com/config/debian/10/packages-microsoft-prod.deb

# Register the Microsoft repository GPG keys
RUN dpkg -i packages-microsoft-prod.deb

# Update the list of products
RUN apt-get update

# Install PowerShell
RUN apt-get install -y powershell

VOLUME /sls-offline

EXPOSE 3002
EXPOSE 4002
EXPOSE 4569

CMD ["sleep", "infinity"]

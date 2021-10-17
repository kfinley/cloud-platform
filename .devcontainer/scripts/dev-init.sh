#!/bin/bash

echo
echo 'Running dev initialization script...'
echo

# Open up docker socket for docker-in-docker as non-root
sudo chmod 777 /var/run/docker-host.sock

# Run npm & lerna installs
if ! [ -d './node_modules' ]; then
    npm install
    npm run bootstrap:1
else
    echo 'Existing repo setup... skipping npm & lerna setup.'
fi

echo
if [[ $(dotnet --list-sdks) == *"3.1"* ]]; then
  echo 'Dotnet core 3.1 SDK found.'
else
  echo 'Installing dotnet core 3.1 SDK for AWS Lambda support...'
  # Install .net 3.1 for building lambda packages
  curl -sSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin --runtime aspnetcore --version 3.1.17
fi

echo
if [[ $(dotnet lambda) == *'Amazon Lambda Tools for .NET Core applications'* ]]; then
  echo 'Skipping dotnet tools install...'
else
  # Install additional .net tools (ef, lambda, etc.)
  ./.devcontainer/scripts/install-dotnet-tools.sh
fi

echo
echo 'Building lambda packages and dotnet projects...'
# build .net bits
# Important to build lambda packages first b/c they use 3.1.
# If done after building the solution then 3.1 dlls will be left
# in some locations used by 5.0 services.

## Configure .net lambda package builds here...
# npm run dotnet:package

dotnet build ./services/services.sln

echo
echo 'Restarting containers...'
# ensure services, sls, and vite dev client are started
npm run containers:restart

echo
echo -e Dev setup complete! "\xF0\x9f\x8d\xba"
#!/bin/bash

# Check if vsdbg is present.
# If it is then we're in an existing devcontainer that's been setup.
# This is just a simple quick and dirty way to check.
# This can also be used to reinstall an environment (such as local with VS dev containers)
if ! [ -f "./.devcontainer/vsdbg/vsdbg" ]; then

    echo "Installing VS remote debugger..."
    echo ''
    # Set the runtime to linux-musl-x64 since we're using alpine images to run dotnet services in devcontainer
    curl -sSL https://aka.ms/getvsdbgsh | bash /dev/stdin -v latest -r linux-musl-x64 -l ./.devcontainer/vsdbg

    if [ ! -n "$(grep "^github.com " ~/.ssh/known_hosts)" ]; then
      ssh-keyscan github.com >> ~/.ssh/known_hosts 2>/dev/null;
    fi

    echo "Updating git submodules..."
    echo ''
    # Pull down submodules (customized serverless-offline plugins)
    git submodule update --init --recursive

    echo 'Building Serverless-Offline'
    echo ''
    # Build Serverless-Offline
    cd submodules/serverless-offline && npm i

else
    echo "Existing dev container... skipping installs."
fi

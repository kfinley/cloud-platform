#!/bin/bash
#TODO: guard this so script is only run from root of the workspace

dotnet tool install -g Amazon.Lambda.Tools
dotnet new -i "Amazon.Lambda.Templates::*"
dotnet tool install -g dotnet-ef
dotnet tool install -g dotnet-outdated-tool
dotnet tool install -g dotnet-format

export PATH="$PATH:/home/vscode/.dotnet/tools"

export DOTNET_CLI_TELEMETRY_OPTOUT="true"

cat << \EOF >> ~/.bashrc
export PATH="$PATH:/home/vscode/.dotnet/tools"
EOF

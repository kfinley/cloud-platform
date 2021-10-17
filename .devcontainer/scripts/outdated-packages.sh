#!/bin/bash


for PACKAGE_PATH in packages/*; do
  
  IFS=/ read PACKAGE PACKAGE_NAME <<< "$PACKAGE_PATH"
  # In case the @cloud-platform packages were cloned using full name
  # remove 'cloud-platform-' from the packate name. i.e. cloud-platform-api-client -> api-client
  PACKAGE_NAME=${PACKAGE_NAME/cloud-platform-/}
  lerna --stream --scope=@cloud-platform/$PACKAGE_NAME exec -- npm outdated
done

lerna --stream --scope=@cloud-platform/websockets exec -- npm outdated

npm outdated

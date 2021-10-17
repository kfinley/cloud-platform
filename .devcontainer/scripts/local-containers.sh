#!/bin/bash

OPERATION=$1

if [ operation = '' ]; then

$OPERATION=start

fi

docker $OPERATION cloud-platform.user
docker $OPERATION cloud-platform.sls
docker $OPERATION cloud-platform.web
docker $OPERATION cloud-platform.storybooks

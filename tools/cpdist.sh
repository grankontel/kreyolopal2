#!/bin/bash

if [ -z "$1" ]
  then
    echo "No app provided"
    exit 1
fi

path=`realpath "${BASH_SOURCE:-$0}"`
DIR_PATH=`dirname $path`
APP=$1
APP_PATH=`realpath "${DIR_PATH}/../apps/${APP}"`
DIST_PATH=`realpath "${DIR_PATH}/../apps/${APP}/dist"`
BUILD_PATH="${APP_PATH}/../../build/${APP}"

if ! [ -d "$DIST_PATH" ]; then
    echo "$DIST_PATH is not a directory."
    exit 1
fi

if [ -d "$BUILD_PATH" ]; then
    rm -rf ${BUILD_PATH}
fi

cp -R ${DIST_PATH} ${BUILD_PATH}

# cd ${BUILD_PATH}/
# npm install --omit=dev


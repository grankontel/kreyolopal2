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
SHARED_PATH=`realpath "${DIR_PATH}/../shared"`
BUILD_PATH="${APP_PATH}/../../build/${APP}"

if ! [ -d "$APP_PATH" ]; then
    echo "$APP_PATH is not a directory."
    exit 1
fi

echo "The current directory path is" $DIR_PATH
echo "The app directory path is" $APP_PATH
echo "The build directory path is" $BUILD_PATH
echo "The shared directory path is" $SHARED_PATH

# mkdir -p ${BUILD_PATH}/.next/static

# cp ${APP_PATH}/package.json ${BUILD_PATH}/

# cd ${BUILD_PATH}/
# npm install --omit=dev

cp -R ${APP_PATH}/.next/standalone/apps/${APP} ${BUILD_PATH}/
cp -R ${SHARED_PATH}/public ${BUILD_PATH}/
cp -R ${APP_PATH}/.next/static ${BUILD_PATH}/.next/static

node ${DIR_PATH}/remove_dev.js ${BUILD_PATH}/package.json
#!/bin/bash

path=`realpath "${BASH_SOURCE:-$0}"`
DIR_PATH=`dirname $path`
FRONT_PATH=`realpath "${DIR_PATH}/../apps/front"`
BUILD_PATH="${DIR_PATH}/../build"

if [ -d "$BUILD_PATH" ]; then
    rm -rf ${BUILD_PATH}
fi

mkdir -p ${BUILD_PATH}/data/db
mkdir -p ${BUILD_PATH}/data/mongodb

${DIR_PATH}/cpnext.sh dico
${DIR_PATH}/cpdist.sh server

cd  ${BUILD_PATH}/dico
NODE_ENV='production' npm install --omit=dev --package-lock-only

cd  ${BUILD_PATH}/server
NODE_ENV='production' npm install --omit=dev --package-lock-only

cp -R ${FRONT_PATH}/build ${BUILD_PATH}/www/


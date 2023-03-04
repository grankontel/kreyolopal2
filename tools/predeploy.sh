#!/bin/bash

path=`realpath "${BASH_SOURCE:-$0}"`
DIR_PATH=`dirname $path`
BUILD_PATH="${DIR_PATH}/../build"

if [ -d "$BUILD_PATH" ]; then
    rm -rf ${BUILD_PATH}
fi

mkdir -p ${BUILD_PATH}/data/db
mkdir -p ${BUILD_PATH}/data/mongodb

${DIR_PATH}/cpnext.sh dico
${DIR_PATH}/cpdist.sh server

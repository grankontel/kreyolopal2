#!/bin/bash

path=`realpath "${BASH_SOURCE:-$0}"`
DIR_PATH=`dirname $path`
FRONT_PATH=`realpath "${DIR_PATH}/../apps/front"`
ADMIN_PATH=`realpath "${DIR_PATH}/../apps/admin"`
SRV2_PATH=`realpath "${DIR_PATH}/../apps/server2"`
BUILD_PATH="${DIR_PATH}/../build"

if [ -d "$BUILD_PATH" ]; then
    rm -rf ${BUILD_PATH}
fi

mkdir -p ${BUILD_PATH}/data/db
mkdir -p ${BUILD_PATH}/data/mongodb

${DIR_PATH}/cpnext.sh dico
${DIR_PATH}/cpnext.sh admin
${DIR_PATH}/cpdist.sh server
${DIR_PATH}/cpdist.sh server2

cd  ${BUILD_PATH}/dico
NODE_ENV='production' npm install --omit=dev --package-lock-only

cp -R ${ADMIN_PATH}/prisma ${BUILD_PATH}/admin/

cd  ${BUILD_PATH}/admin
NODE_ENV='production' npm install --omit=dev --package-lock-only
sed -i -e 's!"http://__API_PATH__"!(process.env.API_SERVER || "") + "/api/:path*"!g' ./server.js
sed -i -e 's!"http://__POSTGREST_PATH__"!(process.env.POSTGREST_SERVER || "") + "/:path*"!g' ./server.js

cd  ${BUILD_PATH}/server
NODE_ENV='production' npm install --omit=dev --package-lock-only

cd  ${BUILD_PATH}/server2
NODE_ENV='production' npm install --omit=dev --package-lock-only

cp -R ${FRONT_PATH}/build ${BUILD_PATH}/www/

# cp -R ${SRV2_PATH}/build ${BUILD_PATH}/server2/
# cp -R ${SRV2_PATH}/package.json ${BUILD_PATH}/server2/package.json
# node ${DIR_PATH}/remove_all.js ${BUILD_PATH}/server2/package.json

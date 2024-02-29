#!/bin/sh

# Root Certificate
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout localRootCA.key -out localRootCA.pem -subj "/C=FR/CN=Local-Root-CA"
openssl x509 -outform pem -in localRootCA.pem -out localRootCA.crt

openssl req -new -nodes -newkey rsa:2048 -keyout kreyolopal.local.key -out kreyolopal.local.csr -subj "/C=FR/L=Paris/O=Local-Certificates/CN=kreyolopal.local"
openssl x509 -req -sha256 -days 1024 -in kreyolopal.local.csr -CA localRootCA.pem -CAkey localRootCA.key -CAcreateserial -extfile domains.ext -out kreyolopal.local.pem

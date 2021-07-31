#!/bin/bash

npm run build

cd dist

npm i --production

npm run schema-sync

npm start

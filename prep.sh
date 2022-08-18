#!/bin/sh

yarn build

yarn compile --scope=@ac/fn-two

cd out

yarn

sed -i '' '5i\
  "main": "./apps/functions/domain-one/fn-two/dist/index.js",
' package.json

gcloud functions deploy domain-one-fn-two \
--gen2 \
--runtime=nodejs16 \
--region=us-central1 \
--source=. \
--entry-point=domainOneFunctionTwo \
--trigger-http \
--allow-unauthenticated

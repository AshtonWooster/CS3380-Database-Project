#!/bin/bash
npm install .
npx babel app/*.jsx -d static/
node start-database.mjs
if [ "$1" == "y" ]; then
    node populate-db.mjs
fi
node server.mjs
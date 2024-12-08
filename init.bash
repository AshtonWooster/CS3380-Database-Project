#!/bin/bash
npm install .
npx babel app/*.jsx -d static/
node server.mjs

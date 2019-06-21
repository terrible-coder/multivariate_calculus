@echo off
echo Bundling for browser...
call "node_modules/.bin/browserify" "./release/app.js" -o mcalc.js
echo Done bundling.

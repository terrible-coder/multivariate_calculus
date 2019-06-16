@echo off

if not exist node_modules\browserify (
	echo Bundler not found. Installing Browserify...
	call npm install browserify --save-dev
)

echo Bundling for browser...
call "node_modules/.bin/browserify" "./build/index.js" -o mcalc.js
echo Done bundling.

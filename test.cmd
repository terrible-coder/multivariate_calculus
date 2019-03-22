@echo off

if not exist node_modules\jest (
	echo Unit testing framework not found. Installing Jest...
	call npm install jest --save-dev
	echo Installing type descriptions for better IntelliSense...
	call npm install @types/jest --save-dev
)

if not exist jest.config.js (
	echo Initialising test environment...
	call "node_modules/.bin/jest" --init
)

call "node_modules/.bin/jest"

@echo off
if not exist jest.config.js (
	echo Initialising test environment...
	call "node_modules/.bin/jest" --init
)

call "node_modules/.bin/jest" --config jest.config.js

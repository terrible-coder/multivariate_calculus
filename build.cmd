@echo off

if not exist tsconfig.json (
	call tsc --init
)
echo Transpiling Typescript to plain Javascript...
call tsc
echo Done.
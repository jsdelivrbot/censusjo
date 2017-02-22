@echo off
dir /on /b *.sql
for %%f in (*.sql) do (
	echo processing %%f
	sqlplus gispublish/GISPUBLISH@orclgis2 @%%f
)

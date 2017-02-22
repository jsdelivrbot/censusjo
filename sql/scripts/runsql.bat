@echo off
dir /on /b 2015*.sql
for %%f in (2015*.sql) do (
	echo processing %%f
	sqlplus gispublish/GISPUBLISH@orclgis2 @%%f
)

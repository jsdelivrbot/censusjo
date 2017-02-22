SET Day=%Date:~7,2%
SET Month=%Date:~4,2%
SET Year=%Date:~10,4%
SET Counter=1

:loop
SET scriptName=%Year%%Month%%Day%_%Counter%
echo %scriptName%
if exist "%scriptName%.sql" (
 set /a Counter=1+%Counter% 
 goto loop
 )else (
 copy scriptTemplate.sql %scriptName%.sql
)

start %scriptName%.sql

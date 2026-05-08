@echo off
setlocal
set MAVEN_PROJECTBASEDIR=%~dp0
set MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%
if defined JAVA_HOME (
  set "JAVA_CMD=%JAVA_HOME%\bin\java"
) else (
  set "JAVA_CMD=java"
)
"%JAVA_CMD%" -jar "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" %*
endlocal
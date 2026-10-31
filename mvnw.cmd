@echo off
@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Batch Script for Windows
@REM ----------------------------------------------------------------------------

setlocal

set "DIRNAME=%~dp0"
if "%DIRNAME%" == "" set "DIRNAME=."
if "%DIRNAME:~-1%" == "\" set "DIRNAME=%DIRNAME:~0,-1%"
set "MAVEN_PROJECTBASEDIR=%DIRNAME%"

@REM Load .env variables if present
if exist "%MAVEN_PROJECTBASEDIR%\.env" (
    for /f "usebackq eol=# tokens=1* delims==" %%A in ("%MAVEN_PROJECTBASEDIR%\.env") do (
        set "%%A=%%B"
    )
)

if not "%JAVA_HOME%" == "" (
    if exist "%JAVA_HOME%\bin\java.exe" (
        set "JAVACMD=%JAVA_HOME%\bin\java.exe"
    )
)
if "%JAVACMD%" == "" (
    where java >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "JAVACMD=java"
    ) else (
        if exist "C:\Program Files\Java\jdk-17\bin\java.exe" (
            set "JAVACMD=C:\Program Files\Java\jdk-17\bin\java.exe"
        ) else (
            echo ERROR: Java not found. Please set JAVA_HOME.
            exit /b 1
        )
    )
)

set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"

"%JAVACMD%" -Dmaven.multiModuleProjectDirectory="%MAVEN_PROJECTBASEDIR%" -cp "%WRAPPER_JAR%" org.apache.maven.wrapper.MavenWrapperMain %*

endlocal

@echo off
setlocal enabledelayedexpansion
title Campus Lost ^& Found - Web Application
echo ===================================================================
echo               CAMPUS LOST ^& FOUND - WEB APPLICATION
echo ===================================================================
echo.

REM 1. Check Java
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Java is not installed or not found in system PATH.
    echo Please install Java 17 or higher from https://adoptium.net/
    echo.
    pause
    exit /b 1
)

echo [OK] Java 17 detected.

REM 2. Check MySQL connection on port 3306
echo [CHECK] Testing MySQL connection on localhost:3306...
powershell -Command "$t = New-Object System.Net.Sockets.TcpClient; try { $t.Connect('127.0.0.1', 3306); Write-Host '[OK] MySQL Server is running on port 3306.' -ForegroundColor Green; $t.Close(); exit 0 } catch { Write-Host '[WARNING] MySQL Server is NOT running on port 3306.' -ForegroundColor Yellow; exit 1 }"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo -------------------------------------------------------------------
    echo [ACTION REQUIRED] MySQL Server is not currently running.
    echo.
    echo Option A: If you already have MySQL installed, start the MySQL service:
    echo           net start MySQL80
    echo.
    echo Option B: Run the installer cached on your machine:
    echo           "C:\ProgramData\MySQL\MySQL Installer for Windows\Product Cache\mysql-8.0.43-winx64.msi"
    echo.
    echo Option C: Use XAMPP and click Start on MySQL.
    echo -------------------------------------------------------------------
    echo.
    set /p CONTINUE="Do you want to attempt starting the application anyway? (Y/N): "
    if /i "!CONTINUE!" NEQ "Y" (
        echo Startup aborted.
        pause
        exit /b 1
    )
)

REM 3. Check if Maven is available
where mvn >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [START] Launching via Maven spring-boot:run...
    mvn spring-boot:run
) else (
    echo [INFO] Maven CLI not in PATH. Launching using Java and cached Spring Boot 3.2 libraries...
    powershell -ExecutionPolicy Bypass -File "%~dp0run.ps1"
)

pause

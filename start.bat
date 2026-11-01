@echo off
setlocal enabledelayedexpansion
title Orbit Workspace - Local Launcher

echo ========================================================
echo     ◈ Orbit - The Agent-First Workspace Launcher
echo ========================================================
echo.
echo [1/4] Setting project directory...
cd /d "%~dp0"

echo [2/4] Checking Node.js runtime...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Node.js is required but was not found.
    echo Please install Node.js (v18 or higher) from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [3/4] Ensuring strictly project-isolated dependencies...
echo Note: Dependencies are installed ONLY into this project directory.
echo No global or system-wide packages will be installed.
echo.

rem Check and setup Python virtual environment if python is available
where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    if not exist ".venv\" (
        echo Creating local Python virtual environment (.venv)...
        python -m venv .venv
    )
    if exist ".venv\Scripts\activate.bat" (
        call .venv\Scripts\activate.bat
    )
)

if not exist "node_modules\" (
    echo Local node_modules not found. Installing project dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] npm install failed. Please check your network and try again.
        pause
        exit /b 1
    )
) else (
    echo Project dependencies are verified in ./node_modules.
)

if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo Created local .env configuration.
    )
)

echo [4/4] Launching Orbit workspace...
echo.
echo ========================================================
echo  Server starting on: http://localhost:3000
echo  Admin Mission Control: http://localhost:3000/admin
echo ========================================================
echo.

rem Open default browser after brief pause
start "" "http://localhost:3000"

rem Start full-stack server
call npm run dev

pause

@echo off
setlocal EnableExtensions EnableDelayedExpansion

REM Resolve directories
set "ROOT=%~dp0"
set "APP_DIR=%ROOT%iqranow"
set "SERVER_DIR=%APP_DIR%\server"
set "WEB_DIR=%APP_DIR%\web"
set "VENV_DIR=%ROOT%\.venv"

chcp 65001 >nul

echo ======================================================
echo   IQRA'NOW - Local Dev Runner (Backend + Frontend)
echo   Root: %ROOT%
echo   Backend: %SERVER_DIR%
echo   Frontend: %WEB_DIR%
echo ======================================================

REM Basic tool checks
where node >nul 2>&1
if errorlevel 1 (
  echo [Error] Node.js is not installed or not in PATH. Please install Node LTS: https://nodejs.org/
  echo Script will continue, but frontend may fail to start.
)

where py >nul 2>&1
if errorlevel 1 (
  where python >nul 2>&1
  if errorlevel 1 (
    echo [Error] Python is not installed or not in PATH. Please install Python 3.10+ and retry.
    exit /b 1
  )
)

REM Create venv if missing
if not exist "%VENV_DIR%\Scripts\python.exe" (
  echo [Python] Creating virtual environment at %VENV_DIR% ...
  where py >nul 2>&1 && (py -3 -m venv "%VENV_DIR%") || (python -m venv "%VENV_DIR%")
)

REM Upgrade pip and install backend deps
echo [Python] Upgrading pip and installing backend requirements...
"%VENV_DIR%\Scripts\python.exe" -m pip install --upgrade pip
"%VENV_DIR%\Scripts\python.exe" -m pip install -r "%SERVER_DIR%\requirements.txt"
if errorlevel 1 (
  echo [Error] Failed to install backend dependencies.
  exit /b 1
)

REM Install frontend deps if needed
if not exist "%WEB_DIR%\node_modules" (
  echo [Node] Installing frontend dependencies...
  pushd "%WEB_DIR%"
  call npm install --no-audit --no-fund
  if errorlevel 1 (
    echo [Error] npm install failed.
    popd
    exit /b 1
  )
  popd
)

REM Helpful note for Google STT
if "%GOOGLE_APPLICATION_CREDENTIALS%"=="" (
  echo [Note] GOOGLE_APPLICATION_CREDENTIALS is not set. Google STT will be disabled.
)

REM Start backend (Flask) on port 5000 in a new window
echo [Start] Backend API -> http://localhost:5000
start "IQRA NOW API" /D "%APP_DIR%" "%VENV_DIR%\Scripts\python.exe" -m server.app

REM Start frontend (Vite) on port 5173 in a new window
echo [Start] Frontend Web -> http://localhost:5173
start "IQRA NOW WEB" /D "%WEB_DIR%" cmd /k npm run dev

REM Open browser to the frontend
start "" http://localhost:5173/

echo [OK] Both servers are starting in their own windows. You can close this window.
exit /b 0

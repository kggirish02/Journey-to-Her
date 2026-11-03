@echo off
title The Journey to Her - Launcher
color 0B
echo ========================================================
echo         The Journey to Her 💙 - 3D Game Launcher
echo ========================================================
echo.
echo Checking environment...

python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Python detected! Starting local web server at http://localhost:8000 ...
    echo.
    echo Press Ctrl+C in this window anytime to stop the server.
    echo Opening game in your default browser...
    start "" http://localhost:8000
    python -m http.server 8000
) else (
    echo [INFO] Python not found in PATH. Opening game directly in browser...
    start "" "index.html"
)


@echo off
title WaveGuard AI - Setup & Installation
echo ======================================================================
echo           WAVEGUARD AI - INSTALLATION & SETUP SCRIPT
echo ======================================================================
echo.
echo [1/3] Checking Python and Node.js environment...
python --version
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in your system PATH! Please install Python 3.10+.
    pause
    exit /b 1
)

call npm --version
if errorlevel 1 (
    echo [ERROR] Node.js / npm is not installed or not in your system PATH!
    pause
    exit /b 1
)

echo.
echo [2/3] Installing Python backend dependencies (FastAPI, PyTorch/SciPy/Scikit-learn/ReportLab)...
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install Python dependencies.
    pause
    exit /b 1
)

echo.
echo [3/3] Installing React Frontend dependencies (Three.js, Lucide, Tailwind, Vite)...
cd frontend
call npm install
cd ..
if errorlevel 1 (
    echo [ERROR] Failed to install npm packages.
    pause
    exit /b 1
)

echo.
echo ======================================================================
echo [SUCCESS] WaveGuard AI setup is complete!
echo.
echo 1. To run the full application: Double-click "start.bat"
echo    - Frontend opens at: http://localhost:3000
echo    - Backend API at:    http://127.0.0.1:8000
echo    - Swagger Docs at:   http://127.0.0.1:8000/docs
echo.
echo 2. Academic Project Report (SRM 19-Page Format):
echo    - File: WaveGuard_AI_Academic_Project_Report.pdf
echo ======================================================================
echo.
pause


@echo off
echo ========================================
echo    Novelle - Starting Development
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/3] Installing dependencies...
    call npm install
    echo.
)

echo [2/3] Starting Backend Server...
start "Novelle Backend" cmd /k "npm run server:dev"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend...
start "Novelle Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    Servers Starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to stop all servers...
pause >nul

taskkill /FI "WindowTitle eq Novelle Backend*" /T /F
taskkill /FI "WindowTitle eq Novelle Frontend*" /T /F

echo.
echo All servers stopped.
pause

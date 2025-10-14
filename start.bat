@echo off
echo ================================
echo Email Dumper - Starting Servers
echo ================================
echo.

if not exist "backend\.env" (
    echo [WARNING] backend\.env not found!
    echo Please run install.bat first or copy .env.example to .env
    echo.
    set /p response="Continue anyway? (y/n): "
    if /i not "%response%"=="y" exit /b
)

echo Checking MongoDB connection...
echo (Make sure MongoDB is running if using local database)
echo.

echo Starting Backend Server...
start "Email Dumper - Backend" cmd /k "cd backend && echo Starting Backend Server on http://localhost:5000 && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Email Dumper - Frontend" cmd /k "cd frontend && echo Starting Frontend on http://localhost:3000 && npm start"

echo.
echo ================================
echo Servers Starting!
echo ================================
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Two new command windows will open.
echo Please wait for both servers to start.
echo.
echo Press any key to close this window...
pause >nul

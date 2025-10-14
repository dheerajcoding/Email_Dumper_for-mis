@echo off
echo ================================
echo Email Dumper - Installation
echo ================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)
echo [OK] Node.js found

echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not found!
    exit /b 1
)
echo [OK] npm found

echo.
echo ================================
echo Installing Backend Dependencies
echo ================================
cd backend
echo Running: npm install
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend installation failed
    exit /b 1
)
echo [OK] Backend dependencies installed

if not exist ".env" (
    echo Creating backend .env file...
    copy ".env.example" ".env" >nul
    echo [OK] Backend .env created
    echo [WARNING] Please edit backend\.env with your configuration
)

cd ..

echo.
echo ================================
echo Installing Frontend Dependencies
echo ================================
cd frontend
echo Running: npm install
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend installation failed
    cd ..
    exit /b 1
)
echo [OK] Frontend dependencies installed

if not exist ".env" (
    echo Creating frontend .env file...
    copy ".env.example" ".env" >nul
    echo [OK] Frontend .env created
)

cd ..

echo.
echo ================================
echo Generating Sample Data
echo ================================
cd backend\sample-data
echo Creating sample Excel file...
call node generate-sample.js
if %errorlevel% neq 0 (
    echo [WARNING] Sample data generation failed (optional)
) else (
    echo [OK] Sample data generated
)

cd ..\..

echo.
echo ================================
echo Installation Complete!
echo ================================
echo.
echo Next Steps:
echo 1. Configure backend\.env with your settings
echo 2. Start MongoDB (if using local)
echo 3. Start backend: cd backend ^&^& npm start
echo 4. Start frontend: cd frontend ^&^& npm start
echo.
echo For detailed setup instructions, see:
echo - QUICKSTART.md - Quick setup guide
echo - GMAIL_SETUP.md - Gmail API configuration
echo - README.md - Complete documentation
echo.
pause

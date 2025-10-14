# Email Dumper Startup Script
# This script starts both backend and frontend servers

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Email Dumper - Starting Servers" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠ WARNING: backend\.env not found!" -ForegroundColor Yellow
    Write-Host "Please run install.ps1 first or copy .env.example to .env" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y") {
        exit
    }
}

# Check MongoDB
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow
Write-Host "(Make sure MongoDB is running if using local database)" -ForegroundColor Gray
Write-Host ""

# Start backend in new window
Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host 'Starting Backend Server on http://localhost:5000' -ForegroundColor Green; npm start"

# Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# Start frontend in new window
Write-Host "Starting Frontend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host 'Starting Frontend on http://localhost:3000' -ForegroundColor Green; npm start"

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Servers Starting!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Two new PowerShell windows will open." -ForegroundColor Yellow
Write-Host "Please wait for both servers to start." -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

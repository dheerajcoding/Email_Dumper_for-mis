# Email Dumper - Installation Script
# This script installs all dependencies for both backend and frontend

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Email Dumper - Installation" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm $npmVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location backend
Write-Host "Running: npm install" -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Backend installation failed" -ForegroundColor Red
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Backend .env created from template" -ForegroundColor Green
    Write-Host "⚠ Please edit backend/.env with your configuration" -ForegroundColor Yellow
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Installing Frontend Dependencies" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location frontend
Write-Host "Running: npm install" -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Frontend dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Frontend installation failed" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Create .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Frontend .env created from template" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Generating Sample Data" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Set-Location "backend/sample-data"
Write-Host "Creating sample Excel file..." -ForegroundColor Yellow
node generate-sample.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Sample data generated successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Sample data generation failed (optional)" -ForegroundColor Yellow
}

Set-Location ../..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Configure backend/.env with your settings" -ForegroundColor White
Write-Host "2. Start MongoDB (if using local)" -ForegroundColor White
Write-Host "3. Start backend: cd backend && npm start" -ForegroundColor White
Write-Host "4. Start frontend: cd frontend && npm start" -ForegroundColor White
Write-Host ""
Write-Host "For detailed setup instructions, see:" -ForegroundColor Cyan
Write-Host "- QUICKSTART.md - Quick setup guide" -ForegroundColor White
Write-Host "- GMAIL_SETUP.md - Gmail API configuration" -ForegroundColor White
Write-Host "- README.md - Complete documentation" -ForegroundColor White
Write-Host ""

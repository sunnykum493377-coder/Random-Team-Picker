@echo off
echo ================================
echo Student Team Manager - Setup
echo ================================
echo.

echo Step 1: Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed
echo.

echo Step 2: Installing frontend dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..
echo ✓ Frontend dependencies installed
echo.

echo Step 3: Seeding database...
echo Make sure MongoDB is running!
timeout /t 3 >nul
call npm run seed
if %errorlevel% neq 0 (
    echo WARNING: Database seeding failed. Make sure MongoDB is running.
    echo You can run 'npm run seed' manually later.
)
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo To start the application:
echo 1. Start backend:  npm run server
echo 2. Start frontend: npm run client
echo.
echo Login credentials:
echo Admin: username=admin, password=admin123
echo Students: username=student1, password=pass1 (student1-75)
echo.
pause

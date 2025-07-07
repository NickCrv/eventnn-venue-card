@echo off
echo ========================================
echo    EventNN Venue - Safe Server
echo ========================================
echo.
echo Starting safe HTTP server...
echo This server binds only to localhost to prevent
echo network connectivity issues.
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

python server.py

pause 
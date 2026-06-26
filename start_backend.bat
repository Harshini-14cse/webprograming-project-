@echo off
cd /d "%~dp0backend"
echo Starting LearnBuddy AI Backend...
py -3.14 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
pause

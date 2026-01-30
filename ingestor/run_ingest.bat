@echo off
rem Navigate to project root (assuming script is in ingestor/)
cd /d "%~dp0.."
call .venv\Scripts\activate
set PYTHONPATH=%CD%
python ingestor/orchestrator.py --mode backfill
pause

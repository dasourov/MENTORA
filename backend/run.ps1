# Mentora Backend Runner Script
$Host.UI.RawUI.WindowTitle = "Mentora FastAPI Backend"
Write-Host "Starting Mentora FastAPI Backend on http://localhost:8000..." -ForegroundColor Cyan

Set-Location -Path $PSScriptRoot
python -m uvicorn app.main:app --reload --port 8000 --host 127.0.0.1

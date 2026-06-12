@echo off
REM deploy.bat — commit semua perubahan + push ke GitHub (auto-deploy Vercel).
REM Cara pakai: double-click file ini, ketik pesan commit, Enter.

cd /d "%~dp0"

set /p MSG="Pesan commit: "
if "%MSG%"=="" set MSG=Update website

git add -A
git commit -m "%MSG%"
git push

echo.
echo Selesai. Cek progress build di dashboard Vercel.
pause

@echo off
title Pasa Asansor ERP
color 0B
echo =======================================
echo     PASA ASANSOR ERP SISTEMI
echo =======================================
echo.
echo Lutfen bekleyin, veritabani ve arayuz hazirlaniyor...
echo (Bu siyah ekran acik kalmalidir, kapatirsaniz program da kapanir)
echo.
cd frontend
call npm run electron:dev

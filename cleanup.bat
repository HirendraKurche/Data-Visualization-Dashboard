@echo off
REM Cleanup Script for Performance Dashboard
REM Removes all irrelevant files and dependencies

echo ========================================
echo  PERFORMANCE DASHBOARD CLEANUP SCRIPT
echo ========================================
echo.

echo [1/5] Removing AI/Genkit files...
if exist "src\ai" (
    rmdir /s /q "src\ai"
    echo    - Removed src/ai folder
)
if exist "apphosting.yaml" (
    del /q "apphosting.yaml"
    echo    - Removed apphosting.yaml
)

echo.
echo [2/5] Removing placeholder image files...
if exist "src\lib\placeholder-images.json" (
    del /q "src\lib\placeholder-images.json"
    echo    - Removed placeholder-images.json
)
if exist "src\lib\placeholder-images.ts" (
    del /q "src\lib\placeholder-images.ts"
    echo    - Removed placeholder-images.ts
)

echo.
echo [3/5] Removing unused shadcn/ui components...
cd src\components\ui
del /q accordion.tsx 2>nul
del /q alert-dialog.tsx 2>nul
del /q alert.tsx 2>nul
del /q avatar.tsx 2>nul
del /q badge.tsx 2>nul
del /q calendar.tsx 2>nul
del /q carousel.tsx 2>nul
del /q chart.tsx 2>nul
del /q checkbox.tsx 2>nul
del /q collapsible.tsx 2>nul
del /q dialog.tsx 2>nul
del /q dropdown-menu.tsx 2>nul
del /q form.tsx 2>nul
del /q menubar.tsx 2>nul
del /q popover.tsx 2>nul
del /q progress.tsx 2>nul
del /q radio-group.tsx 2>nul
del /q scroll-area.tsx 2>nul
del /q separator.tsx 2>nul
del /q sheet.tsx 2>nul
del /q sidebar.tsx 2>nul
del /q skeleton.tsx 2>nul
del /q switch.tsx 2>nul
del /q textarea.tsx 2>nul
del /q tooltip.tsx 2>nul
echo    - Removed 25 unused UI components
cd ..\..\..

echo.
echo [4/5] Removing duplicate config files...
if exist "next.config.bundle.ts" (
    del /q "next.config.bundle.ts"
    echo    - Removed next.config.bundle.ts
)

echo.
echo [5/5] Cleaning build artifacts...
if exist ".next" (
    rmdir /s /q ".next"
    echo    - Removed .next folder
)
if exist "tsconfig.tsbuildinfo" (
    del /q "tsconfig.tsbuildinfo"
    echo    - Removed tsconfig.tsbuildinfo
)

echo.
echo ========================================
echo  CLEANUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo   1. Review and update package.json to remove unused dependencies
echo   2. Run: npm install
echo   3. Run: npm run build
echo   4. Deploy to Vercel
echo.
pause

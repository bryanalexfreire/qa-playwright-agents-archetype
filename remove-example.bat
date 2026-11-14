@echo off
rem ============================================================================
rem  remove-example.bat - removes the worked example (Demoblaze) and leaves the
rem  clean archetype structure.
rem
rem    remove-example.bat          asks for confirmation
rem    remove-example.bat /y       no prompt
rem    remove-example.bat /dry     lists what would change, changes nothing
rem
rem  Steps: 1) delete the example files and folders
rem         2) remove the <!-- example:start --> ... <!-- example:end --> blocks
rem         3) remove the example npm scripts from package.json
rem         4) keep the archetype folders (adds .gitkeep when empty)
rem         5) delete this file
rem ============================================================================
setlocal EnableExtensions EnableDelayedExpansion
cd /d "%~dp0"

set "MODE=ask"
if /i "%~1"=="/y"   set "MODE=yes"
if /i "%~1"=="-y"   set "MODE=yes"
if /i "%~1"=="/dry" set "MODE=dry"
if /i "%~1"=="--dry-run" set "MODE=dry"

if not exist "tests\e2e\demoblaze" if not exist "src\pages\demoblaze" (
  echo The example is not present: the archetype is already clean.
  goto :selfdelete_check
)

set PATHS=^
 "qa\requirements\demoblaze-purchase.md"^
 "qa\plans\demoblaze-purchase.md"^
 "qa\flows\demoblaze"^
 "src\models\demoblaze.ts"^
 "src\data\demoblaze"^
 "src\components\demoblaze"^
 "src\pages\demoblaze"^
 "src\fixtures\demoblaze.ts"^
 "tests\e2e\demoblaze"^
 "tests\bugs\demoblaze"^
 "docs\example-demoblaze"

set KEEPDIRS=src\models src\components src\data qa\flows tests\e2e tests\bugs tests\a11y docs
set MARKED=README.md CHANGELOG.md
set SCRIPTS=test:example example:remove

echo Worked example: Demoblaze E2E purchase
echo.
echo Will delete:
for %%P in (%PATHS%) do if exist %%P echo   - %%~P
for /d %%R in (reports\*) do echo   - %%R  (published report)
echo Will clean example blocks in: %MARKED%
echo Will remove npm scripts: %SCRIPTS%
echo Will delete: remove-example.bat
echo.

if "%MODE%"=="dry" (
  echo Dry run: nothing changed.
  exit /b 0
)

if "%MODE%"=="ask" (
  set "ANSWER="
  set /p "ANSWER=Remove the example? (y/N) "
  if /i not "!ANSWER!"=="y" if /i not "!ANSWER!"=="yes" (
    echo Cancelled.
    exit /b 0
  )
)

rem 1) Files and folders
for %%P in (%PATHS%) do (
  if exist "%%~P\*" (
    rmdir /s /q "%%~P"
  ) else if exist "%%~P" (
    del /f /q "%%~P"
  )
)

rem 1b) Published reports of the example runs (reports\README.md stays)
for /d %%R in (reports\*) do rmdir /s /q "%%R"
if exist "reports\index.md" del /f /q "reports\index.md"
if exist "reports\LATEST.md" del /f /q "reports\LATEST.md"

rem 2) Example blocks in Markdown files (UTF-8 without BOM)
setlocal DisableDelayedExpansion
for %%F in (%MARKED%) do (
  if exist "%%F" powershell -NoProfile -ExecutionPolicy Bypass -Command "$f=(Resolve-Path '%%F').Path; $t=[IO.File]::ReadAllText($f); $t=[regex]::Replace($t,'(?s)\r?\n?<!-- example:start -->.*?<!-- example:end -->\r?\n?',[Environment]::NewLine); [IO.File]::WriteAllText($f,$t,(New-Object Text.UTF8Encoding $false))"
)
endlocal

rem 3) npm scripts of the example
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));for(const s of process.argv.slice(1))delete p.scripts[s];fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');" %SCRIPTS%
if errorlevel 1 echo WARNING: could not update package.json (is Node.js installed?). Remove the scripts %SCRIPTS% by hand.

rem 4) Keep the archetype folders
for %%D in (%KEEPDIRS%) do (
  if not exist "%%D" mkdir "%%D"
  dir /b /a "%%D" 2>nul | findstr . >nul || type nul > "%%D\.gitkeep"
)

echo.
echo Example removed. The archetype is clean.
echo Next: npm run typecheck ^&^& npm run lint:specs, then commit the removal on a feature branch.

:selfdelete_check
if "%MODE%"=="dry" exit /b 0
rem 5) Delete this script (runs after the batch file is closed)
(goto) 2>nul & del /f /q "%~f0"

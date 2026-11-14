@echo off
rem ============================================================================
rem  link-agents.bat - connects the vendor-neutral agent files of this repo to
rem  the folder and rules file your agent client expects, on THIS machine only.
rem
rem    link-agents.bat <client-folder> <client-rules-file>
rem    link-agents.bat /remove <client-folder> <client-rules-file>
rem
rem  It creates (and never commits):
rem    <client-folder>      -> junction to .agents\   (agents, skills, settings)
rem    <client-rules-file>  -> hard link to AGENTS.md  (project rules, always in sync)
rem  and adds both names to .git\info\exclude, so they stay out of every commit.
rem  Check your client's documentation for the folder and rules file it reads.
rem ============================================================================
setlocal EnableExtensions
cd /d "%~dp0"

if /i "%~1"=="/remove" goto :remove

if "%~2"=="" goto :usage
set "CLIENT_DIR=%~1"
set "CLIENT_RULES=%~2"

if exist "%CLIENT_DIR%" (
  echo "%CLIENT_DIR%" already exists. Remove it first: link-agents.bat /remove "%CLIENT_DIR%" "%CLIENT_RULES%"
  exit /b 1
)
mklink /J "%CLIENT_DIR%" ".agents" >nul || (echo Could not create "%CLIENT_DIR%". & exit /b 1)

if exist "%CLIENT_RULES%" (
  echo "%CLIENT_RULES%" already exists; left unchanged.
) else (
  mklink /H "%CLIENT_RULES%" "AGENTS.md" >nul || copy /y "AGENTS.md" "%CLIENT_RULES%" >nul
)

if exist ".git\info" (
  findstr /x /c:"/%CLIENT_DIR%" ".git\info\exclude" >nul 2>&1 || echo /%CLIENT_DIR%>>".git\info\exclude"
  findstr /x /c:"/%CLIENT_RULES%" ".git\info\exclude" >nul 2>&1 || echo /%CLIENT_RULES%>>".git\info\exclude"
  echo Added to .git\info\exclude ^(local only, never committed^).
) else (
  echo WARNING: no .git folder yet. Run this again after "git init" so the links are excluded from commits.
)

echo Linked: %CLIENT_DIR% -^> .agents   and   %CLIENT_RULES% -^> AGENTS.md
exit /b 0

:remove
if "%~3"=="" goto :usage
if exist "%~2" rmdir "%~2"
if exist "%~3" del /f /q "%~3"
echo Removed the local links "%~2" and "%~3". The repository files are untouched.
exit /b 0

:usage
echo Usage:
echo   link-agents.bat ^<client-folder^> ^<client-rules-file^>
echo   link-agents.bat /remove ^<client-folder^> ^<client-rules-file^>
exit /b 1

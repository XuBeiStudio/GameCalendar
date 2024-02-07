@echo off
cd public
..\coscli-windows.exe sync ./games cos://gaming-epochs/ -r
..\coscli-windows.exe sync ./games.json cos://gaming-epochs/

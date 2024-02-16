@echo off
cd public
..\coscli-windows.exe sync ./games cos://gaming-epochs-games/ -r
..\coscli-windows.exe sync ./games.json cos://gaming-epochs-games/

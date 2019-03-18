set FUSEKIPATH=C:\Tools\DEV\Software\jena-fuseki1-1.6.0

echo off
cls
echo --------------------------------------------
echo Starting Fuseki
echo --------------------------------------------
cd %FUSEKIPATH%
fuseki-server.bat --config=config.ttl


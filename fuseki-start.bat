set FUSEKIPATH=C:\Tools\DEV\Software\apache-jena-fuseki-3.11.0

echo off
cls
echo --------------------------------------------
echo Starting Fuseki
echo --------------------------------------------
cd %FUSEKIPATH%
fuseki-server.bat --config=config.ttl


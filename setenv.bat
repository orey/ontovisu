set NODEPATH=C:\Tools\DEV\Software\node-v10.15.3-win-x64

set gitdir=C:\Tools\DEV\Software\Git-2.19.2\Git\cmd

set EMACSPATH=C:\Tools\DEV\Software\Emacs-26.1\bin

set PATH=%NODEPATH%;%gitdir%;%EMACSPATH%;%PATH%

rem npm config set proxy http://127.0.0.1:3128
rem npm config set https-proxy http://127.0.0.1:3128
rem npm config set strict-ssl false
rem npm config set cafile C:\Tools\DEV\cert\cacert.pem

echo off
cls
echo --------------------------------------------
echo Environment variables are set (node, npm, emacs)
echo --------------------------------------------
echo This is a Windows configuration using cmd to run
echo Consider the conf folder for more information
echo --------------------------------------------


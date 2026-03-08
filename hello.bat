@echo off
echo MsgBox "Hello", 0, "Greeting" > "%temp%\hello_msg.vbs"
cscript //nologo "%temp%\hello_msg.vbs"
del "%temp%\hello_msg.vbs"

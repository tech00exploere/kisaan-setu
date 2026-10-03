@echo off
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.12.1"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting SuperMandi 2.0 Spring Boot Backend...
call mvnw.cmd compile exec:java -Dexec.mainClass=com.supermandi.SuperMandiApplication

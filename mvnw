#!/usr/bin/env sh
# ----------------------------------------------------------------------------
# Maven Wrapper POSIX Script
# ----------------------------------------------------------------------------

PRG="$0"
while [ -h "$PRG" ]; do
  ls=`ls -ld "$PRG"`
  link=`expr "$ls" : '.*-> \(.*\)$'`
  if expr "$link" : '/.*' > /dev/null; then
    PRG="$link"
  else
    PRG=`dirname "$PRG"`/"$link"
  fi
done

DIRNAME=`dirname "$PRG"`
MAVEN_PROJECTBASEDIR="$DIRNAME"

# Load .env if present
if [ -f "$MAVEN_PROJECTBASEDIR/.env" ]; then
  set -a
  . "$MAVEN_PROJECTBASEDIR/.env"
  set +a
fi

if [ -n "$JAVA_HOME" ] && [ -x "$JAVA_HOME/bin/java" ]; then
    JAVACMD="$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

WRAPPER_JAR="$MAVEN_PROJECTBASEDIR/.mvn/wrapper/maven-wrapper.jar"

exec "$JAVACMD" \
  -Dmaven.multiModuleProjectDirectory="$MAVEN_PROJECTBASEDIR" \
  -cp "$WRAPPER_JAR" \
  org.apache.maven.wrapper.MavenWrapperMain \
  "$@"

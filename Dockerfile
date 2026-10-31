# Multi-stage Dockerfile for Campus Lost & Found
# Build stage
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests

# Production runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN mkdir -p uploads/items && chown -R appuser:appgroup /app
USER appuser:appgroup

COPY --from=builder --chown=appuser:appgroup /app/target/campus-lost-found-*.jar app.jar

EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "app.jar"]


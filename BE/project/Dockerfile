FROM openjdk:17-slim
WORKDIR /app

COPY build/libs/project-0.0.1-SNAPSHOT.jar app.jar
COPY .env .env
ENTRYPOINT ["java", "-jar", "app.jar"]

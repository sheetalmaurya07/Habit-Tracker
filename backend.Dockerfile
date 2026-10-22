FROM maven:3.9.11-eclipse-temurin-17 AS build
WORKDIR /app
COPY habit-tracker-backend/pom.xml .
COPY habit-tracker-backend/src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/habit-tracker-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Habit Tracker and Gamification

Complete full-stack skeleton matching the requested structure:

- React.js frontend
- Spring Boot REST backend
- MySQL + JPA/Hibernate
- JWT authentication
- Axios REST integration
- Progress chart and gamification
- Docker + Docker Compose

## Folder structure

```text
HabitTrackerAndGamification/
├── habit-tracker-backend/
├── habit-tracker-frontend/
├── habit-tracker-database/
└── habit-tracker-deployment/
```

## Option 1: Run locally

### 1. Create database
Open MySQL Workbench and run:
```sql
CREATE DATABASE habit_tracker;
```

### 2. Start backend
```bash
cd habit-tracker-backend
mvn clean spring-boot:run
```

### 3. Start frontend
Open a second terminal:
```bash
cd habit-tracker-frontend
npm install
npm start
```

Open:
http://localhost:3000

### Default local MySQL password
The supplied configuration uses `mysql267`.
If yours is different, set:
```text
DB_PASSWORD=your_password
```
or edit `habit-tracker-backend/src/main/resources/application.properties`.

## Option 2: Docker

From the project root:
```bash
docker compose -f habit-tracker-deployment/docker-compose.yml up --build
```

Frontend:
http://localhost:3000

Backend:
http://localhost:8080

## Main workflow

1. Register a user.
2. Login.
3. Add a habit.
4. Mark the habit complete each day.
5. Earn points and rewards.
6. View progress and achievements.

## Important

Do not commit real passwords or production JWT secrets to GitHub.
Change the example credentials/secrets before production deployment.

# MyDiary

A personal diary application that allows you to create, view, edit, and delete diary entries with support for multimedia attachments (images, videos, and audio).

Demo Video: https://drive.google.com/file/d/1TJX-U_DzeY5hlqKnN72SZUEjSjxe2r0P/view?usp=sharing

## Features

- Create diary entries with text content and optional topics
- Upload and attach images, videos, and audio files to entries
- View all diary entries with media playback
- Edit and update existing entries
- Delete entries
- Responsive UI with Tailwind CSS

## Tech Stack

### Backend
- Java 17+
- Spring Boot 3.3.0
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React 
- Tailwind CSS

## Prerequisites

Before running this application, ensure you have the following installed:

- **Java Development Kit (JDK) 17 or higher**
- **Maven 3.6+**
- **Node.js 16+ and npm**
- **MySQL 8.0+** (optional - for production; H2 in-memory database available for development)

## Running Locally

### Option 1: Quick Start with H2 Database (Development Mode)

This is the easiest way to get started without setting up MySQL.

#### Backend

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Start the Spring Boot application with the dev profile:
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Or on Windows PowerShell:
```powershell
$env:SPRING_PROFILES_ACTIVE='dev'
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

#### Frontend

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

### Option 2: Production Mode with MySQL

#### Setup MySQL Database

1. Install and start MySQL server

2. Create a database:
```sql
CREATE DATABASE mydiary_db;
USE mydiary_db;
```

3. Update the credentials in `Backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/mydiary_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD_HERE
```

#### Backend

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Build the project:
```bash
mvn clean install -DskipTests
```

3. Run the application:
```bash
mvn spring-boot:run
```

Or run the JAR directly:
```bash
java -jar target/mydiary-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

#### Frontend

Follow the same frontend steps as Option 1.

## Building for Production

### Backend

Build the JAR file:
```bash
cd Backend
mvn clean package -DskipTests
```

The JAR will be created at `Backend/target/mydiary-0.0.1-SNAPSHOT.jar`

### Frontend

Build the production bundle:
```bash
cd frontend
npm run build
```

The optimized build will be in the `frontend/build` directory.

## API Endpoints

### Diary Entries

- `POST /api/diary` - Create a new diary entry
  - Parameters: `content`, `topic` (optional), `image` (optional), `video` (optional), `audio` (optional)
  
- `GET /api/diary` - Get all diary entries

- `GET /api/diary/{id}` - Get a specific diary entry

- `PUT /api/diary/{id}` - Update a diary entry
  - Parameters: `content`, `topic` (optional), `image` (optional), `video` (optional), `audio` (optional)

- `DELETE /api/diary/{id}` - Delete a diary entry

- `GET /api/diary/media/{filename}` - Serve media files

## Project Structure

```
MyDiary/
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/diaryapp/
│   │   │   │   ├── controller/
│   │   │   │   ├── entity/
│   │   │   │   ├── repository/
│   │   │   │   └── DiaryApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   └── test/
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddEntry.jsx
│   │   │   └── ViewEntries.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Troubleshooting

### Backend won't start

- **MySQL Connection Error**: Ensure MySQL is running and credentials are correct
- **Port 8080 already in use**: Stop any other application using port 8080 or change the port in `application.properties`
- **JDK version mismatch**: Ensure you're using JDK 17 or higher

### Frontend won't start

- **Dependencies not installed**: Run `npm install` in the frontend directory
- **Build errors**: Delete `node_modules` folder and `package-lock.json`, then run `npm install` again

### Database Issues

- **H2 Console not accessible**: Ensure you're running with the `dev` profile
- **MySQL tables not created**: Check that `spring.jpa.hibernate.ddl-auto=update` is set in `application.properties`

## License

This project is open source and available for educational purposes.

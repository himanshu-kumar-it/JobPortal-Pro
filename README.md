# JobPortal Pro

A Java full-stack job portal with Spring Boot, Spring Security/JWT, MySQL, React, Vite and REST APIs.

## Prerequisites

- Java 17 or newer
- MySQL 8.x running locally
- Node.js 20.19+ (or 22.12+) and npm

## 1. Create the database

Open MySQL Workbench and run `jobportal-backend/src/main/resources/db-setup.sql`, or run:

```sql
CREATE DATABASE IF NOT EXISTS jobportal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The application uses Hibernate `ddl-auto=update` to create/update the project tables. It does not drop existing tables.

## 2. Configure MySQL credentials

Open `jobportal-backend/src/main/resources/application.properties`. The local default is username `root` and password `himanshu@`, matching the original project configuration. If your local MySQL password differs, either update the password there or set environment variables before starting the backend:

- `DB_USERNAME` — MySQL username (default `root`)
- `DB_PASSWORD` — your MySQL password (default `himanshu@`)
- `DB_URL` — optional JDBC URL (default points to `localhost:3306/jobportal_db`)

Do not commit real passwords or production JWT secrets to GitHub.

## 3. Start the backend

Windows Command Prompt:

```bat
cd jobportal-backend
mvnw.cmd spring-boot:run
```

Or, if Maven is installed:

```bash
mvn spring-boot:run
```

Check `http://localhost:8080/api/test`. It should return `JobPortal Pro backend is running successfully`.

## 4. Start the frontend

Open a second terminal:

```bash
cd jobportal-frontend
npm install
npm run dev
```

Open the exact URL printed by Vite, usually `http://localhost:5173`. The backend CORS configuration supports local Vite ports when Vite selects 5174 or 5175 as well.

If the backend is hosted somewhere else, copy `.env.example` to `.env`, change `VITE_API_BASE_URL`, and restart Vite.

## 5. Test the main flows

1. Register a candidate with a new email and a password of at least 6 characters.
2. Log in with that account; you should reach the candidate dashboard.
3. Browse jobs, open a job's details, apply, and save jobs.
4. Register a second account with the **Recruiter** role.
5. Log in as recruiter, create the company profile, then create a job. Candidate accounts can browse/apply to the created jobs.
6. Check My Applications and Saved Jobs as the candidate; check applicant management as the recruiter.

## Troubleshooting registration

- `User already exists...` / HTTP 409: use another email or log in to the existing account.
- Validation message / HTTP 400: check full name (3+ characters), valid email, password (6+ characters), and role.
- Cannot connect / Network Error: ensure backend is running at port 8080 and MySQL is running.
- SQL access denied: set `DB_USERNAME` and `DB_PASSWORD` to your actual MySQL credentials.
- CORS error: use the local Vite URL printed in the terminal and restart the backend after configuration changes.

The application is configured for local development. Review secrets, CORS, and database settings before deploying publicly.

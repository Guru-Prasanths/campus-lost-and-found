# Campus Lost & Found — Full-Stack University Web Application

A modern, secure, and university-grade digital platform designed to help students, faculty, and campus staff report, search for, verify, and recover lost belongings across university campuses.

> **🌐 Live Public URL (GitHub Pages):** [https://leun-hammi.github.io/leun-hammi/](https://leun-hammi.github.io/leun-hammi/)  
> **📦 GitHub Repository:** [https://github.com/leun-hammi/leun-hammi](https://github.com/leun-hammi/leun-hammi)  
> **🛡️ Verification Engine:** 70 verified campus items (50 unique lost + 20 unique found) with interactive anti-theft ownership quiz gating.

---

## 🚀 Live Public Deployment Options

### Option 1: GitHub Pages (Instant Interactive Public Showcase)
The `/docs` directory contains a complete client deployment hosting all 70 campus belongings with the interactive image-based verification quiz:
- **Public URL:** `https://leun-hammi.github.io/leun-hammi/`
- **Activation:** In repository **Settings** &rarr; **Pages** &rarr; Build and deployment: **Deploy from a branch** &rarr; Branch: **`main`** &rarr; Folder: **`/docs`** &rarr; Click **Save**.

### Option 2: Live Spring Boot + MySQL Backend Tunnel
To expose your live running Spring Boot server to any public device:
```cmd
mvnw.cmd spring-boot:run
```
In a second terminal:
```cmd
npx localtunnel --port 8080
```
This gives you an instant public HTTPS URL (e.g. `https://campus-lost-found.loca.lt`) proxying directly to your local Java + MySQL backend.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Backend Framework** | Spring Boot 3.2.0 | Spring MVC, Spring Data JPA, Hibernate, Bean Validation |
| **Language** | Java 17 | JDK 17, Lombok, strongly-typed DTOs & JPA Entities |
| **Security** | Spring Security 6 | BCrypt password hashing, RBAC (`STUDENT`, `STAFF`, `ADMIN`), CSRF protection, session management |
| **Database** | MySQL 8.0 | Automatic schema migration (`ddl-auto: update`), indexed tables, relational integrity |
| **Frontend** | Thymeleaf 3.1 + HTML5/CSS3/JS | Deep navy & royal blue university theme, Inter typography, FontAwesome 6 |
| **Build & Tooling** | Maven Wrapper (`mvnw`, `mvnw.cmd`) | Self-bootstrapping build without requiring a global Maven install |
| **Containerization** | Docker & Docker Compose | Multi-stage Dockerfile and full-stack compose specification |
| **REST APIs** | Spring `@RestController` | `/api/items`, `/api/items/{id}`, `/api/stats` |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java 17** JDK installed (`java -version`)
- **MySQL Server 8.0** running locally on port `3306`

### 1. Configure Database Credentials
Create a local `.env` file in the project root (this file is excluded from Git for security):

```properties
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/campus_lost_found?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your_mysql_password
PORT=8080
```

*You can also run `powershell -File verify-db.ps1` to test your connection and auto-generate the `.env` file.*

### 2. Run the Application

#### Option A: Using the Maven Wrapper (Recommended)
On Windows:
```cmd
mvnw.cmd spring-boot:run
```

On Linux / macOS:
```bash
./mvnw spring-boot:run
```

#### Option B: Using the Pre-Configured Startup Scripts
```cmd
run.bat
```
or in PowerShell:
```powershell
.\run.ps1
```

Once started, open your browser:
**👉 http://localhost:8080**

---

## 🔐 Default Seed Accounts

The application automatically provisions verified accounts on first boot ([`DataInitializer.java`](src/main/java/com/campuslostfound/config/DataInitializer.java)):

| Role | Email | Password | Capabilities |
|---|---|---|---|
| **Administrator** | `admin@campus.edu` | `admin123` | Full administrative control, user enabling/disabling, claim verification & approvals |
| **Student** | `student@campus.edu` | `student123` | Report lost & found belongings, submit ownership claims, view notifications |
| **Staff Member** | `staff@campus.edu` | `staff123` | Report lost & found items, verify belongings, manage claims |

---

## 📄 Key Application Routes

| Route | Method | Access | Description |
|---|---|---|---|
| `/` | GET | Public | University landing page with live statistics and recent items |
| `/items` | GET | Public | Item directory with keyword search, category filters, and pagination |
| `/items/{id}` | GET | Public | Detailed item view with ownership claim form and status badges |
| `/items/report/lost` | GET, POST | Authenticated | Report a missing item with category, date, and private identifying details |
| `/items/report/found` | GET, POST | Authenticated | Report a found item with photograph upload and custody location |
| `/claims` | GET | Authenticated | User dashboard to track personal claim statuses |
| `/claims/submit` | POST | Authenticated | Submit an item ownership verification claim |
| `/dashboard` | GET | Authenticated | User overview of reported items, active claims, and notifications |
| `/admin` | GET | Admin | Administrator control portal with university-wide analytics |
| `/admin/users` | GET | Admin | Student and staff account management (enable/disable accounts) |
| `/admin/items` | GET | Admin | Item administration and status transitions |
| `/admin/claims` | GET, POST | Admin | Ownership verification claim reviews, approvals, and rejections |
| `/api/items` | GET | Public | REST endpoint for paginated and filtered items |
| `/api/stats` | GET | Public | REST endpoint for campus recovery statistics |

---

## 🧪 Testing

### Automated Unit Tests
To run all JUnit 5 test suites:
```cmd
mvnw.cmd test
```

Test coverage includes:
- `UserServiceTest`: Registration validation, duplicate email/ID prevention, status toggling.
- `ItemServiceTest`: Item reporting, status transitions, search and category filtering.
- `ClaimServiceTest`: Claim submission, duplicate protection, ownership approval flows.

### End-to-End (E2E) Workflow Test Suite
To execute the automated 14-step integration test:
```powershell
powershell -ExecutionPolicy Bypass -File test-e2e.ps1
```

---

## 🐳 Docker Deployment

To run the entire platform with MySQL in isolated containers:

```bash
docker compose up -d --build
```

Access the application at `http://localhost:8080`.

---

## 🔒 Security Best Practices
- **Never commit `.env` or credentials to version control.**
- Passwords are encrypted with **BCrypt** (strength 10).
- CSRF protection is active on all web forms.
- Sensitive user and claim details are excluded from JSON serialization via `@JsonIgnore`.
- Uploaded media is sanitized and stored outside web root with unique UUIDs.

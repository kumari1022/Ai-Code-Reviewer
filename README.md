# AI Code Reviewer

*An AI-powered platform for intelligent code analysis, review, debugging, and optimization.*

---

## 🚀 Live Demo

Access the live application here:  
👉 **[https://ai-code-reviewer-fdsk.vercel.app/](https://ai-code-reviewer-fdsk.vercel.app/)**

The live demo allows developers to interact with the deployed frontend, test code review capabilities, upload files, interact with the AI assistant, and experience the application in real time.

---

## 📌 Project Overview

**AI Code Reviewer** is an intelligent web application engineered to automate code quality checks, bug identification, security flaw detection, and optimization recommendations. 

Writing clean, secure, and performant code requires constant feedback and rigorous review. Manual code reviews can be time-consuming and prone to human oversight. AI Code Reviewer addresses this challenge by combining automated static checks with advanced Large Language Models (LLMs) to provide instant, actionable insights.

### Key Capabilities:
- **Flexible Code Submissions**: Analyze code snippets directly via live editor, upload source files, or submit GitHub repository URLs.
- **AI-Driven Code Analysis**: Leverages Groq AI to inspect code for potential bugs, performance bottlenecks, security vulnerabilities, and adherence to clean code standards.
- **Real-Time Live Review**: WebSockets enable live interactive code analysis as developers type or stream code snippets.
- **Documentation & Error Assistance**: Automatically generates code documentation and provides detailed explanations for complex runtime/compiler errors.
- **Developer Chat Assistant**: Features an interactive AI assistant for technical Q&A, refactoring advice, and general programming guidance.

---

## ✨ Features

- 🔑 **User Authentication & Security**: User registration and login powered by JWT (JSON Web Tokens) and Spring Security with BCrypt password hashing.
- 📁 **File Upload Analysis**: Upload source files (`.java`, `.py`, `.js`, etc.) for automatic processing and stored review results.
- ⚡ **Direct / Live Code Review**: Interactive code review module supporting instant snippet analysis and WebSocket-powered live analysis.
- 🤖 **AI-Powered Code Review**: Context-aware recommendations highlighting bugs, security risks, performance optimizations, and refactoring suggestions.
- 📝 **Automated Documentation**: AI tool to generate structured comments and documentation for submitted code snippets.
- 🚨 **Error Explanation**: Intelligent breakdown and diagnostic suggestions for error logs and exceptions.
- 📜 **Review History**: Detailed historical reports for code submissions stored securely in the database.
- 💬 **AI Coding Assistant**: Chat interface enabling real-time developer dialogue and coding support.
- 📊 **Admin Dashboard**: System administration features including total user count, total reviews, registered user oversight, and review content moderation/deletion.
- ⚡ **Redis Caching**: Performance caching for review responses using hashed input keys to minimize latency and redundant AI calls.

---

## 🏗️ System Architecture

```text
User
 ↓
React + Vite Frontend (Vercel)
 ↓
Spring Boot REST API / WebSocket (Render)
 ↓
 ├── MySQL / TiDB Cloud (Persistence)
 ├── Redis (Response Caching)
 └── Groq AI API (Code Analysis & Chat)
```

### Component Responsibilities:
- **Frontend (React + Vite)**: Modern responsive UI for code editing, file uploads, visualization of AI review reports, chat assistant, and administration dashboard.
- **Backend (Spring Boot)**: Robust Java RESTful API managing authentication, file processing, WebSocket sessions, static analysis orchestration, and AI model communication.
- **Database (MySQL / TiDB Cloud)**: Distributed relational database storing user records, code submission metadata, and generated review reports.
- **Cache (Redis)**: Low-latency caching layer storing hashed review outputs (`fileName::code.hashCode()`) to accelerate responses and prevent unnecessary external API requests.
- **AI Engine (Groq API)**: High-speed LLM inference pipeline (`llama-3.3-70b-versatile`) responsible for code analysis, error explanation, documentation generation, and developer chat responses.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS | User interface framework and build tool |
| **Styling & UI** | Lucide React, React Icons, Recharts | Icons, Markdown rendering, and statistics visualization |
| **Backend** | Spring Boot 3.2.5, Java 21 | Web backend framework and runtime |
| **Database** | MySQL / TiDB Cloud | Relational database (Spring Data JPA / Hibernate) |
| **Cache** | Redis (Lettuce Client) | Spring Cache implementation for fast review lookups |
| **AI Integration**| Groq API (`llama-3.3-70b-versatile`) | LLM engine for analysis, docs, error parsing, and chat |
| **Authentication**| JWT (`jjwt`), Spring Security | Token-based security and BCrypt password encryption |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud hosting infrastructure |

---

## 📂 Project Structure

```text
AI-Project-Reviewer/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/aicoderreviewer/backend/
│   │   │   │   ├── ai/               # Groq AI integration & prompt builders
│   │   │   │   ├── analysis/         # Static analysis services (SpotBugs, PMD)
│   │   │   │   ├── analyzer/         # Language specific analyzers
│   │   │   │   ├── auth/             # Registration, Login, Auth controllers
│   │   │   │   ├── chat/             # AI Coding assistant models
│   │   │   │   ├── config/           # Redis, CORS, WebClient, WebSockets configs
│   │   │   │   ├── controller/       # REST API endpoints (Admin, Files, Review, IDE)
│   │   │   │   ├── documentation/    # AI Code documentation generator
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── entity/           # JPA Entities (CodeFile, etc.)
│   │   │   │   ├── error/            # Error explanation endpoints & services
│   │   │   │   ├── exception/        # Global exception handling
│   │   │   │   ├── github/           # Repository analysis services
│   │   │   │   ├── repository/       # Data repositories
│   │   │   │   ├── security/         # Spring Security & JWT filter logic
│   │   │   │   ├── service/          # File upload & language detection services
│   │   │   │   ├── user/             # User domain models and repositories
│   │   │   │   └── websocket/        # Real-time live review WebSockets
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── Dockerfile
│   ├── mvnw / mvnw.cmd
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
└── README.md
```

---

## 🔐 Authentication & Security

- **JSON Web Tokens (JWT)**: Stateless token authentication ensuring secure communication between frontend client and backend APIs.
- **Role-Based Access Control**: Admin endpoints (`/api/admin/**`) are restricted exclusively to users with `ROLE_ADMIN` privileges.
- **Password Security**: Passwords are securely hashed using `BCryptPasswordEncoder` prior to database storage.
- **CORS Management**: Configured cross-origin resource sharing enables authorized web clients to interact safely with backend services.

---

## 🤖 AI Code Review

Code analysis is powered by the `AIService` component:
1. **Language Detection**: Determines file syntax and context via `LanguageDetectorService`.
2. **Structured Prompting**: Constructs specialized evaluation prompts targeting four core categories:
   - **Bugs**: Identifies syntax, logical flaws, and edge-case exceptions.
   - **Optimizations**: Recommends algorithm, execution, and memory performance improvements.
   - **Security**: Highlights potential vulnerabilities, unsafe operations, and data sanitization issues.
   - **Code Quality**: Recommends formatting, clean code practices, and maintainability enhancements.
3. **Caching & Resilience**: Analysis responses are cached in Redis via key hashing (`fileName + '::' + code.hashCode()`). A custom `CacheErrorHandler` ensures that if Redis is offline, code analysis degrades gracefully without interrupting user workflow.

---

## 💬 AI Coding Assistant

The application includes an AI-driven Developer Assistant accessible via the `/api/chat` endpoint. Developers can ask technical questions, seek debugging advice, request code refactoring, or learn language features in an interactive conversational format.

---

## 📊 Admin Dashboard

System administrators can access administrative endpoints to monitor application usage:
- **System Metrics**: View aggregate user counts and code review metrics (`/api/admin/stats`).
- **User Directory**: View registered platform users (`/api/admin/users`).
- **Review Moderation**: Access total submitted code reviews and perform review deletions (`/api/admin/reviews`, `DELETE /api/admin/review/{id}`).

---

## 🔌 API Endpoints

### Health Check
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Verify backend server status | No |

### Authentication
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Authenticate user & retrieve JWT token | No |

### Code Review & Analysis
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ide/review` | Direct code snippet review | No |
| `POST` | `/api/files/upload` | Upload source file for review & storage | No |
| `GET` | `/api/review/latest` | Retrieve the most recent code review | No |
| `GET` | `/api/review/all` | List all historical code reviews | No |
| `GET` | `/api/review/{id}` | Retrieve specific review by ID | No |
| `POST` | `/api/github/analyze` | Analyze remote GitHub repository | No |

### AI Tools & Chat
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/chat` | AI coding assistant chat prompt | No |
| `POST` | `/api/docs/generate` | Generate automated code documentation | No |
| `POST` | `/api/errors/explain` | Explain application error messages/stack traces | No |

### Administration
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Fetch application summary statistics | Yes (`ADMIN`) |
| `GET` | `/api/admin/users` | List all registered users | Yes (`ADMIN`) |
| `GET` | `/api/admin/reviews` | List all saved reviews | Yes (`ADMIN`) |
| `DELETE` | `/api/admin/review/{id}` | Delete code review record | Yes (`ADMIN`) |

---

## 🗄️ Database

The database layer utilizes **MySQL / TiDB Cloud** managed via Spring Data JPA entities:

- **`User` Entity (`users` table)**
  - `id`: Primary key (Auto Increment)
  - `firstName`, `lastName`: User details
  - `email`: Unique user credential
  - `password`: Encrypted password string
  - `role`: Authorization level (`ROLE_USER`, `ROLE_ADMIN`)

- **`CodeFile` Entity (`code_file` table)**
  - `id`: Primary key (Auto Increment)
  - `fileName`: Original name of uploaded code file
  - `content`: Full source code text (`LONGTEXT`)
  - `review`: AI-generated analysis report (`LONGTEXT`)
  - `createdAt`: Timestamp of submission

---

## ⚡ Redis

Redis is utilized as a high-performance caching layer (`spring.cache.type=redis`):
- **Cached Operations**: Caches AI analysis results based on filename and content hash key.
- **Time To Live (TTL)**: Configured with a default TTL of 1 hour (`3600000 ms`).
- **Resilience**: Integrated with a custom `CacheErrorHandler` that catches Redis GET/PUT/EVICT errors, logging warnings and falling back to direct AI execution if Redis becomes unavailable.

---

## 🌐 Deployment

### Infrastructure Overview
- **Frontend**: Deployed on **Vercel**  
  - **Live URL**: `https://ai-code-reviewer-fdsk.vercel.app/`
- **Backend**: Deployed on **Render**  
  - **Backend API URL**: `https://ai-code-reviewer-5f1r.onrender.com`
- **Database**: Cloud MySQL / TiDB Cloud
- **Cache**: Cloud Redis instance

### Flow:
Client Browser ➔ Vercel Frontend ➔ Render Spring Boot Backend ➔ TiDB Cloud / Redis / Groq API

---

## ⚙️ Local Setup

### Prerequisites
- **Java 21** JDK installed
- **Node.js** (v18 or higher) & **npm**
- **Docker** (Optional, for running local Redis container)

### 1. Clone Repository
```bash
git clone https://github.com/kumari1022/Ai-Code-Reviewer.git
cd Ai-Code-Reviewer
```

### 2. Run Redis (Optional via Docker)
```bash
docker-compose up -d
```

### 3. Backend Setup
Navigate to the `backend` directory and start the application:

**Windows (PowerShell / Command Prompt):**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

**Linux / macOS:**
```bash
cd backend
./mvnw spring-boot:run
```
The backend server runs on `http://localhost:8081`.

### 4. Frontend Setup
Navigate to the `frontend` directory, install dependencies, and launch the development server:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

---

## 🔑 Environment Variables

The application requires specific environment variables for configuration. Populate these in your environment or configuration files:

### Backend Environment Variables
- `SPRING_DATASOURCE_URL`: JDBC connection string for MySQL / TiDB Cloud.
- `SPRING_DATASOURCE_USERNAME`: Database connection username.
- `SPRING_DATASOURCE_PASSWORD`: Database connection password.
- `GROQ_API_KEY`: API key for accessing Groq AI services.
- `GROQ_MODEL`: Model identifier for Groq AI (e.g. `llama-3.3-70b-versatile`).
- `REDIS_HOST`: Hostname for Redis instance (Default: `localhost`).
- `REDIS_PORT`: Port number for Redis instance (Default: `6379`).
- `REDIS_PASSWORD`: Password for Redis instance (Default: empty).

### Frontend Environment Variables
- `VITE_API_URL`: Backend REST API base URL (e.g. `https://ai-code-reviewer-5f1r.onrender.com` or `http://localhost:8081`).

---

## 🧪 Build

### Build Frontend Bundle
```bash
cd frontend
npm run build
```

### Compile & Package Backend Jar
```bash
cd backend
./mvnw compile
```

To create an executable JAR file:
```bash
cd backend
./mvnw package -DskipTests
```

---

## 🔮 Future Enhancements

- 🔄 **Automated Pull Request Integration**: GitHub Webhook support for automatic PR analysis.
- 🔌 **IDE Extensions**: VS Code and IntelliJ IDEA plugins for direct editor integration.
- 👥 **Collaborative Code Review**: Multi-developer real-time review sessions.
- 📄 **Exportable Reports**: Ability to export code review insights as PDF or Markdown files.
- ⚙️ **Custom Rule Engines**: Custom linting rule configurations for organization-specific code standards.

---

## 👥 Contributors

- **kumari1022**
- **rohith1972**

---

## 📄 License

License information has not been specified yet.

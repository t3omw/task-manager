# Task Manager - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                      (http://localhost:3000)                     │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ HTTP Requests
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                    REACT FRONTEND                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Components                                              │   │
│  │  ├── Login.js        (User authentication UI)           │   │
│  │  ├── Register.js     (New user registration)            │   │
│  │  └── TaskList.js     (Task CRUD operations UI)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Context                                                 │   │
│  │  └── AuthContext.js  (Global authentication state)      │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Services                                                │   │
│  │  └── api.js          (Axios API calls to backend)       │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ REST API (JSON)
                             │ Authorization: Bearer JWT
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│               SPRING BOOT BACKEND                                │
│                (http://localhost:8080)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Controllers (REST Endpoints)                            │   │
│  │  ├── AuthController    POST /api/auth/register          │   │
│  │  │                     POST /api/auth/login             │   │
│  │  └── TaskController    GET    /api/tasks               │   │
│  │                       POST   /api/tasks                 │   │
│  │                       PUT    /api/tasks/{id}            │   │
│  │                       PATCH  /api/tasks/{id}/toggle     │   │
│  │                       DELETE /api/tasks/{id}            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │  Security Layer                                         │     │
│  │  ├── SecurityConfig           (CORS, Auth config)     │     │
│  │  ├── JwtAuthenticationFilter  (Token validation)      │     │
│  │  └── JwtUtil                  (Token generation)      │     │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │  Services (Business Logic)                              │     │
│  │  ├── AuthService      (User authentication)            │     │
│  │  └── TaskService      (Task CRUD operations)           │     │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │  Repositories (Data Access)                             │     │
│  │  ├── UserRepository   (MongoDB queries for users)      │     │
│  │  └── TaskRepository   (MongoDB queries for tasks)      │     │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                     │
│  ┌─────────────────────────▼─────────────────────────────┐     │
│  │  Models (Data Structure)                                │     │
│  │  ├── User            (username, email, password)        │     │
│  │  └── Task            (title, description, priority)     │     │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │ MongoDB Driver
                             │
┌────────────────────────────▼─────────────────────────────────────┐
│                      MONGODB DATABASE                            │
│                   (mongodb://localhost:27017)                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Collections                                             │   │
│  │  ├── users                                               │   │
│  │  │   └── { _id, username, email, password, createdAt }  │   │
│  │  └── tasks                                               │   │
│  │      └── { _id, title, description, priority,           │   │
│  │            completed, userId, createdAt, updatedAt }     │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Request Flow Example

### 1. User Registration
```
Browser → React Register Component → api.js (axios) 
  → POST /api/auth/register → AuthController 
  → AuthService (validate, hash password) 
  → UserRepository → MongoDB (save user) 
  → Return JWT token → Store in localStorage → Redirect to TaskList
```

### 2. Creating a Task
```
Browser → React TaskList Component → api.js with JWT header 
  → POST /api/tasks → JwtAuthenticationFilter (validate token) 
  → TaskController → TaskService 
  → TaskRepository → MongoDB (save task) 
  → Return task object → Update UI
```

### 3. Getting Tasks with Filter
```
Browser → React TaskList (filter button clicked) 
  → GET /api/tasks?status=completed → JwtAuthenticationFilter 
  → TaskController → TaskService → TaskRepository 
  → MongoDB (query completed tasks for user) 
  → Return filtered tasks → Display in cards
```

## Data Flow

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Frontend   │ ───▶ │   Backend    │ ───▶ │   Database   │
│   (React)    │      │(Spring Boot) │      │  (MongoDB)   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │      JSON + JWT      │    MongoDB Driver    │
       │◀────────────────────│◀─────────────────────│
       │      Response        │      Data           │
```

## Security Flow

```
1. User enters credentials
2. Backend validates → Generates JWT token
3. Frontend stores token in localStorage
4. Every API request includes: Authorization: Bearer {token}
5. Backend validates token before processing request
6. If invalid → 401 Unauthorized
7. If valid → Process request and return data
```

## File Structure Relationships

```
Backend Dependencies:
TaskController → TaskService → TaskRepository → Task Model
AuthController → AuthService → UserRepository → User Model
All Controllers ← SecurityConfig (CORS, Auth)
All Protected Routes ← JwtAuthenticationFilter

Frontend Dependencies:
App.js → AuthProvider (Context)
App.js → Login/Register/TaskList Components
Components → api.js (API calls)
api.js → axios with JWT interceptor
```

## Key Technologies Integration

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React | UI Components |
| Styling | Bootstrap + CSS | Responsive Design |
| State | Context API | Global Auth State |
| HTTP Client | Axios | API Communication |
| Backend | Spring Boot | REST API Server |
| Security | Spring Security + JWT | Authentication |
| Database | MongoDB | NoSQL Data Storage |
| Validation | Bean Validation | Input Validation |
| Logging | SLF4J/Logback | Application Logging |

## Running the Application

```bash
# Terminal 1 - Database
mongod

# Terminal 2 - Backend
cd backend
mvn spring-boot:run
# → Runs on port 8080

# Terminal 3 - Frontend  
cd frontend
npm start
# → Runs on port 3000
```

All three must be running simultaneously for the application to work!

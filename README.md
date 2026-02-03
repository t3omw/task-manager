# Task Manager - Full Stack Application

A modern full-stack task management application built with **Java Spring Boot** (backend) and **React** (frontend).

## 🚀 Features

### Core Requirements ✅
- ✅ **User Authentication**: Register and Login
- ✅ **CRUD Operations**: Create, Read, Update, Delete tasks
- ✅ **RESTful API**: Clean API endpoints
- ✅ **MongoDB Database**: NoSQL database integration
- ✅ **Frontend-Backend Separation**: Decoupled architecture

### Bonus Features ⭐
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Search/Filter/Sort**: Filter by status and priority
- ✅ **Application Logging**: Comprehensive logging with SLF4J
- ✅ **Responsive UI**: Bootstrap-based responsive design
- ✅ **Clean UI**: Modern gradient background and card-based layout

## 📋 Prerequisites

Before running this application, ensure you have:

- **Java 17** or higher
- **Maven 3.6+**
- **Node.js 16+** and **npm**
- **MongoDB** (running on localhost:27017)

## 🛠️ Technology Stack

### Backend
- Java Spring Boot 3.2.0
- Spring Security
- Spring Data MongoDB
- JWT (jsonwebtoken 0.11.5)
- Lombok
- Maven

### Frontend
- React 18.2.0
- Bootstrap 5.3.0
- React Bootstrap 2.9.0
- Axios
- CSS3

## 📁 Project Structure

```
task-manager/
├── backend/                    # Spring Boot Backend
│   ├── src/main/java/com/taskmanager/
│   │   ├── TaskManagerApplication.java
│   │   ├── config/
│   │   │   └── SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   └── TaskController.java
│   │   ├── dto/
│   │   │   ├── AuthResponse.java
│   │   │   ├── LoginRequest.java
│   │   │   ├── RegisterRequest.java
│   │   │   └── TaskRequest.java
│   │   ├── model/
│   │   │   ├── Task.java
│   │   │   └── User.java
│   │   ├── repository/
│   │   │   ├── TaskRepository.java
│   │   │   └── UserRepository.java
│   │   ├── security/
│   │   │   ├── JwtAuthenticationFilter.java
│   │   │   └── JwtUtil.java
│   │   └── service/
│   │       ├── AuthService.java
│   │       └── TaskService.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
└── frontend/                   # React Frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── TaskList.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

## 🔧 Installation & Setup

### 1. Start MongoDB

Make sure MongoDB is running on your local machine:
```bash
mongod
```

Or if using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

The frontend will start on `http://localhost:3000`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Tasks (Protected - Requires JWT Token)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks?status=completed` - Get completed tasks
- `GET /api/tasks?status=pending` - Get pending tasks
- `GET /api/tasks?priority=HIGH` - Get tasks by priority
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `PATCH /api/tasks/{id}/toggle` - Toggle task completion status
- `DELETE /api/tasks/{id}` - Delete a task

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john_doe",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Create Task:**
```json
POST /api/tasks
Headers: Authorization: Bearer {token}
{
  "title": "Complete project",
  "description": "Finish the full-stack application",
  "priority": "HIGH"
}

Response:
{
  "id": "507f1f77bcf86cd799439012",
  "title": "Complete project",
  "description": "Finish the full-stack application",
  "priority": "HIGH",
  "completed": false,
  "userId": "507f1f77bcf86cd799439011",
  "createdAt": "2024-02-03T10:30:00",
  "updatedAt": "2024-02-03T10:30:00"
}
```

## 🎨 Features Demo

### 1. User Registration
- Create a new account with username, email, and password
- Input validation and error handling
- Automatic login after registration

### 2. User Login
- Secure JWT-based authentication
- Token stored in localStorage
- Auto-redirect to tasks on successful login

### 3. Task Management
- **Create**: Add new tasks with title, description, and priority
- **Read**: View all tasks in a responsive card layout
- **Update**: Edit existing tasks
- **Delete**: Remove tasks with confirmation

### 4. Filtering & Sorting
- Filter by status (All, Pending, Completed)
- Filter by priority (High, Medium, Low)
- Tasks sorted by creation date (newest first)

### 5. Task Status Toggle
- Quick toggle between completed/pending
- Visual indication with strikethrough text
- Color-coded priority badges

## 🔐 Security Features

- Password encryption using BCrypt
- JWT-based stateless authentication
- Token expiration (24 hours)
- Protected API endpoints
- CORS configuration for frontend-backend communication

## 📝 Configuration

### Backend Configuration (`application.properties`)

```properties
# Server
server.port=8080

# MongoDB
spring.data.mongodb.uri=mongodb://localhost:27017/taskmanager
spring.data.mongodb.database=taskmanager

# JWT
jwt.secret=mySecretKeyForJWTTokenGenerationPleaseChangeThisInProduction
jwt.expiration=86400000

# CORS
allowed.origins=http://localhost:3000
```

### Frontend Configuration (`src/services/api.js`)

```javascript
const API_URL = 'http://localhost:8080/api';
```

## 🧪 Testing the Application

1. **Start both backend and frontend**
2. **Open browser** to `http://localhost:3000`
3. **Register a new account**
4. **Create some tasks** with different priorities
5. **Test CRUD operations**:
   - Create a task
   - Edit the task
   - Mark as completed
   - Delete the task
6. **Test filters**: Try filtering by status and priority
7. **Logout and login** again to verify JWT persistence

## 📊 Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "username": String (unique),
  "email": String (unique),
  "password": String (hashed),
  "createdAt": DateTime
}
```

### Tasks Collection
```javascript
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "priority": String (LOW/MEDIUM/HIGH),
  "completed": Boolean,
  "userId": String (ref: User._id),
  "createdAt": DateTime,
  "updatedAt": DateTime
}
```

## 🎯 Git Commit History

Example of clean commit messages:
```bash
git init
git add .
git commit -m "Initial commit: Project structure setup"
git commit -m "Backend: Add User model and authentication"
git commit -m "Backend: Implement JWT security"
git commit -m "Backend: Add Task CRUD operations"
git commit -m "Frontend: Create authentication components"
git commit -m "Frontend: Implement task management UI"
git commit -m "Frontend: Add filtering and styling"
git commit -m "Docs: Add comprehensive README"
```

## 🚨 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongosh

# If connection fails, ensure MongoDB is started
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### Port Already in Use
```bash
# Backend (8080)
lsof -ti:8080 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
Ensure `allowed.origins` in `application.properties` matches your frontend URL.

## 📱 Screenshots

The application features:
- Modern gradient purple background
- Card-based task layout
- Color-coded priority badges (Red=High, Yellow=Medium, Blue=Low)
- Responsive design for mobile and desktop
- Smooth hover animations

## 🔄 Future Enhancements

- Task due dates and reminders
- Task categories/tags
- Drag-and-drop task reordering
- User profile management
- Dark mode theme
- Task search functionality
- Email notifications

## 👨‍💻 Author

Created as a demonstration of full-stack development skills with:
- Clean code architecture
- RESTful API design
- Modern UI/UX principles
- Security best practices
- Comprehensive documentation

## 📄 License

This project is created for educational and demonstration purposes.

---

**Ready for Interview Demo! 🎉**

# Quick Start Guide

## Prerequisites Check
```bash
# Check Java version (need 17+)
java -version

# Check Maven
mvn -version

# Check Node.js
node -v

# Check npm
npm -v

# Check MongoDB
mongosh
```

## Setup in 3 Steps

### Step 1: Start MongoDB
```bash
# Start MongoDB service
mongod

# Or with Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Step 2: Start Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
✅ Backend running on http://localhost:8080

### Step 3: Start Frontend
```bash
# Open new terminal
cd frontend
npm install
npm start
```
✅ Frontend running on http://localhost:3000

## Test the Application

1. Open browser: http://localhost:3000
2. Click "Register here"
3. Create account with:
   - Username: testuser
   - Email: test@example.com
   - Password: password123
4. Add your first task!

## API Test with curl

### Register:
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Login:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Create Task (replace YOUR_TOKEN):
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"My First Task","description":"Task description","priority":"HIGH"}'
```

### Get All Tasks:
```bash
curl -X GET http://localhost:8080/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Interview Demo Checklist

✅ Show user registration
✅ Show user login
✅ Create multiple tasks with different priorities
✅ Edit a task
✅ Mark task as completed
✅ Filter by status (pending/completed)
✅ Filter by priority (high/medium/low)
✅ Delete a task
✅ Show responsive design (resize browser)
✅ Show logout and login again

## Troubleshooting

**MongoDB not running?**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Port already in use?**
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Can't connect to backend from frontend?**
- Check if backend is running on port 8080
- Check CORS settings in application.properties
- Clear browser cache and reload

## Project Highlights for Interview

1. **Clean Architecture**: Separated concerns with controllers, services, repositories
2. **Security**: JWT authentication, password encryption
3. **Best Practices**: DTOs, validation, error handling, logging
4. **Modern UI**: Bootstrap, responsive design, smooth animations
5. **RESTful API**: Proper HTTP methods and status codes
6. **Database**: MongoDB with proper indexing
7. **Git History**: Clear, descriptive commit messages

Good luck with your interview! 🚀

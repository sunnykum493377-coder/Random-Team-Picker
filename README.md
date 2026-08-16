# Student Team Manager

A full-stack web application for managing student teams with random assignment and automatic leader selection. Built with React, Express, and MongoDB.

## Features

- 🔐 **Authentication System** - JWT-based login for students and admin
- 👥 **Random Team Generation** - Creates teams of 3 students with random leader selection
- 📊 **Admin Dashboard** - Manage teams and view all students
- 🎯 **Student Dashboard** - View assigned team and leader status
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Beautiful gradient backgrounds and smooth animations

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3 with animations

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- MongoDB (running locally or connection string to MongoDB Atlas)
- npm or yarn package manager

## Installation

### 1. Clone the repository or download the files

```bash
cd Random-team-maker
```

### 2. Install backend dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
cd ..
```

### 4. Configure environment variables

The `.env` file should already exist in the root directory with these settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-team-manager
JWT_SECRET=your-secret-key-change-this-in-production-2024
NODE_ENV=development
```

**Important:** If using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

### 5. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
# MongoDB should be running as a service, or start it manually
mongod
```

**Mac (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 6. Seed the database

This will create an admin user and 75 students:

```bash
npm run seed
```

You should see:
```
✓ Connected to MongoDB
✓ Cleared existing students
✓ Created admin user (username: admin, password: admin123)
✓ Created 75 students (student1-student75, password: pass1-pass75)
```

## Running the Application

### Option 1: Run backend and frontend separately (Recommended for development)

**Terminal 1 - Start the backend:**
```bash
npm run server
```
Backend will run on http://localhost:5000

**Terminal 2 - Start the frontend:**
```bash
npm run client
```
Frontend will run on http://localhost:3000

### Option 2: Development mode

```bash
npm run dev
```

This starts only the backend. You'll need to run the frontend separately.

## Usage

### Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Students:**
- Username: `student1` to `student75`
- Password: `pass1` to `pass75`

### Admin Workflow

1. Login with admin credentials
2. View total students and teams count
3. Click "Generate Random Teams" to create teams
4. View all generated teams with members and leaders
5. Regenerate teams anytime (will replace existing teams)

### Student Workflow

1. Login with student credentials
2. View your assigned team (if teams have been generated)
3. See who your team leader is
4. Check if you are the team leader (special banner appears)

## Features in Detail

### Random Team Generation Algorithm

- Uses Fisher-Yates shuffle for true randomization
- Creates teams of exactly 3 members
- Randomly selects one member as team leader in each team
- Handles cases where student count isn't divisible by 3

### Authentication

- Secure JWT-based authentication
- Passwords hashed with bcrypt
- Protected routes for admin and student dashboards
- Token stored in localStorage with 24-hour expiration

### Responsive Design

- Mobile-first approach
- Breakpoints at 768px and 480px
- Touch-friendly interface
- Optimized layouts for all screen sizes

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user info

### Teams (Protected)
- `POST /api/teams/generate` - Generate random teams (Admin only)
- `GET /api/teams/all` - Get all teams (Admin only)
- `GET /api/teams/count` - Get team count (Admin only)
- `GET /api/teams/my-team` - Get student's assigned team

### Students (Protected)
- `GET /api/students` - Get all students (Admin only)
- `GET /api/students/count` - Get student count (Admin only)

## Project Structure

```
Random-team-maker/
├── server/
│   ├── models/
│   │   ├── Student.js        # Student schema
│   │   └── Team.js           # Team schema
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── students.js       # Student routes
│   │   └── teams.js          # Team routes
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── index.js              # Express server setup
│   └── seed.js               # Database seeding script
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js      # Login page
│   │   │   ├── AdminDashboard.js
│   │   │   └── StudentDashboard.js
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── utils/
│   │   │   └── api.js        # Axios instance
│   │   ├── App.js            # Main app component
│   │   └── index.js          # React entry point
│   └── package.json
├── .env                      # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Troubleshooting

### MongoDB Connection Error

If you see "MongoDB connection error":
- Make sure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

If port 5000 or 3000 is already in use:
- Change `PORT` in `.env` for backend
- Frontend will automatically use the next available port

### CORS Issues

The backend is configured to allow all origins with `cors()`. In production, configure specific origins:

```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### Authentication Issues

If authentication isn't working:
- Clear localStorage in browser dev tools
- Check if JWT_SECRET matches in `.env`
- Ensure MongoDB is running and seeded

## Production Deployment

### Backend (Express + MongoDB)

1. Set environment variables on your hosting platform
2. Use MongoDB Atlas for production database
3. Update CORS settings for your frontend domain
4. Change JWT_SECRET to a strong random string

### Frontend (React)

1. Create `.env` in client folder:
```env
REACT_APP_API_URL=https://your-backend-domain.com/api
```

2. Build the React app:
```bash
cd client
npm run build
```

3. Deploy the `client/build` folder to your hosting service

### Recommended Hosting

- **Backend:** Render, Railway, Heroku
- **Frontend:** Vercel, Netlify, Render
- **Database:** MongoDB Atlas

## License

ISC

## Support

For issues or questions, please create an issue in the repository.

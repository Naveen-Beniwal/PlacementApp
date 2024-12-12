# Placement Portal - Campus Recruitment Management System

A comprehensive MERN stack application facilitating campus placements by connecting students, recruiters, and administrators through an intuitive interface with analytics and data export capabilities.

## Technology Stack

### Backend
- Node.js & Express.js (RESTful API)
- MongoDB with Mongoose ODM
- JWT Authentication
- Role-based access control

### Frontend
- React 18
- Material-UI v5
- Chart.js for analytics
- XLSX for data export
- Axios for API calls

## Features & Implementation

### Admin Dashboard
- Real-time placement analytics
- Interactive statistics using Chart.js
- Data export functionality (CSV/Excel)
- User management system

### Student Interface
- Profile management with academic details
- Job application system with status tracking
- Department-specific opportunities

### Recruiter Portal
- Job posting management
- Application review system
- Candidate shortlisting

## Project Setup

### Prerequisites
- Node.js v16+
- MongoDB
- npm/yarn

### Installation Commands
```bash
# Clone Repository
git clone https://github.com/yourusername/placement-portal
cd placement-portal

# Backend Setup
cd backend
npm install

# Configure Environment
echo "MONGODB_URI=your_mongodb_uri\nJWT_SECRET=your_secret_key\nPORT=5000" > .env

# Frontend Setup
cd ../frontend
npm install

# Start Development (Run in separate terminals)
# Terminal 1
cd backend
npm start

# Terminal 2
cd frontend
npm start

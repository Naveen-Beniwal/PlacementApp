<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Placement Portal - README</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 20px;
        }
        h1, h2, h3, h4 {
            color: #333;
        }
        ul {
            list-style-type: disc;
            margin-left: 20px;
        }
        pre {
            background: #f4f4f4;
            padding: 10px;
            border: 1px solid #ddd;
            overflow-x: auto;
        }
        code {
            font-family: Consolas, "Courier New", monospace;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <h1>Placement Portal - Campus Recruitment Management System</h1>
    <p>A comprehensive MERN stack application facilitating campus placements by connecting students, recruiters, and administrators through an intuitive interface with analytics and data export capabilities.</p>
    
    <h2>Technology Stack</h2>
    <h3>Backend</h3>
    <ul>
        <li>Node.js & Express.js (RESTful API)</li>
        <li>MongoDB with Mongoose ODM</li>
        <li>JWT Authentication</li>
        <li>Role-based access control</li>
    </ul>
    
    <h3>Frontend</h3>
    <ul>
        <li>React 18</li>
        <li>Material-UI v5</li>
        <li>Chart.js for analytics</li>
        <li>XLSX for data export</li>
        <li>Axios for API calls</li>
    </ul>
    
    <h2>Features & Implementation</h2>
    <h3>Admin Dashboard</h3>
    <ul>
        <li>Real-time placement analytics</li>
        <li>Interactive statistics using Chart.js</li>
        <li>Data export functionality (CSV/Excel)</li>
        <li>User management system</li>
    </ul>
    
    <h3>Student Interface</h3>
    <ul>
        <li>Profile management with academic details</li>
        <li>Job application system with status tracking</li>
        <li>Department-specific opportunities</li>
    </ul>
    
    <h3>Recruiter Portal</h3>
    <ul>
        <li>Job posting management</li>
        <li>Application review system</li>
        <li>Candidate shortlisting</li>
    </ul>
    
    <h2>Project Setup</h2>
    <h3>Prerequisites</h3>
    <ul>
        <li>Node.js v16+</li>
        <li>MongoDB</li>
        <li>npm/yarn</li>
    </ul>
    
    <h3>Installation Commands</h3>
    <pre><code>
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
    </code></pre>
    
    <h2>Project Structure</h2>
    <pre><code>
placement-portal/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Profile.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   └── jobs.js
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── admin/
    │   │   │   └── DataExport.js
    │   │   ├── charts/
    │   │   │   └── AdminChart.js
    │   │   └── dashboards/
    │   │       └── AdminDashboard.js
    │   ├── utils/
    │   │   └── axios.js
    │   └── App.js
    </code></pre>
    
    <h2>API Documentation</h2>
    <h3>Authentication</h3>
    <ul>
        <li>POST /api/auth/login - User login</li>
        <li>POST /api/auth/register - User registration</li>
    </ul>
    
    <h3>Admin Routes</h3>
    <ul>
        <li>GET /api/admin/stats - Dashboard statistics</li>
        <li>GET /api/admin/students - Get all students</li>
        <li>GET /api/admin/jobs - Get all jobs</li>
        <li>GET /api/admin/applications - Get all applications</li>
    </ul>
    
    <h3>Student Routes</h3>
    <ul>
        <li>GET /api/student/profile - Get profile</li>
        <li>PUT /api/student/profile - Update profile</li>
        <li>POST /api/student/apply - Apply for job</li>
    </ul>
    
    <h3>Recruiter Routes</h3>
    <ul>
        <li>POST /api/recruiter/jobs - Create job</li>
        <li>GET /api/recruiter/jobs - View jobs</li>
        <li>PATCH /api/recruiter/jobs/:id - Update job</li>
    </ul>
    
    <h2>Key Components</h2>
    <h3>Data Export System</h3>
    <ul>
        <li>Multiple format support (CSV/Excel)</li>
        <li>Date range filtering</li>
        <li>Progress tracking</li>
        <li>Field selection</li>
        <li>Error handling</li>
    </ul>
    
    <h3>Analytics Dashboard</h3>
    <ul>
        <li>Real-time statistics</li>
        <li>Interactive charts</li>
        <li>Department-wise analysis</li>
        <li>Monthly trends</li>
        <li>Status distribution</li>
    </ul>
    
    <h3>Security Implementation</h3>
    <ul>
        <li>JWT based authentication</li>
        <li>Role-based access control</li>
        <li>Protected API routes</li>
        <li>Input validation</li>
        <li>Error handling</li>
    </ul>
    
    <h2>Development Tools</h2>
    <ul>
        <li>Visual Studio Code</li>
        <li>MongoDB Compass</li>
        <li>Postman for API testing</li>
        <li>Git for version control</li>
    </ul>
    
    <h2>Current Status</h2>
    <ul>
        <li>Core features implemented</li>
        <li>Authentication system working</li>
        <li>Admin dashboard functional</li>
        <li>Data export capability</li>
        <li>Interactive charts</li>
        <li>Basic CRUD operations</li>
    </ul>
    
    <h2>Future Enhancements</h2>
    <ul>
        <li>Email notification system</li>
        <li>Document upload functionality</li>
        <li>Advanced filtering options</li>
        <li>Bulk operations</li>
        <li>Mobile application</li>
        <li>Interview scheduling</li>
        <li>Performance analytics</li>
        <li>PDF report generation</li>
    </ul>
    
    <h2>License</h2>
    <p>MIT License</p>
    
    <p>© 2024 Placement Portal</p>
    
    <hr />
    
    <p>Contact: your.email@domain.com</p>
    <p>GitHub: <a href="https://github.com/yourusername">github.com/yourusername</a></p>
    <p>Demo: <a href="https://your-demo-url.com">your-demo-url.com</a></p>
    
    <p><em>[Replace placeholders with actual values before deployment]</em></p>
</body>
</html>

// // src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./components/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/dashboards/AdminDashboard";
import StudentDashboard from "./components/dashboards/StudentDashboard";
import RecruiterDashboard from "./components/dashboards/RecruiterDashboard";
import Profile from "./components/Profile";
import Jobs from "./components/Jobs";
import Applications from "./components/Applications";
import PrivateRoute from "./utils/PrivateRoute";
import DataExport from "./components/admin/DataExport";
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/export"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <DataExport />
              </PrivateRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <Jobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <PrivateRoute allowedRoles={["student"]}>
                <Applications />
              </PrivateRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/*"
            element={
              <PrivateRoute allowedRoles={["recruiter"]}>
                <RecruiterDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <PrivateRoute allowedRoles={["recruiter"]}>
                <Jobs />
              </PrivateRoute>
            }
          />
          <Route
            path="/recruiter/applications"
            element={
              <PrivateRoute allowedRoles={["recruiter"]}>
                <Applications />
              </PrivateRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

// applying lazy loading
// import React, { Suspense, lazy } from "react";
// import { CircularProgress, Box } from "@mui/material";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import PrivateRoute from "./components/PrivateRoute";

// // Lazy load components
// const Login = lazy(() => import("./components/Auth/Login"));
// const Register = lazy(() => import("./components/Auth/Register"));

// // Admin Components
// const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
// const DataExport = lazy(() => import("./components/admin/DataExport"));

// // Student Components
// const StudentDashboard = lazy(() =>
//   import("./components/dashboards/StudentDashboard")
// );
// const Profile = lazy(() => import("./components/Profile"));
// const Jobs = lazy(() => import("./components/Jobs"));
// const Applications = lazy(() => import("./components/Applications"));
// const ResumeBuilder = lazy(() => import("./components/ResumeBuilder"));

// // Recruiter Components
// const RecruiterDashboard = lazy(() =>
//   import("./components/dashboards/RecruiterDashboard")
// );
// const JobPostings = lazy(() => import("./components/JobPostings"));

// function App() {
//   return (
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         <Navbar />
//         <Suspense
//           fallback={
//             <Box sx={{ display: "flex", justifyContent: "center", mt: "20vh" }}>
//               <CircularProgress />
//             </Box>
//           }
//         >
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />

//             {/* Admin Routes */}
//             <Route
//               path="/admin/*"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <AdminDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/admin/export"
//               element={
//                 <PrivateRoute allowedRoles={["admin"]}>
//                   <DataExport />
//                 </PrivateRoute>
//               }
//             />

//             {/* Student Routes */}
//             <Route
//               path="/student/*"
//               element={
//                 <PrivateRoute allowedRoles={["student"]}>
//                   <StudentDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/student/profile"
//               element={
//                 <PrivateRoute allowedRoles={["student"]}>
//                   <Profile />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/student/jobs"
//               element={
//                 <PrivateRoute allowedRoles={["student"]}>
//                   <Jobs />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/student/applications"
//               element={
//                 <PrivateRoute allowedRoles={["student"]}>
//                   <Applications />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/student/resume"
//               element={
//                 <PrivateRoute allowedRoles={["student"]}>
//                   <ResumeBuilder />
//                 </PrivateRoute>
//               }
//             />

//             {/* Recruiter Routes */}
//             <Route
//               path="/recruiter/*"
//               element={
//                 <PrivateRoute allowedRoles={["recruiter"]}>
//                   <RecruiterDashboard />
//                 </PrivateRoute>
//               }
//             />
//             <Route
//               path="/recruiter/jobs"
//               element={
//                 <PrivateRoute allowedRoles={["recruiter"]}>
//                   <JobPostings />
//                 </PrivateRoute>
//               }
//             />

//             {/* Default Route */}
//             <Route path="/" element={<Login />} />
//           </Routes>
//         </Suspense>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;

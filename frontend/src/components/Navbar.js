// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import { getRole } from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();
  const role = getRole();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderNavLinks = () => {
    switch (role) {
      case "admin":
        return (
          <>
            <Button color="inherit" component={Link} to="/admin/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/admin/students">
              Students
            </Button>
            <Button color="inherit" component={Link} to="/admin/jobs">
              Jobs
            </Button>
          </>
        );
      case "student":
        return (
          <>
            <Button color="inherit" component={Link} to="/student/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/student/jobs">
              Jobs
            </Button>
            <Button color="inherit" component={Link} to="/student/applications">
              Applications
            </Button>
            <Button color="inherit" component={Link} to="/student/profile">
              Profile
            </Button>
          </>
        );
      case "recruiter":
        return (
          <>
            <Button color="inherit" component={Link} to="/recruiter/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/recruiter/jobs">
              Jobs
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/recruiter/applications"
            >
              Applications
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
          }}
        >
          Placement Portal
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {renderNavLinks()}
          {role ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;

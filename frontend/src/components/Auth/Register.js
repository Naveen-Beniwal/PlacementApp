// src/components/Auth/Register.js
import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    company: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.role === "recruiter" && !formData.company) {
      setError("Company name is required for recruiters");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post("/auth/register", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: formData.company,
      });

      // Redirect to login on success
      navigate("/login", {
        state: { message: "Registration successful. Please login." },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            disabled={loading}
            required
          />

          <TextField
            fullWidth
            type="password"
            label="Password"
            margin="normal"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            disabled={loading}
            required
          />

          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            margin="normal"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
            disabled={loading}
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              disabled={loading}
              required
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="recruiter">Recruiter</MenuItem>
            </Select>
          </FormControl>

          {formData.role === "recruiter" && (
            <TextField
              fullWidth
              label="Company Name"
              margin="normal"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              disabled={loading}
              required
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Register"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;

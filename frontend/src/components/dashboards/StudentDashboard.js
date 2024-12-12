// src/components/dashboards/StudentDashboard.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Box,
} from "@mui/material";
import axiosInstance from "../../utils/axios";

function StudentDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    shortlisted: 0,
    selected: 0,
  });
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [jobsRes, applicationsRes] = await Promise.all([
        axiosInstance.get("/jobs/available"),
        axiosInstance.get("/applications/my"),
      ]);
      setJobs(jobsRes.data);
      setMyApplications(applicationsRes.data);

      // Calculate stats
      const stats = {
        totalApplications: applicationsRes.data.length,
        shortlisted: applicationsRes.data.filter(
          (app) => app.status === "shortlisted"
        ).length,
        selected: applicationsRes.data.filter(
          (app) => app.status === "selected"
        ).length,
      };
      setStats(stats);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const applyForJob = async (jobId) => {
    try {
      await axiosInstance.post("/applications", { jobId });
      setOpenDialog(false);
      fetchDashboardData();
    } catch (error) {
      setError("Failed to apply for job");
    }
  };

  if (loading) {
    return (
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Student Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h4">{stats.totalApplications}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Shortlisted</Typography>
            <Typography variant="h4">{stats.shortlisted}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Selected</Typography>
            <Typography variant="h4">{stats.selected}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Available Jobs
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Requirements</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job._id}>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.title}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {job.requirements.map((req, index) => (
                          <Chip key={index} label={req} size="small" />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>{job.status}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSelectedJob(job);
                          setOpenDialog(true);
                        }}
                        disabled={job.hasApplied}
                      >
                        {job.hasApplied ? "Applied" : "Apply"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              My Applications
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Company</TableCell>
                  <TableCell>Position</TableCell>
                  <TableCell>Applied Date</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {myApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{app.job.company}</TableCell>
                    <TableCell>{app.job.title}</TableCell>
                    <TableCell>
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)
                        }
                        color={
                          app.status === "selected"
                            ? "success"
                            : app.status === "shortlisted"
                            ? "primary"
                            : app.status === "rejected"
                            ? "error"
                            : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
              <Typography>
                <strong>Company:</strong> {selectedJob.company}
              </Typography>
              <Typography>
                <strong>Position:</strong> {selectedJob.title}
              </Typography>
              <Typography>
                <strong>Description:</strong> {selectedJob.description}
              </Typography>
              <Typography>
                <strong>Requirements:</strong>
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {selectedJob.requirements.map((req, index) => (
                  <Chip key={index} label={req} />
                ))}
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => applyForJob(selectedJob._id)}
          >
            Confirm Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default StudentDashboard;

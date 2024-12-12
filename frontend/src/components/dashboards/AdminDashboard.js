// frontend/src/components/dashboards/AdminDashboard.js
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
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import axiosInstance from "../../utils/axios";
import AdminChart from "../charts/AdminChart";
import { Link } from "react-router-dom";
import { Download } from "@mui/icons-material";
function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function AdminDashboard() {
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
    selectedStudents: 0,
  });

  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, studentsRes, jobsRes, applicationsRes] =
        await Promise.all([
          axiosInstance.get("/admin/stats"),
          axiosInstance.get("/admin/students"),
          axiosInstance.get("/admin/jobs"),
          axiosInstance.get("/admin/applications"),
        ]);

      setStats(statsRes.data);
      setStudents(studentsRes.data);
      setJobs(jobsRes.data || []); // Initialize as empty array if null
      setApplications(applicationsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
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
        <Link to="/admin/export">
          <Button startIcon={<Download />}>Export Data</Button>
        </Link>
        <Grid item xs={12}>
          <AdminChart />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{stats.totalStudents}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Jobs</Typography>
            <Typography variant="h4">{stats.totalJobs}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Applications</Typography>
            <Typography variant="h4">{stats.totalApplications}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Selected</Typography>
            <Typography variant="h4">{stats.selectedStudents}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <Tabs value={value} onChange={(e, newValue) => setValue(newValue)}>
              <Tab label="Students" />
              <Tab label="Jobs" />
              <Tab label="Applications" />
            </Tabs>

            <TabPanel value={value} index={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>CGPA</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>{student.profile?.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student.profile?.department}</TableCell>
                      <TableCell>{student.profile?.cgpa}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            setSelectedItem(student);
                            setOpenDialog(true);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Applications</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {jobs &&
                    jobs.map((job) => (
                      <TableRow key={job._id}>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.title}</TableCell>
                        <TableCell>{job.applicationCount || 0}</TableCell>
                        <TableCell>
                          <Chip
                            label={job.status}
                            color={
                              job.status === "open" ? "success" : "default"
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setSelectedItem(job);
                              setOpenDialog(true);
                            }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TabPanel>

            <TabPanel value={value} index={2}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Company</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>{app.student?.profile?.name}</TableCell>
                      <TableCell>{app.job?.company}</TableCell>
                      <TableCell>{app.job?.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={app.status}
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
                      <TableCell>
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {value === 0
            ? "Student Details"
            : value === 1
            ? "Job Details"
            : "Application Details"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedItem && value === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>
                  <strong>Name:</strong> {selectedItem.profile?.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedItem.email}
                </Typography>
                <Typography>
                  <strong>Roll Number:</strong>{" "}
                  {selectedItem.profile?.rollNumber}
                </Typography>
                <Typography>
                  <strong>Department:</strong>{" "}
                  {selectedItem.profile?.department}
                </Typography>
                <Typography>
                  <strong>CGPA:</strong> {selectedItem.profile?.cgpa}
                </Typography>
              </Grid>
              {selectedItem.profile?.skills?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Skills</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedItem.profile.skills.map((skill, index) => (
                      <Chip key={index} label={skill} />
                    ))}
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AdminDashboard;

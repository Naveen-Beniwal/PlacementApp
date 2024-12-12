// src/components/dashboards/RecruiterDashboard.js
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
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  ListItemText,
  Checkbox,
  OutlinedInput,
  Chip,
  Box,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Divider,
  TablePagination,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axios";

const departments = [
  "Computer Science",
  "Information Technology",
  "Electronics",
  "Mechanical",
  "Electrical",
];

const applicationStatuses = ["applied", "shortlisted", "selected", "rejected"];

function RecruiterDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    selectedCandidates: 0,
  });

  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    status: "all",
    department: "all",
  });

  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    eligibility: {
      departments: [],
      minCGPA: "",
      batch: new Date().getFullYear(),
    },
    salary: {
      ctc: "",
      breakup: "",
    },
    rounds: [
      {
        name: "",
        description: "",
        date: null,
        venue: "",
      },
    ],
    numberOfPositions: "",
    applicationDeadline: "",
    status: "open",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, applicationsRes] = await Promise.all([
        axiosInstance.get("/recruiter/stats"),
        axiosInstance.get("/recruiter/applications"),
      ]);
      setStats(statsRes.data);

      setApplications(applicationsRes.data);
    } catch (error) {
      console.error("Dashboard error:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  const handleCreateJob = async () => {
    try {
      // Validate required fields
      if (
        !newJob.title ||
        !newJob.description ||
        !newJob.eligibility.departments.length ||
        !newJob.eligibility.minCGPA ||
        !newJob.eligibility.batch || // Add batch validation
        !newJob.numberOfPositions ||
        !newJob.applicationDeadline
      ) {
        setError("Please fill all required fields");
        return;
      }

      // Format job data
      const jobData = {
        ...newJob,
        requirements: newJob.requirements.split(",").map((r) => r.trim()),
        eligibility: {
          ...newJob.eligibility,
          minCGPA: parseFloat(newJob.eligibility.minCGPA),
          batch: parseInt(newJob.eligibility.batch),
        },
        numberOfPositions: parseInt(newJob.numberOfPositions),
      };

      await axiosInstance.post("/recruiter/jobs", jobData);
      setOpenJobDialog(false);
      fetchDashboardData();
      setError("");
    } catch (error) {
      console.error("Error creating job:", error);
      setError(error.response?.data?.message || "Failed to create job");
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      await axiosInstance.put(
        `/recruiter/applications/${applicationId}/status`,
        {
          status: newStatus,
        }
      );
      fetchDashboardData();
    } catch (error) {
      setError("Failed to update application status");
    }
  };

  const handleAddRound = () => {
    setNewJob({
      ...newJob,
      rounds: [
        ...newJob.rounds,
        { name: "", description: "", date: null, venue: "" },
      ],
    });
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = [...newJob.rounds];
    updatedRounds.splice(index, 1);
    setNewJob({ ...newJob, rounds: updatedRounds });
  };

  const filteredApplications = applications.filter((app) => {
    if (filters.status !== "all" && app.status !== filters.status) return false;
    if (
      filters.department !== "all" &&
      app.student?.profile?.department !== filters.department
    )
      return false;
    return true;
  });

  if (loading)
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Recruiter Dashboard</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenJobDialog(true)}
          >
            Post New Job
          </Button>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Total Jobs</Typography>
            <Typography variant="h4">{stats.totalJobs}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Active Jobs</Typography>
            <Typography variant="h4">{stats.activeJobs}</Typography>
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
            <Typography variant="h4">{stats.selectedCandidates}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">Applications</Typography>
              <Box>
                <FormControl sx={{ minWidth: 120, mr: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    size="small"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {applicationStatuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={filters.department}
                    onChange={(e) =>
                      setFilters({ ...filters, department: e.target.value })
                    }
                    size="small"
                  >
                    <MenuItem value="all">All</MenuItem>
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Job Title</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>CGPA</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* {console.log("filtered applications ", filteredApplications)} */}
                {/* {console.log(
                  "filtered applications profile ",
                  filteredApplications.student.profile
                )} */}
                {filteredApplications
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        {app.student?.profile?.name || "N/A"}
                      </TableCell>
                      <TableCell>{app.job?.title || "N/A"}</TableCell>
                      <TableCell>
                        {app.student?.profile?.department || "N/A"}
                      </TableCell>
                      <TableCell>
                        {app.student?.profile?.cgpa || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Select
                          value={app.status}
                          onChange={(e) =>
                            updateApplicationStatus(app._id, e.target.value)
                          }
                          size="small"
                        >
                          {applicationStatuses.map((status) => (
                            <MenuItem key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedStudent(app.student);
                            setOpenDialog(true);
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={filteredApplications.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </Paper>
        </Grid>
      </Grid>

      {/* Student Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStudent?.profile && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Personal Information</Typography>
                <Typography>
                  <strong>Name:</strong> {selectedStudent.profile.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {selectedStudent.email}
                </Typography>
                <Typography>
                  <strong>Roll Number:</strong>{" "}
                  {selectedStudent.profile.rollNumber}
                </Typography>
                <Typography>
                  <strong>Department:</strong>{" "}
                  {selectedStudent.profile.department}
                </Typography>
                <Typography>
                  <strong>CGPA:</strong> {selectedStudent.profile.cgpa}
                </Typography>
                <Typography>
                  <strong>Batch:</strong> {selectedStudent.profile.batch}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Skills</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedStudent.profile.skills.map((skill, index) => (
                    <Chip key={index} label={skill} />
                  ))}
                </Box>
              </Grid>
              {selectedStudent.profile.education?.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6">Education</Typography>
                  {selectedStudent.profile.education.map((edu, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography>
                        {edu.institution} - {edu.degree} ({edu.year})
                      </Typography>
                      <Typography>Score: {edu.score}</Typography>
                    </Box>
                  ))}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* New Job Dialog */}
      {/* <Dialog
        open={openJobDialog}
        onClose={() => setOpenJobDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements (comma-separated)"
                value={newJob.requirements}
                onChange={(e) =>
                  setNewJob({ ...newJob, requirements: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Eligible Departments</InputLabel>
                <Select
                  multiple
                  value={newJob.eligibility.departments}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      eligibility: {
                        ...newJob.eligibility,
                        departments: e.target.value,
                      },
                    })
                  }
                  input={<OutlinedInput label="Eligible Departments" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Checkbox
                        checked={
                          newJob.eligibility.departments.indexOf(dept) > -1
                        }
                      />
                      <ListItemText primary={dept} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum CGPA"
                value={newJob.eligibility.minCGPA}
                onChange={(e) =>
                  setNewJob({
                    ...newJob,
                    eligibility: {
                      ...newJob.eligibility,
                      minCGPA: e.target.value,
                    },
                  })
                }
                inputProps={{ step: "0.1", min: "0", max: "10" }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Number of Positions"
                value={newJob.numberOfPositions}
                onChange={(e) =>
                  setNewJob({ ...newJob, numberOfPositions: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="date"
                label="Application Deadline"
                InputLabelProps={{ shrink: true }}
                value={newJob.applicationDeadline}
                onChange={(e) =>
                  setNewJob({ ...newJob, applicationDeadline: e.target.value })
                }
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateJob}
            disabled={
              !newJob.title ||
              !newJob.description ||
              !newJob.requirements ||
              !newJob.eligibility.departments.length ||
              !newJob.eligibility.minCGPA ||
              !newJob.numberOfPositions ||
              !newJob.applicationDeadline
            }
          >
            Create Job
          </Button>
        </DialogActions>
      </Dialog> */}
      {/* New Job Dialog */}
      <Dialog
        open={openJobDialog}
        onClose={() => setOpenJobDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Post New Job</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Job Title"
                value={newJob.title}
                onChange={(e) =>
                  setNewJob({ ...newJob, title: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={newJob.description}
                onChange={(e) =>
                  setNewJob({ ...newJob, description: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Requirements (comma-separated)"
                value={newJob.requirements}
                onChange={(e) =>
                  setNewJob({ ...newJob, requirements: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Eligible Departments</InputLabel>
                <Select
                  multiple
                  value={newJob.eligibility.departments}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      eligibility: {
                        ...newJob.eligibility,
                        departments: e.target.value,
                      },
                    })
                  }
                  input={<OutlinedInput label="Eligible Departments" />}
                  renderValue={(selected) => selected.join(", ")}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      <Checkbox
                        checked={
                          newJob.eligibility.departments.indexOf(dept) > -1
                        }
                      />
                      <ListItemText primary={dept} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {/* edited here now */}
            <Grid container spacing={2}>
              {/* ... other fields ... */}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Batch Year"
                  value={newJob.eligibility.batch}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      eligibility: {
                        ...newJob.eligibility,
                        batch: parseInt(e.target.value),
                      },
                    })
                  }
                  required
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Minimum CGPA"
                  value={newJob.eligibility.minCGPA}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      eligibility: {
                        ...newJob.eligibility,
                        minCGPA: e.target.value,
                      },
                    })
                  }
                  inputProps={{ step: "0.1", min: "0", max: "10" }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Number of Positions"
                  value={newJob.numberOfPositions}
                  onChange={(e) =>
                    setNewJob({ ...newJob, numberOfPositions: e.target.value })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Application Deadline"
                  InputLabelProps={{ shrink: true }}
                  value={newJob.applicationDeadline}
                  onChange={(e) =>
                    setNewJob({
                      ...newJob,
                      applicationDeadline: e.target.value,
                    })
                  }
                  required
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJobDialog(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleCreateJob}>
            Create Job
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default RecruiterDashboard;

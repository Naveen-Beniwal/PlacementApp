// frontend/src/components/Jobs.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import axiosInstance from "../utils/axios";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/jobs/available");
      setJobs(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post("/applications", { jobId });
      setOpenDialog(false);
      fetchJobs(); // Refresh to update application status
      setError("");
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        Available Jobs
      </Typography>

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} md={6} key={job._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{job.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {job.company}
                </Typography>

                <Typography variant="body2">
                  <strong>Requirements:</strong>
                </Typography>
                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}
                >
                  {job.requirements.map((req, index) => (
                    <Chip key={index} label={req} size="small" />
                  ))}
                </Box>

                <Typography variant="body2">
                  <strong>Eligibility:</strong>
                </Typography>
                <Typography variant="body2">
                  Departments: {job.eligibility.departments.join(", ")}
                </Typography>
                <Typography variant="body2">
                  Min CGPA: {job.eligibility.minCGPA}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  Batch: {job.eligibility.batch}
                </Typography>

                {job.salary && job.salary.ctc && (
                  <Typography variant="body2" gutterBottom>
                    <strong>CTC:</strong> ₹
                    {Number(job.salary.ctc).toLocaleString()}
                  </Typography>
                )}

                <Typography variant="body2" gutterBottom>
                  <strong>Positions:</strong> {job.numberOfPositions}
                </Typography>

                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Deadline:{" "}
                  {new Date(job.applicationDeadline).toLocaleDateString()}
                </Typography>

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setSelectedJob(job);
                    setOpenDialog(true);
                  }}
                  disabled={job.hasApplied}
                >
                  {job.hasApplied ? "Applied" : "Apply"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Apply for Job</DialogTitle>
        <DialogContent>
          {selectedJob && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedJob.title} at {selectedJob.company}
              </Typography>

              <Typography variant="body1" paragraph>
                {selectedJob.description}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Requirements:
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
                {selectedJob.requirements.map((req, index) => (
                  <Chip key={index} label={req} />
                ))}
              </Box>

              {selectedJob.rounds && selectedJob.rounds.length > 0 && (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Selection Process:
                  </Typography>
                  {selectedJob.rounds.map((round, index) => (
                    <Box key={index} sx={{ mb: 1 }}>
                      <Typography variant="subtitle2">{round.name}</Typography>
                      <Typography variant="body2">
                        {round.description}
                      </Typography>
                    </Box>
                  ))}
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleApply(selectedJob._id)}
          >
            Confirm Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Jobs;

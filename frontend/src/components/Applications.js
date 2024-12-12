// frontend/src/components/Applications.js
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
} from "@mui/material";
import axiosInstance from "../utils/axios";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/applications/my");
      setApplications(res.data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch applications");
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
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Typography variant="h4" gutterBottom>
        My Applications
      </Typography>

      <Grid container spacing={3}>
        {applications.map((app) => (
          <Grid item xs={12} md={6} key={app._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{app.job?.title}</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {app.job?.company}
                </Typography>
                <Typography variant="body2" paragraph>
                  Applied on: {new Date(app.appliedAt).toLocaleDateString()}
                </Typography>
                <Chip
                  label={
                    app.status.charAt(0).toUpperCase() + app.status.slice(1)
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
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    setSelectedApplication(app);
                    setOpenDialog(true);
                  }}
                >
                  View Details
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
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent dividers>
          {selectedApplication && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedApplication.job?.title} at{" "}
                {selectedApplication.job?.company}
              </Typography>

              <Typography variant="subtitle1" gutterBottom>
                Round Status:
              </Typography>
              {selectedApplication.roundStatus?.map((round, index) => (
                <Card key={index} sx={{ mb: 1, p: 1 }}>
                  <Typography>
                    <strong>{round.round}</strong>
                  </Typography>
                  <Typography>Status: {round.status}</Typography>
                  {round.feedback && (
                    <Typography>Feedback: {round.feedback}</Typography>
                  )}
                  <Typography variant="caption">
                    {new Date(round.date).toLocaleDateString()}
                  </Typography>
                </Card>
              ))}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Applications;

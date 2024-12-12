// frontend/src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "../utils/axios";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/applications/stats");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3} style={{ marginTop: 20 }}>
        <Grid item xs={12} md={4}>
          <Paper style={{ padding: 20 }}>
            <Typography variant="h6">Applications</Typography>
            <Typography variant="h4">{stats?.applications || 0}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;

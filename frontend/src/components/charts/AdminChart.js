// frontend/src/components/charts/AdminChart.js
import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Typography, useTheme } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axiosInstance from "../../utils/axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
);

const AdminChart = () => {
  const theme = useTheme();
  const [chartData, setChartData] = useState({
    departmentStats: null,
    statusStats: null,
    monthlyStats: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chart styles
  const chartColors = {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 12,
            family: theme.typography.fontFamily,
          },
          padding: 20,
        },
      },
    },
  };

  useEffect(() => {
    fetchChartData();
  }, []);

  // ... fetchChartData and other existing functions ...
  // In AdminChart.js, add this function before useEffect
  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/stats/detailed");
      const data = response.data;

      setChartData({
        departmentStats: data.departmentStats || {},
        statusStats: [
          data.statusStats?.selected || 0,
          data.statusStats?.pending || 0,
          data.statusStats?.rejected || 0,
        ],
        monthlyStats: {
          labels: data.monthlyStats?.labels || [],
          data: data.monthlyStats?.data || [],
        },
      });
    } catch (err) {
      console.error("Chart data fetch error:", err);
      setError(err.message || "Failed to fetch chart data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
        Placement Analytics Dashboard
      </Typography>
      <Grid container spacing={4}>
        {/* Department Stats */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[10],
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Department-wise Placements
            </Typography>
            <Box sx={{ height: 320 }}>
              <Bar
                options={{
                  ...commonOptions,
                  plugins: {
                    ...commonOptions.plugins,
                    title: { display: false },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: theme.palette.divider,
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
                data={{
                  labels: Object.keys(chartData.departmentStats || {}),
                  datasets: [
                    {
                      label: "Placed Students",
                      data: Object.values(chartData.departmentStats || {}),
                      backgroundColor: chartColors.primary,
                      borderRadius: 8,
                    },
                  ],
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[10],
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Application Status Distribution
            </Typography>
            <Box sx={{ height: 320 }}>
              <Doughnut
                options={commonOptions}
                data={{
                  labels: ["Selected", "Pending", "Rejected"],
                  datasets: [
                    {
                      data: chartData.statusStats || [0, 0, 0],
                      backgroundColor: [
                        chartColors.success,
                        chartColors.warning,
                        chartColors.error,
                      ],
                      borderWidth: 0,
                    },
                  ],
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Monthly Trends */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              height: 400,
              transition: "all 0.3s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: theme.shadows[10],
              },
            }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Placement Trends
            </Typography>
            <Box sx={{ height: 320 }}>
              <Line
                options={{
                  ...commonOptions,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: theme.palette.divider,
                      },
                    },
                    x: {
                      grid: {
                        color: theme.palette.divider,
                      },
                    },
                  },
                }}
                data={{
                  labels: chartData.monthlyStats?.labels || [],
                  datasets: [
                    {
                      label: "Placements",
                      data: chartData.monthlyStats?.data || [],
                      borderColor: chartColors.info,
                      backgroundColor: `${chartColors.info}30`,
                      tension: 0.3,
                      fill: true,
                    },
                  ],
                }}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminChart;

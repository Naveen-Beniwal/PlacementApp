// frontend/src/components/admin/DataExport.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  LinearProgress,
  Alert,
  Stack,
  Chip,
} from "@mui/material";
import { Download, FilePresent } from "@mui/icons-material";
import axiosInstance from "../../utils/axios";
import * as XLSX from "xlsx";

const DataExport = () => {
  const [dataType, setDataType] = useState("students");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [data, setData] = useState([]);
  const [exportFormat, setExportFormat] = useState("csv");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get(`/admin/${dataType}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataType]);

  const filterData = () => {
    return data.filter((item) => {
      if (!startDate || !endDate) return true;
      const itemDate = new Date(item.createdAt || item.appliedAt);
      return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
    });
  };

  const processStudentData = (students) => {
    return students.map((student) => ({
      Name: student.profile?.name || "",
      Email: student.email,
      Department: student.profile?.department || "",
      CGPA: student.profile?.cgpa || "",
      RollNumber: student.profile?.rollNumber || "",
      Skills: student.profile?.skills?.join(", ") || "",
    }));
  };

  const processJobData = (jobs) => {
    return jobs.map((job) => ({
      Company: job.company,
      Position: job.title,
      Status: job.status,
      MinCGPA: job.eligibility?.minCGPA || "",
      Batch: job.eligibility?.batch || "",
      Salary: job.salary?.ctc || "",
      Deadline: job.applicationDeadline,
    }));
  };

  const processApplicationData = (applications) => {
    return applications.map((app) => ({
      StudentName: app.student?.profile?.name || "",
      Company: app.job?.company || "",
      Position: app.job?.title || "",
      Status: app.status,
      AppliedDate: new Date(app.appliedAt).toLocaleDateString(),
      LastUpdated: new Date(app.updatedAt).toLocaleDateString(),
    }));
  };

  const exportToCSV = (processedData, fileName) => {
    const csv = [
      Object.keys(processedData[0]).join(","),
      ...processedData.map((row) =>
        Object.values(row)
          .map((value) => `"${value}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (processedData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const handleExport = () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const filteredData = filterData();
      if (filteredData.length === 0) {
        throw new Error("No data to export");
      }

      let processedData;
      switch (dataType) {
        case "students":
          processedData = processStudentData(filteredData);
          break;
        case "jobs":
          processedData = processJobData(filteredData);
          break;
        case "applications":
          processedData = processApplicationData(filteredData);
          break;
        default:
          throw new Error("Invalid data type");
      }

      if (exportFormat === "csv") {
        exportToCSV(processedData, `${dataType}_export`);
      } else {
        exportToExcel(processedData, `${dataType}_export`);
      }

      setSuccess("Export completed successfully");
    } catch (err) {
      setError(err.message || "Failed to export data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Data Export
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Data Type</InputLabel>
              <Select
                value={dataType}
                label="Data Type"
                onChange={(e) => setDataType(e.target.value)}
              >
                <MenuItem value="students">Students</MenuItem>
                <MenuItem value="jobs">Jobs</MenuItem>
                <MenuItem value="applications">Applications</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Export Format</InputLabel>
              <Select
                value={exportFormat}
                label="Export Format"
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="csv">CSV</MenuItem>
                <MenuItem value="excel">Excel</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={2}>
              <TextField
                type="date"
                label="Start Date"
                InputLabelProps={{ shrink: true }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
              />
              <TextField
                type="date"
                label="End Date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                fullWidth
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            {loading && <LinearProgress sx={{ mb: 2 }} />}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleExport}
              disabled={loading || !data.length}
              fullWidth
            >
              Export {dataType}
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
              <Typography variant="subtitle2" gutterBottom>
                Available Records: {filterData().length}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip
                  icon={<FilePresent />}
                  label={`${dataType} data`}
                  color="primary"
                />
                {startDate && endDate && (
                  <Chip label={`Date filtered`} color="secondary" />
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default DataExport;

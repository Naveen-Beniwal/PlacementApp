import React, { useState } from "react";

import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Chip,
  Divider,
  Link,
} from "@mui/material";
import {
  GitHub,
  Launch,
  Description,
  VideoLibrary,
  Email,
  School,
} from "@mui/icons-material";
import html2pdf from "html2pdf.js";

// Theme constants
const colors = {
  modern: {
    primary: "#2c3e50",
    secondary: "#34495e",
    accent: "#3498db",
    background: "#ecf0f1",
  },
  professional: {
    primary: "#2c3e50",
    secondary: "#34495e",
    accent: "#3498db",
    background: "#ffffff",
  },
  minimalist: {
    primary: "#000000",
    secondary: "#333333",
    accent: "#666666",
    background: "#ffffff",
  },
  creative: {
    primary: "#ff416c",
    secondary: "#ff4b2b",
    accent: "#ffffff",
    background: "linear-gradient(to right, #ff416c, #ff4b2b)",
  },
};

// Templates object start
const templates = {
  modern: {
    name: "Modern",
    component: ({ data }) => (
      <Paper
        sx={{
          p: 4,
          m: 2,
          minHeight: "1100px",
          maxWidth: "850px",
          mx: "auto",
          backgroundColor: "#fff",
        }}
        id="resume-content"
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="h3"
            sx={{
              color: colors.modern.primary,
              fontWeight: 700,
              letterSpacing: 1,
              mb: 2,
            }}
          >
            {data.name}
          </Typography>
          <Typography variant="h6" sx={{ color: colors.modern.secondary }}>
            {data.email} | {data.department} | CGPA: {data.cgpa}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={4}>
            <Box
              sx={{
                borderRight: `2px solid ${colors.modern.accent}`,
                pr: 2,
                height: "100%",
              }}
            >
              {/* Skills Section */}
              <Typography
                variant="h6"
                sx={{
                  color: colors.modern.primary,
                  borderBottom: `2px solid ${colors.modern.accent}`,
                  pb: 1,
                  mb: 2,
                }}
              >
                SKILLS
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 4 }}>
                {data.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      backgroundColor: colors.modern.accent,
                      color: colors.modern.primary,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Box>

              {/* Education Section */}
              <Typography
                variant="h6"
                sx={{
                  color: colors.modern.primary,
                  borderBottom: `2px solid ${colors.modern.accent}`,
                  pb: 1,
                  mb: 2,
                  mt: 4,
                }}
              >
                EDUCATION
              </Typography>
              {data.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 600 }}>{edu.degree}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: colors.modern.secondary }}
                  >
                    {edu.institution}
                  </Typography>
                  <Typography variant="body2">
                    Year: {edu.year} | Score: {edu.score}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={8}>
            {/* Experience Section */}
            {data.experience.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.modern.primary,
                    borderBottom: `2px solid ${colors.modern.accent}`,
                    pb: 1,
                    mb: 3,
                  }}
                >
                  EXPERIENCE
                </Typography>
                {data.experience.map((exp, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: colors.modern.primary }}
                    >
                      {exp.title}
                    </Typography>
                    <Typography sx={{ color: colors.modern.secondary, mb: 1 }}>
                      {exp.company} | {exp.duration}
                    </Typography>
                    <Typography>{exp.description}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Projects Section */}
            {data.projects && data.projects.length > 0 && (
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: colors.modern.primary,
                    borderBottom: `2px solid ${colors.modern.accent}`,
                    pb: 1,
                    mb: 3,
                  }}
                >
                  PROJECTS
                </Typography>
                {data.projects.map((project, index) => (
                  <Box key={index} sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: colors.modern.primary }}
                    >
                      {project.title}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      {project.description}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                      {project.technologies.map((tech, i) => (
                        <Chip
                          key={i}
                          label={tech}
                          size="small"
                          sx={{
                            backgroundColor: colors.modern.accent,
                            color: colors.modern.primary,
                          }}
                        />
                      ))}
                    </Box>
                    {project.links && (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {project.links.map((link, i) => (
                          <Link
                            key={i}
                            href={link.url}
                            target="_"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              color: colors.modern.primary,
                              textDecoration: "none",
                              "&:hover": {
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {link.type === "github" && (
                              <GitHub fontSize="small" />
                            )}
                            {link.type === "live" && (
                              <Launch fontSize="small" />
                            )}
                            {link.type === "documentation" && (
                              <Description fontSize="small" />
                            )}
                            {link.type === "video" && (
                              <VideoLibrary fontSize="small" />
                            )}
                            {link.type}
                          </Link>
                        ))}
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    ),
  },

  professional: {
    name: "Professional",
    component: ({ data }) => (
      <Paper
        sx={{
          p: 4,
          m: 2,
          minHeight: "1100px",
          maxWidth: "850px",
          mx: "auto",
          backgroundColor: "#fff",
        }}
        id="resume-content"
      >
        <Box
          sx={{
            bgcolor: colors.professional.primary,
            color: "white",
            p: 4,
            mb: 4,
            borderRadius: 1,
            textAlign: "center",
          }}
        >
          <Typography variant="h3" sx={{ mb: 1 }}>
            {data.name}
          </Typography>
          <Typography>
            {data.email} | {data.department}
          </Typography>
          <Typography>
            CGPA: {data.cgpa} | Batch: {data.batch}
          </Typography>
        </Box>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                borderBottom: `3px solid ${colors.professional.primary}`,
                pb: 1,
                mb: 3,
                color: colors.professional.primary,
                fontWeight: 600,
              }}
            >
              Professional Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 4 }}>
              {data.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  sx={{
                    bgcolor: colors.professional.accent,
                    color: colors.professional.primary,
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          </Grid>
          {data.experience.length > 0 && (
            <Grid item xs={12}>
              <Typography
                variant="h5"
                sx={{
                  borderBottom: `3px solid ${colors.professional.primary}`,
                  pb: 1,
                  mb: 3,
                  color: colors.professional.primary,
                  fontWeight: 600,
                }}
              >
                Experience
              </Typography>
              {data.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{ color: colors.professional.primary }}
                  >
                    {exp.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: colors.professional.secondary, mb: 1 }}
                  >
                    {exp.company} | {exp.duration}
                  </Typography>
                  <Typography>{exp.description}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography
              variant="h5"
              sx={{
                borderBottom: `3px solid ${colors.professional.primary}`,
                pb: 1,
                mb: 3,
                color: colors.professional.primary,
                fontWeight: 600,
              }}
            >
              Education
            </Typography>
            {data.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ color: colors.professional.primary }}
                >
                  {edu.degree}
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{ color: colors.professional.secondary }}
                >
                  {edu.institution}
                </Typography>
                <Typography>
                  Year: {edu.year} | Score: {edu.score}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    ),
  },

  minimalist: {
    name: "Minimalist",
    component: ({ data }) => (
      <Paper
        sx={{
          p: 4,
          m: 2,
          minHeight: "1100px",
          maxWidth: "850px",
          mx: "auto",
          backgroundColor: "#fff",
        }}
        id="resume-content"
      >
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{
              borderBottom: "1px solid #e0e0e0",
              pb: 3,
              mb: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 300 }}>
              {data.name}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#757575", mt: 1 }}>
              {data.email} • {data.department} • CGPA: {data.cgpa}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              SKILLS
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {data.skills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  variant="outlined"
                  sx={{ borderColor: "#bdbdbd" }}
                />
              ))}
            </Box>
          </Grid>
          {data.experience.length > 0 && (
            <Grid item xs={12} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
                EXPERIENCE
              </Typography>
              {data.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {exp.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#757575", mb: 1 }}>
                    {exp.company} • {exp.duration}
                  </Typography>
                  <Typography variant="body2">{exp.description}</Typography>
                </Box>
              ))}
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
              EDUCATION
            </Typography>
            {data.education.map((edu, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {edu.degree}
                </Typography>
                <Typography variant="body2" sx={{ color: "#757575" }}>
                  {edu.institution} • Year: {edu.year} • Score: {edu.score}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Paper>
    ),
  },

  creative: {
    name: "Creative",
    component: ({ data }) => (
      <Paper
        sx={{
          p: 4,
          m: 2,
          minHeight: "1100px",
          maxWidth: "850px",
          mx: "auto",
          background: colors.creative.background,
          color: "white",
        }}
        id="resume-content"
      >
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Typography variant="h2" sx={{ fontWeight: 700 }}>
              {data.name}
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {data.department} • CGPA: {data.cgpa}
            </Typography>
            <Typography>{data.email}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: "#f8f9fa",
                p: 3,
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: "#FF6B6B",
                  fontWeight: 600,
                  mb: 3,
                }}
              >
                SKILLS
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {data.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      bgcolor: "#4ECDC4",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#FF6B6B",
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography
                variant="h5"
                sx={{
                  color: "#FF6B6B",
                  fontWeight: 600,
                  mt: 4,
                  mb: 3,
                }}
              >
                EDUCATION
              </Typography>
              {data.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 600, color: "#4ECDC4" }}>
                    {edu.degree}
                  </Typography>
                  <Typography variant="body2">{edu.institution}</Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    Year: {edu.year} • Score: {edu.score}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            {data.experience.length > 0 && (
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h5"
                  sx={{
                    color: "#FF6B6B",
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  EXPERIENCE
                </Typography>
                {data.experience.map((exp, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 4,
                      p: 2,
                      borderLeft: "4px solid #4ECDC4",
                      "&:hover": {
                        borderLeft: "4px solid #FF6B6B",
                      },
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "#4ECDC4" }}>
                      {exp.title}
                    </Typography>
                    <Typography sx={{ color: "#666", mb: 1 }}>
                      {exp.company} • {exp.duration}
                    </Typography>
                    <Typography>{exp.description}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    ),
  },
};

// Main Component
function ResumeBuilder({ profile }) {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [previewOpen, setPreviewOpen] = useState(false);

  const downloadPDF = () => {
    const element = document.getElementById("resume-content");
    html2pdf()
      .set({
        margin: 0,
        filename: `${profile.name}_resume.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  const SelectedTemplate = templates[selectedTemplate].component;

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 3, mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Resume Builder
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography gutterBottom>Select Template:</Typography>
            <Grid container spacing={2}>
              {Object.entries(templates).map(([key, template]) => (
                <Grid item key={key}>
                  <Button
                    variant={
                      selectedTemplate === key ? "contained" : "outlined"
                    }
                    onClick={() => setSelectedTemplate(key)}
                    sx={{
                      minWidth: "120px",
                      textTransform: "capitalize",
                    }}
                  >
                    {template.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setPreviewOpen(true)}
            >
              Preview
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={downloadPDF}
              sx={{ ml: 2 }}
            >
              Download PDF
            </Button>
          </Grid>
        </Grid>
      </Paper>
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Resume Preview
          <Button
            variant="contained"
            color="primary"
            onClick={downloadPDF}
            sx={{ float: "right" }}
          >
            Download PDF
          </Button>
        </DialogTitle>
        <DialogContent>
          <SelectedTemplate data={profile} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ResumeBuilder;

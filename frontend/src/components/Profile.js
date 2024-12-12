// src/components/Profile.js
import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  Box,
  IconButton,
  Divider,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  GitHub,
  Launch,
  Description,
  VideoLibrary,
} from "@mui/icons-material";
import axiosInstance from "../utils/axios";
import ResumeBuilder from "./ResumeBuilder";

function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    rollNumber: "",
    department: "",
    cgpa: "",
    batch: "",
    skills: [],
    education: [
      {
        institution: "",
        degree: "",
        year: "",
        score: "",
      },
    ],
    experience: [
      {
        title: "",
        company: "",
        duration: "",
        description: "",
      },
    ],
    projects: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: [],
    links: [
      {
        type: "",
        url: "",
      },
    ],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/profiles/me");
      setProfile(res.data || {});
    } catch (error) {
      setError("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await axiosInstance.put("/profiles", profile);
      setSuccess("Profile updated successfully");
    } catch (error) {
      setError("Failed to update profile");
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
    <Container maxWidth="md">
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>
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

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Name"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Roll Number"
                value={profile.rollNumber}
                onChange={(e) =>
                  setProfile({ ...profile, rollNumber: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={profile.department}
                onChange={(e) =>
                  setProfile({ ...profile, department: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="CGPA"
                value={profile.cgpa}
                onChange={(e) =>
                  setProfile({ ...profile, cgpa: e.target.value })
                }
                inputProps={{ step: "0.01", min: "0", max: "10" }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Batch Year"
                value={profile.batch}
                onChange={(e) =>
                  setProfile({ ...profile, batch: e.target.value })
                }
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Skills
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <TextField
                  label="Add Skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  size="small"
                />
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => {
                    if (newSkill) {
                      setProfile({
                        ...profile,
                        skills: [...profile.skills, newSkill],
                      });
                      setNewSkill("");
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {profile.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() =>
                      setProfile({
                        ...profile,
                        skills: profile.skills.filter((_, i) => i !== index),
                      })
                    }
                  />
                ))}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Education
              </Typography>
              {profile.education.map((edu, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Institution"
                        value={edu.institution}
                        onChange={(e) => {
                          const newEducation = [...profile.education];
                          newEducation[index].institution = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Degree"
                        value={edu.degree}
                        onChange={(e) => {
                          const newEducation = [...profile.education];
                          newEducation[index].degree = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Year"
                        value={edu.year}
                        onChange={(e) => {
                          const newEducation = [...profile.education];
                          newEducation[index].year = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Score"
                        value={edu.score}
                        onChange={(e) => {
                          const newEducation = [...profile.education];
                          newEducation[index].score = e.target.value;
                          setProfile({ ...profile, education: newEducation });
                        }}
                      />
                    </Grid>
                  </Grid>
                  {profile.education.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => {
                        const newEducation = profile.education.filter(
                          (_, i) => i !== index
                        );
                        setProfile({ ...profile, education: newEducation });
                      }}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  )}
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProfile({
                    ...profile,
                    education: [
                      ...profile.education,
                      { institution: "", degree: "", year: "", score: "" },
                    ],
                  });
                }}
              >
                Add Education
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Experience
              </Typography>
              {profile.experience.map((exp, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Title"
                        value={exp.title}
                        onChange={(e) => {
                          const newExperience = [...profile.experience];
                          newExperience[index].title = e.target.value;
                          setProfile({ ...profile, experience: newExperience });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Company"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperience = [...profile.experience];
                          newExperience[index].company = e.target.value;
                          setProfile({ ...profile, experience: newExperience });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={exp.duration}
                        onChange={(e) => {
                          const newExperience = [...profile.experience];
                          newExperience[index].duration = e.target.value;
                          setProfile({ ...profile, experience: newExperience });
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Description"
                        value={exp.description}
                        onChange={(e) => {
                          const newExperience = [...profile.experience];
                          newExperience[index].description = e.target.value;
                          setProfile({ ...profile, experience: newExperience });
                        }}
                      />
                    </Grid>
                  </Grid>
                  {profile.experience.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => {
                        const newExperience = profile.experience.filter(
                          (_, i) => i !== index
                        );
                        setProfile({ ...profile, experience: newExperience });
                      }}
                      sx={{ mt: 1 }}
                    >
                      Remove
                    </Button>
                  )}
                  <Divider sx={{ my: 2 }} />
                </Box>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProfile({
                    ...profile,
                    experience: [
                      ...profile.experience,
                      { title: "", company: "", duration: "", description: "" },
                    ],
                  });
                }}
              >
                Add Experience
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Projects
              </Typography>
              {profile.projects.map((project, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel${index}-content`}
                    id={`panel${index}-header`}
                  >
                    <Typography variant="h6">{project.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => {
                            const newProjects = [...profile.projects];
                            newProjects[index].title = e.target.value;
                            setProfile({ ...profile, projects: newProjects });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          label="Project Description"
                          value={project.description}
                          onChange={(e) => {
                            const newProjects = [...profile.projects];
                            newProjects[index].description = e.target.value;
                            setProfile({ ...profile, projects: newProjects });
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Technologies
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {project.technologies.map((tech, i) => (
                            <Chip
                              key={i}
                              label={tech}
                              onDelete={() => {
                                const newProjects = [...profile.projects];
                                newProjects[index].technologies = newProjects[
                                  index
                                ].technologies.filter((_, j) => j !== i);
                                setProfile({
                                  ...profile,
                                  projects: newProjects,
                                });
                              }}
                            />
                          ))}
                        </Box>
                        <TextField
                          fullWidth
                          label="Add Technology"
                          value={newProject.technologies}
                          onChange={(e) =>
                            setNewProject({
                              ...newProject,
                              technologies: e.target.value,
                            })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && newProject.technologies) {
                              e.preventDefault();
                              const newProjects = [...profile.projects];
                              newProjects[index].technologies.push(
                                newProject.technologies
                              );
                              setProfile({ ...profile, projects: newProjects });
                              setNewProject({
                                ...newProject,
                                technologies: "",
                              });
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                          Links
                        </Typography>
                        {project.links.map((link, i) => (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                              mb: 1,
                            }}
                          >
                            <TextField
                              label="Link Type"
                              value={link.type}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index].links[i].type =
                                  e.target.value;
                                setProfile({
                                  ...profile,
                                  projects: newProjects,
                                });
                              }}
                            />
                            <TextField
                              label="URL"
                              value={link.url}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index].links[i].url =
                                  e.target.value;
                                setProfile({
                                  ...profile,
                                  projects: newProjects,
                                });
                              }}
                            />
                            <IconButton
                              color="error"
                              onClick={() => {
                                const newProjects = [...profile.projects];
                                newProjects[index].links = newProjects[
                                  index
                                ].links.filter((_, j) => j !== i);
                                setProfile({
                                  ...profile,
                                  projects: newProjects,
                                });
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => {
                            const newProjects = [...profile.projects];
                            newProjects[index].links.push({
                              type: "",
                              url: "",
                            });
                            setProfile({ ...profile, projects: newProjects });
                          }}
                        >
                          Add Link
                        </Button>
                      </Grid>
                    </Grid>
                    {profile.projects.length > 1 && (
                      <Button
                        color="error"
                        onClick={() => {
                          const newProjects = profile.projects.filter(
                            (_, i) => i !== index
                          );
                          setProfile({ ...profile, projects: newProjects });
                        }}
                        sx={{ mt: 1 }}
                      >
                        Remove Project
                      </Button>
                    )}
                    <Divider sx={{ my: 2 }} />
                  </AccordionDetails>
                </Accordion>
              ))}
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => {
                  setProfile({
                    ...profile,
                    projects: [
                      ...profile.projects,
                      {
                        title: "",
                        description: "",
                        technologies: [],
                        links: [{ type: "", url: "" }],
                      },
                    ],
                  });
                }}
              >
                Add Project
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 2 }}
              >
                Save Profile
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display Projects */}
        {profile.projects.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              My Projects
            </Typography>
            {profile.projects.map((project, index) => (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h6">{project.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ mb: 1 }}>{project.description}</Typography>
                  <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                    {project.technologies.map((tech, i) => (
                      <Chip
                        key={i}
                        label={tech}
                        size="small"
                        sx={{
                          backgroundColor: "#e0e0e0",
                          color: "#000",
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
                          target="_blank"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            color: "#1976d2",
                            textDecoration: "none",
                            "&:hover": {
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {link.type === "github" && (
                            <GitHub fontSize="small" />
                          )}
                          {link.type === "live" && <Launch fontSize="small" />}
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
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {profile.name && <ResumeBuilder profile={profile} />}
      </Paper>
    </Container>
  );
}

export default Profile;

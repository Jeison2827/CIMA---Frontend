// src/pages/projects/ProjectsPage.js
import React, { useState, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Fade,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ProjectContext } from '../../../context/ProjectContext';
import ProjectList from '../components/ProjectList';
import ProjectForm from '../components/ProjectForm';
import ProjectStats from '../components/ProjectStats';

const ProjectsPage = () => {
  const projectContext = useContext(ProjectContext);
  
  if (!projectContext) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            Error: ProjectContext no está disponible. Asegúrate de que este componente esté dentro de un ProjectContextProvider.
          </Alert>
        </Box>
      </Container>
    );
  }
  
  const {
    projects,
    projectStats,
    loading,
    error,
    notification,
    setNotification,
    createProject,
    updateProject,
    deleteProject
  } = projectContext;

  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      setOpenForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      await updateProject(selectedProject.id, projectData);
      setOpenForm(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proyecto?')) {
      try {
        await deleteProject(id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Fade in={true}>
        <Box sx={{ py: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" component="h1">
                  Gestión de Proyectos
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenForm(true)}
                >
                  Nuevo Proyecto
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <ProjectStats stats={projectStats} />
            </Grid>

            <Grid item xs={12}>
              <Paper>
                <ProjectList
                  projects={projects}
                  loading={loading}
                  onEdit={project => {
                    setSelectedProject(project);
                    setOpenForm(true);
                  }}
                  onDelete={handleDeleteProject}
                />
              </Paper>
            </Grid>
          </Grid>

          <ProjectForm
            open={openForm}
            onClose={() => {
              setOpenForm(false);
              setSelectedProject(null);
            }}
            onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
            project={selectedProject}
          />

          <Snackbar
            open={notification.open}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification.type}
              sx={{ width: '100%' }}
            >
              {notification.message}
            </Alert>
          </Snackbar>
        </Box>
      </Fade>
    </Container>
  );
};

export default ProjectsPage;

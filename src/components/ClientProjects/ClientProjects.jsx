import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Box,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Assignment as ProjectIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon,
  Description as DescriptionIcon,
  Close as CloseIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Task as TaskIcon,
  Contacts as ContactsIcon,
  Person as PersonIcon,
  Update as UpdateIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

// Add these imports at the top
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/developer/projects/my-projects',
          {
            headers: { 'accesstoken': accessToken }
          }
        );
        setProjects(response.data.projects);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

    fetchProjects();
  }, [accessToken]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Pending': return 'warning';
      default: return 'default';
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setOpenDialog(true);
  };

  const ProjectDetailsDialog = () => {
    const theme = useTheme();
    if (!selectedProject) return null;

    return (
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            p: 3,
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ProjectIcon sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
              {selectedProject.projectName}
              </Typography>
              <Typography variant="subtitle2" sx={{ mt: 0.5, opacity: 0.9 }}>
            
              </Typography>
            </Box>
          </Box>
          <IconButton 
            onClick={() => setOpenDialog(false)} 
            sx={{ 
              color: 'white',
              '&:hover': { 
                background: 'rgba(255, 255, 255, 0.1)' 
              } 
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon /> Descripción del Proyecto
                </Typography>
                <Typography variant="body1">
                  {selectedProject.description || 'Sin descripción disponible'}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                  Estado y Progreso
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Estado Actual
                      </Typography>
                      <Chip
                        label={selectedProject.status}
                        color={getStatusColor(selectedProject.status)}
                        sx={{ fontWeight: 500, px: 2 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Progreso General
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={selectedProject.progress || 0}
                          sx={{ 
                            flexGrow: 1, 
                            height: 10, 
                            borderRadius: 5,
                            bgcolor: 'rgba(0,0,0,0.1)',
                          }}
                        />
                        <Typography variant="h6" sx={{ minWidth: 45 }}>
                          {selectedProject.progress || 0}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ mb: 3 }}>
                  Estadísticas de Tareas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {selectedProject.taskStats.total}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total de Tareas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {selectedProject.taskStats.completed}
                      </Typography>
                      <Typography variant="body2">
                        Completadas
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {selectedProject.taskStats.inProgress}
                      </Typography>
                      <Typography variant="body2">
                        En Progreso
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ 
                      p: 2, 
                      textAlign: 'center', 
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #FFC107 0%, #FFA000 100%)',
                      color: 'white'
                    }}>
                      <Typography variant="h4" sx={{ mb: 1 }}>
                        {selectedProject.taskStats.pending}
                      </Typography>
                      <Typography variant="body2">
                        Pendientes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ContactsIcon /> Información de Contacto
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Cliente"
                      secondary={selectedProject.client.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Email"
                      secondary={selectedProject.client.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Teléfono"
                      secondary={selectedProject.client.contactInfo}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ScheduleIcon /> Fechas Importantes
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Fecha de Creación"
                      secondary={new Date(selectedProject.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <UpdateIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Última Actualización"
                      secondary={new Date(selectedProject.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: 'background.default' }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            variant="outlined"
            startIcon={<CloseIcon />}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  // Wrap the return statement with ThemeProvider
  return (
    <ThemeProvider theme={createTheme()}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Mis Proyectos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Gestiona y visualiza el progreso de tus proyectos
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.projectId}>
              <Fade in timeout={300}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ProjectIcon color="primary" />
                        <Typography variant="h6" component="h2">
                          {project.projectName}
                        </Typography>
                      </Box>
                      <Chip
                        label={project.status}
                        color={getStatusColor(project.status)}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <DescriptionIcon sx={{ fontSize: 16, mr: 1, verticalAlign: 'text-bottom' }} />
                      {project.description || 'Sin descripción disponible'}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Progreso del Proyecto
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={project.progress || 0}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Tareas Completadas: {project.taskStats?.completed || 0}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total: {project.taskStats?.total || 0}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                      <CalendarIcon fontSize="small" />
                      <Typography variant="body2">
                        Creado: {new Date(project.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<TimelineIcon />}
                      onClick={() => handleViewDetails(project)}
                    >
                      Ver Detalles
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}

          {projects.length === 0 && !error && (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <ProjectIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No hay proyectos disponibles
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Los proyectos aparecerán aquí cuando sean creados
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
        <ProjectDetailsDialog />
      </Container>
    </ThemeProvider>
  );
};

export default ClientProjects;
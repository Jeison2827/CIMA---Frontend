import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  Alert,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Assignment } from '@mui/icons-material';
import {
  Assignment as ProjectIcon,
  Timeline as TimelineIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
} from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getColor = () => {
    switch (status?.toLowerCase()) {
      case 'en progreso':
        return { bg: '#E3F2FD', color: '#1976D2' };
      case 'completado':
        return { bg: '#E8F5E9', color: '#2E7D32' };
      case 'en espera':
        return { bg: '#FFF3E0', color: '#E65100' };
      default:
        return { bg: '#F5F5F5', color: '#757575' };
    }
  };
  const { bg, color } = getColor();
  return {
    backgroundColor: bg,
    color: color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

const TaskModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiPaper-root': {
    width: '80%',
    maxHeight: '80vh',
    overflow: 'auto',
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
  },
}));

const WorkerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedProjectTasks, setSelectedProjectTasks] = useState(null);
  const [tasksModalOpen, setTasksModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskUpdateDialog, setTaskUpdateDialog] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('');
  
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  const renderProjectCard = (project) => {
    console.log('Rendering project:', project);
    return (
      <StyledCard>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ProjectIcon color="primary" />
            <Typography variant="h6" component="h2">
              {project.projectName}
            </Typography>
          </Box>
          
          <StatusChip
            status={project.status}
            label={project.status}
            size="small"
            sx={{ mb: 2 }}
          />

          <Typography variant="body2" color="text.secondary" paragraph>
            {project.description || 'Sin descripción disponible'}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Fecha de inicio: {new Date(project.startDate).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
 
          <Button
            size="small"
            startIcon={<Assignment />}
            onClick={() => fetchProjectTasks(project.projectId)}
          >
            Ver Tareas
          </Button>
          <Button
            size="small"
            startIcon={<UpdateIcon />}
            onClick={() => {
              setSelectedProject(project);
              setOpenDialog(true);
            }}
          >
            Actualizar Estado
          </Button>
        </CardActions>
      </StyledCard>
    );
  };

    const fetchProjects = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/developer/projects/worker/projects',
          {
            headers: { 'accesstoken': accessToken }
          }
        );
        setProjects(response.data.projects || []);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos: ' + (err.response?.data?.message || err.message));
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleStatusChange = async (projectId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/developer/projects/${projectId}/status`,
        { status: newStatus },
        { headers: { 'accesstoken': accessToken } }
      );
      fetchProjects();
      setOpenDialog(false);
    } catch (err) {
      setError('Error al actualizar el estado: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetails = (projectId) => {
    navigate(`/project-status/${projectId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <LinearProgress />
      </Container>
    );
  }

  const fetchProjectTasks = async (projectId) => {
    try {
      console.log('Fetching tasks for project:', projectId);
      if (!projectId) {
        console.log('No projectId provided');
        return;
      }
      const response = await axios.get(
        `http://localhost:3000/developer/projects/${projectId}/worker/tasks`, // Updated endpoint
        {
          headers: { 'accesstoken': accessToken }
        }
      );
      console.log('Tasks API Response:', response.data);
      setTasks(response.data.tasks || []);
      console.log('Tasks set in state:', response.data.tasks);
      setSelectedProjectTasks(projectId);
      setTasksModalOpen(true);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      console.log('Error response:', err.response);
      setError('Error al cargar las tareas: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCloseTasksModal = () => {
    setTasksModalOpen(false);
    setSelectedProjectTasks(null);
    setTasks([]); // Clear tasks when closing modal
  };

  const handleUpdateTaskStatus = async () => {
    try {
      await axios.put(
        `http://localhost:3000/developer/projects/tasks/${selectedTask.taskId}/status`,
        { status: newTaskStatus },
        { headers: { 'accesstoken': accessToken } }
      );
      
      // Refresh tasks after update
      await fetchProjectTasks(selectedProjectTasks);
      setTaskUpdateDialog(false);
      setSelectedTask(null);
      setNewTaskStatus('');
    } catch (err) {
      setError('Error al actualizar el estado de la tarea: ' + (err.response?.data?.message || err.message));
    }
  };

  // Modify the table row in the TaskModal to include an update button
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
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
              {renderProjectCard(project)}
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        {/* ... Dialog content ... */}
      </Dialog>

      <TaskModal open={tasksModalOpen} onClose={handleCloseTasksModal}>
        <Paper>
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Tareas del Proyecto
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Descripción</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Fecha de Creación</TableCell>
                    <TableCell>Última Actualización</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tasks.map((task) => (
                    <TableRow key={task.taskId || task._id}>
                      <TableCell>{task.description}</TableCell>
                      <TableCell>
                        <StatusChip status={task.status} label={task.status} />
                      </TableCell>
                      <TableCell>
                        {new Date(task.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(task.updatedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          startIcon={<UpdateIcon />}
                          onClick={() => {
                            setSelectedTask(task);
                            setNewTaskStatus(task.status);
                            setTaskUpdateDialog(true);
                          }}
                        >
                          Actualizar Estado
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2 }}>
              {tasks.length === 0 && (
                <Typography sx={{ textAlign: 'center' }}>
                  No hay tareas asignadas para este proyecto.
                </Typography>
              )}
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={handleCloseTasksModal}>
                  Cerrar
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </TaskModal>

      <Dialog open={taskUpdateDialog} onClose={() => setTaskUpdateDialog(false)}>
        <DialogTitle>
          Actualizar Estado de Tarea
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Estado</InputLabel>
            <Select
              value={newTaskStatus}
              label="Estado"
              onChange={(e) => setNewTaskStatus(e.target.value)}
            >
              <MenuItem value="Pending">En espera</MenuItem>
              <MenuItem value="In Progress">En Progreso</MenuItem>
              <MenuItem value="Completed">Completado</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskUpdateDialog(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleUpdateTaskStatus}
            variant="contained"
            color="primary"
          >
            Actualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkerProjects;
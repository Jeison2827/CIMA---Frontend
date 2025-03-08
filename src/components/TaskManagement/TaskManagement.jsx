import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Chip,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  HourglassEmpty as PendingIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { taskService } from '../../services/taskService';
import { toast } from 'react-toastify';
import './TaskManagement.css';

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    projectId: '',
    workerId: '',
    description: '',
    status: 'Pending'
  });

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter]);

  const loadTasks = async () => {
    try {
      // Simulación de datos para desarrollo
      const mockTasks = [
        { id: 1, projectId: 101, workerId: 201, description: 'Desarrollar página de inicio', status: 'Pending', createdAt: '2023-05-15' },
        { id: 2, projectId: 102, workerId: 202, description: 'Implementar autenticación de usuarios', status: 'In Progress', createdAt: '2023-05-16' },
        { id: 3, projectId: 101, workerId: 203, description: 'Diseñar interfaz de usuario para dashboard', status: 'Completed', createdAt: '2023-05-10' },
        { id: 4, projectId: 103, workerId: 201, description: 'Optimizar consultas de base de datos', status: 'In Progress', createdAt: '2023-05-18' },
        { id: 5, projectId: 102, workerId: 204, description: 'Crear API para gestión de tareas', status: 'Pending', createdAt: '2023-05-20' },
        { id: 6, projectId: 104, workerId: 205, description: 'Implementar sistema de notificaciones', status: 'Completed', createdAt: '2023-05-12' },
      ];
      
      setTasks(mockTasks);
      // En producción, descomentar la siguiente línea y comentar la simulación
      // const response = await taskService.listTasks();
      // setTasks(response);
    } catch (error) {
      toast.error('Error al cargar las tareas');
    }
  };

  const filterTasks = () => {
    let result = [...tasks];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      result = result.filter(task => 
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por estado
    if (statusFilter !== 'all') {
      result = result.filter(task => task.status === statusFilter);
    }
    
    setFilteredTasks(result);
  };

  const handleOpen = (task = null) => {
    if (task) {
      setSelectedTask(task);
      setFormData(task);
    } else {
      setSelectedTask(null);
      setFormData({
        projectId: '',
        workerId: '',
        description: '',
        status: 'Pending'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTask(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedTask) {
        // Simulación de actualización para desarrollo
        const updatedTasks = tasks.map(task => 
          task.id === selectedTask.id ? {...formData, id: task.id} : task
        );
        setTasks(updatedTasks);
        toast.success('Tarea actualizada exitosamente');
        
        // En producción, descomentar:
        // await taskService.updateTask(selectedTask.id, formData);
      } else {
        // Simulación de creación para desarrollo
        const newTask = {
          ...formData,
          id: tasks.length + 1,
          createdAt: new Date().toISOString().split('T')[0]
        };
        setTasks([...tasks, newTask]);
        toast.success('Tarea creada exitosamente');
        
        // En producción, descomentar:
        // await taskService.createTask(formData);
      }
      handleClose();
    } catch (error) {
      toast.error('Error al procesar la tarea');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta tarea?')) {
      try {
        // Simulación de eliminación para desarrollo
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Tarea eliminada exitosamente');
        
        // En producción, descomentar:
        // await taskService.deleteTask(id);
      } catch (error) {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Completed':
        return <CheckCircleIcon fontSize="small" />;
      case 'In Progress':
        return <ScheduleIcon fontSize="small" />;
      default:
        return <PendingIcon fontSize="small" />;
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed':
        return 'task-status-completed';
      case 'In Progress':
        return 'task-status-progress';
      default:
        return 'task-status-pending';
    }
  };

  return (
    <div className="task-management-container">
      <div className="task-header">
        <Typography variant="h4" component="h1">
          Gestión de Tareas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
          sx={{ 
            background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
            boxShadow: '0 3px 5px 2px rgba(52, 152, 219, .3)'
          }}
        >
          Nueva Tarea
        </Button>
      </div>

      <div className="task-filters">
        <TextField
          placeholder="Buscar tareas..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Estado"
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Pending">Pendientes</MenuItem>
            <MenuItem value="In Progress">En Progreso</MenuItem>
            <MenuItem value="Completed">Completadas</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="task-grid">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-card-header">
                <div>
                  <Typography className="task-card-title">
                    Proyecto #{task.projectId}
                  </Typography>
                  <span className={`task-status-chip ${getStatusClass(task.status)}`}>
                    {getStatusIcon(task.status)} {task.status}
                  </span>
                </div>
                <div className="task-actions">
                  <Tooltip title="Editar">
                    <IconButton size="small" onClick={() => handleOpen(task)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(task.id)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': {
                          backgroundColor: 'rgba(211, 47, 47, 0.08)',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              
              <Typography className="task-card-description">
                {task.description}
              </Typography>
              
              <div className="task-card-footer">
                <div className="task-worker-info">
                  <Avatar sx={{ width: 24, height: 24, bgcolor: '#3498db' }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  Trabajador #{task.workerId}
                </div>
                <div className="task-date">
                  {task.createdAt}
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body1" sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 4 }}>
            No se encontraron tareas con los filtros aplicados.
          </Typography>
        )}
      </div>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedTask ? 'Editar Tarea' : 'Nueva Tarea'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="ID del Proyecto"
              type="number"
              margin="normal"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="ID del Trabajador"
              type="number"
              margin="normal"
              value={formData.workerId}
              onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
            />
            <TextField
              fullWidth
              label="Descripción"
              multiline
              rows={4}
              margin="normal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Estado</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                label="Estado"
              >
                <MenuItem value="Pending">Pendiente</MenuItem>
                <MenuItem value="In Progress">En Progreso</MenuItem>
                <MenuItem value="Completed">Completado</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} variant="outlined">
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
                boxShadow: '0 3px 5px 2px rgba(52, 152, 219, .3)'
              }}
            >
              {selectedTask ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default TaskManagement;
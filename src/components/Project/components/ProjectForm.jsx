// src/pages/projects/components/ProjectForm.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';

const ProjectForm = ({ open, onClose, onSubmit, project = null }) => {
  const [formData, setFormData] = useState({
    clientId: '',
    projectName: '',
    description: '',
    status: 'Pending'
  });

  useEffect(() => {
    if (project) {
      setFormData({
        clientId: project.clientId,
        projectName: project.projectName,
        description: project.description || '',
        status: project.status
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isValid = () => {
    return formData.clientId && formData.projectName;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {project ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="clientId"
                label="ID del Cliente"
                type="number"
                fullWidth
                value={formData.clientId}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="projectName"
                label="Nombre del Proyecto"
                fullWidth
                value={formData.projectName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Estado"
                >
                  <MenuItem value="Pending">Pendiente</MenuItem>
                  <MenuItem value="In Progress">En Progreso</MenuItem>
                  <MenuItem value="Completed">Completado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!isValid()}
          >
            {project ? 'Actualizar' : 'Crear'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProjectForm;

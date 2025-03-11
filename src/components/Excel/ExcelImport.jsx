import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  FileCopy as FileIcon,
  FolderOpen as ProjectIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const DropzoneArea = styled('div')(({ theme }) => ({
  border: `2px dashed ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(6),
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.default,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    borderColor: theme.palette.primary.dark,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  '& .MuiTableCell-head': {
    backgroundColor: theme.palette.primary.dark,
    color: '#ffffff',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: theme.spacing(2),
  },
  '& .MuiTableRow-root': {
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
    },
  },
  '& .file-name': {
    fontWeight: 500,
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
  '& .file-info': {
    color: theme.palette.text.secondary,
  },
  '& .MuiTableCell-body': {
    padding: theme.spacing(2),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  marginBottom: theme.spacing(4),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
}));

const ExcelImport = ({ projectId = 42 }) => {
  // Add console log to check projectId when component mounts
  useEffect(() => {
    console.log('Component mounted with projectId:', projectId);
  }, []);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, fileId: null });

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        'http://localhost:3000/developer/projects',
        {
          headers: { 'accesstoken': token }
        }
      );
      const projectsData = response.data.projects || [];
      setProjects(projectsData);
    } catch (err) {
      console.error('Projects fetch error:', err);
      setError('Error al cargar los proyectos');
      setProjects([]);
    }
  };

  // Handle project selection
  const handleProjectChange = (event) => {
    setSelectedProject(event.target.value);
    if (event.target.value) {
      fetchFiles(event.target.value);
    } else {
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Modified fetchFiles to use selectedProject
  const fetchFiles = async (projectId) => {
    if (!projectId) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError('No hay sesión activa');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/developer/files/project/${projectId}`,
        {
          headers: { 'accesstoken': token }
        }
      );
      setFiles(response.data.files || []);
    } catch (err) {
      setError('Error al cargar los archivos');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;
      
      if (!selectedProject) {
        setError('Por favor seleccione un proyecto primero');
        return;
      }

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      setLoading(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post(
          `http://localhost:3000/developer/files/${selectedProject}`,
          formData,
          {
            headers: {
              'accesstoken': token,
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const progress = (progressEvent.loaded / progressEvent.total) * 100;
              setUploadProgress(Math.round(progress));
            }
          }
        );
        setSuccess('Archivo subido exitosamente');
        fetchFiles(selectedProject);
      } catch (err) {
        setError(`Error al subir el archivo: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
        setUploadProgress(0);
      }
    },
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: 'primary.main', 
              mb: 1,
              background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Gestor de Documentos
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
            Gestiona y organiza los archivos de tus proyectos de forma eficiente
          </Typography>

          <StyledCard>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    backgroundColor: 'primary.lighter',
                    borderRadius: '50%',
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ProjectIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <FormControl fullWidth>
                  <InputLabel>Seleccionar Proyecto</InputLabel>
                  <Select
                    value={selectedProject}
                    onChange={handleProjectChange}
                    label="Seleccionar Proyecto"
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.light',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Seleccione un proyecto</em>
                    </MenuItem>
                    {projects.map((project) => (
                        console.log(project),
                      <MenuItem key={project.projectId} value={project.projectId}>
                        {project.projectName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </StyledCard>

          {selectedProject ? (
            <>
              <DropzoneArea {...getRootProps()}>
                <input {...getInputProps()} />
                <Box 
                  sx={{ 
                    p: 4, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    background: 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)',
                    borderRadius: 3,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'primary.lighter',
                      borderRadius: '50%',
                      p: 2,
                      mb: 2,
                    }}
                  >
                    <UploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Arrastra archivos aquí
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    o haz clic para seleccionar
                  </Typography>
                  <Box 
                    sx={{ 
                      mt: 2, 
                      p: 1.5, 
                      bgcolor: 'background.paper', 
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      Tamaño máximo permitido: 5MB
                    </Typography>
                  </Box>
                </Box>
              </DropzoneArea>

              {loading && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Subiendo archivo...
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={uploadProgress}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      }
                    }} 
                  />
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              {error && (
                <Alert 
                  severity="error" 
                  sx={{ mt: 3, borderRadius: 2 }}
                  variant="filled"
                >
                  {error}
                </Alert>
              )}

              {success && (
                <Alert 
                  severity="success" 
                  sx={{ mt: 3, borderRadius: 2 }}
                  variant="filled"
                >
                  {success}
                </Alert>
              )}

              <StyledTableContainer sx={{ mt: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Archivo</TableCell>
                      <TableCell>Información</TableCell>
                      <TableCell>Tamaño</TableCell>
                      <TableCell align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {files.map((file) => (
                      <TableRow key={file.fileId}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <FileIcon sx={{ mr: 2, color: 'primary.main' }} />
                            <Typography className="file-name">{file.originalName || 'Sin nombre'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell className="file-info">
                          <Typography variant="body2">
                            Subido el: {file.uploadedAt ? new Date(file.uploadedAt).toLocaleString('es-ES') : 'Fecha no disponible'}
                          </Typography>
                        </TableCell>
                        <TableCell className="file-info">
                          <Typography variant="body2">
                            {file.fileSize ? `${(file.fileSize / 1024).toFixed(2)} KB` : 'Tamaño no disponible'}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                            <Tooltip title="Descargar archivo">
                              <IconButton 
                                onClick={() => handleDownload(file.fileId)}
                                sx={{ 
                                  color: 'primary.main',
                                  '&:hover': { 
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark'
                                  }
                                }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar archivo">
                              <IconButton 
                                onClick={() => setConfirmDelete({ open: true, fileId: file.fileId })}
                                sx={{ 
                                  color: 'error.main',
                                  '&:hover': { 
                                    backgroundColor: 'error.light',
                                    color: 'error.dark'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </>
          ) : (
            <Box 
              sx={{ 
                textAlign: 'center', 
                py: 8, 
                bgcolor: 'background.paper',
                borderRadius: 4,
                border: '1px dashed',
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <ProjectIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary">
                Seleccione un proyecto para gestionar sus documentos
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      <Dialog
        open={confirmDelete.open}
        onClose={() => setConfirmDelete({ open: false, fileId: null })}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button 
            onClick={() => setConfirmDelete({ open: false, fileId: null })}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button 
            onClick={() => handleDelete(confirmDelete.fileId)}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExcelImport;

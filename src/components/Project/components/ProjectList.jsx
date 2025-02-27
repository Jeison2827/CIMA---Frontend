// src/pages/projects/components/ProjectList.js
import React, { useContext } from 'react';
import { ProjectContext } from '../../../context/ProjectContext';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  Skeleton,
  TableSortLabel,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectList = () => {
  const { projects, removeProject, loading } = useContext(ProjectContext);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [projectToDelete, setProjectToDelete] = React.useState(null);
  const [orderBy, setOrderBy] = React.useState('projectName');
  const [order, setOrder] = React.useState('asc');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      removeProject(projectToDelete.id);
    }
    setOpenDialog(false);
  };

  // Asegurarse de que projects es un array antes de filtrar
  const filteredProjects = projects && projects.length > 0 
    ? projects
        .filter((project) =>
          Object.values(project).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
        .sort((a, b) => {
          const isAsc = order === 'asc';
          if (!a[orderBy]) return -1;
          if (!b[orderBy]) return 1;
          return isAsc
            ? String(a[orderBy]).localeCompare(String(b[orderBy]))
            : String(b[orderBy]).localeCompare(String(a[orderBy]));
        })
    : [];

  if (loading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell colSpan={5}>
                <Skeleton animation="wave" height={50} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton animation="wave" /></TableCell>
                <TableCell><Skeleton animation="wave" /></TableCell>
                <TableCell><Skeleton animation="wave" /></TableCell>
                <TableCell><Skeleton animation="wave" /></TableCell>
                <TableCell><Skeleton animation="wave" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Buscar proyectos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <TableContainer 
        component={Paper} 
        sx={{ 
          mt: 2,
          boxShadow: 3,
          borderRadius: 2,
          '& .MuiTable-root': {
            minWidth: 650,
          }
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              {['Client ID', 'Nombre del Proyecto', 'Descripción', 'Estado', 'Acciones'].map((header, index) => (
                <TableCell 
                  key={header}
                  sx={{ color: 'white', fontWeight: 'bold' }}
                >
                  {index < 4 ? (
                    <TableSortLabel
                      active={orderBy === header.toLowerCase()}
                      direction={orderBy === header.toLowerCase() ? order : 'asc'}
                      onClick={() => handleRequestSort(header.toLowerCase())}
                      sx={{
                        color: 'white !important',
                        '&.MuiTableSortLabel-root:hover': {
                          color: 'white',
                        },
                        '& .MuiTableSortLabel-icon': {
                          color: 'white !important',
                        },
                      }}
                    >
                      {header}
                    </TableSortLabel>
                  ) : (
                    header
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay proyectos disponibles
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((project) => (
                  <TableRow 
                    key={project.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'action.hover' 
                      }
                    }}
                  >
                    <TableCell>{project.clientId}</TableCell>
                    <TableCell>{project.projectName}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          backgroundColor: project.status === 'Completed' ? 'success.main' : 'warning.main',
                          '&:hover': { 
                            backgroundColor: project.status === 'Completed' ? 'success.dark' : 'warning.dark' 
                          }
                        }}
                      >
                        {project.status}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar proyecto">
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                      <Tooltip title="Eliminar proyecto">
                        <Button 
                          variant="contained" 
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(project)}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredProjects.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}-${to} de ${count}`}
      />

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectList;

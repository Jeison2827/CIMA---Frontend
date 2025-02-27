import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Avatar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';
import styled from '@emotion/styled';
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { motion, AnimatePresence } from 'framer-motion';
import { IoGridOutline, IoListOutline } from 'react-icons/io5';
import Slide from '@mui/material/Slide';

const roles = ['Admin', 'Worker', 'Client'];

// Estilos personalizados usando styled-components
const StyledBox = styled(Box)(({ theme }) => ({
  padding: '40px',
  background: 'linear-gradient(135deg, #f6f9fc 0%, #f1f5f9 100%)',
  minHeight: '100vh',
}));

const PageHeader = styled(Box)(({ theme }) => ({
  marginBottom: '48px',
  textAlign: 'center',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '60px',
    height: '4px',
    background: 'linear-gradient(45deg, #2c3e50 30%, #3498db 90%)',
    borderRadius: '2px',
  }
}));

const EnhancedTableContainer = styled(TableContainer)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: '20px',
  boxShadow: '0 0 50px 0 rgba(82, 63, 105, 0.15)',
  overflow: 'hidden',
  border: '1px solid #ebedf3',
}));

const TableToolbar = styled(Box)(({ theme }) => ({
  padding: '20px 24px',
  background: '#ffffff',
  borderBottom: '1px solid #ebedf3',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}));

const SearchBar = styled('div')(({ theme }) => ({
  position: 'relative',
  flex: '1',
  maxWidth: '400px',
  '& .MuiInputBase-root': {
    width: '100%',
    background: alpha('#f3f6f9', 0.7),
    borderRadius: '10px',
    '&:hover': {
      background: '#f3f6f9',
    },
  },
  '& .MuiInputBase-input': {
    padding: '12px 12px 12px 45px',
  },
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#b5b5c3',
  },
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableCell-head': {
    background: '#f3f6f9',
    color: '#3f4254',
    fontWeight: 600,
    fontSize: '0.95rem',
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    whiteSpace: 'nowrap',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    background: alpha('#f3f6f9', 0.3),
  },
  '& .MuiTableCell-root': {
    padding: '16px 24px',
    borderBottom: '1px solid #ebedf3',
    color: '#7e8299',
  },
}));

const StatusChip = styled(Box)(({ status }) => ({
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.85rem',
  fontWeight: 500,
  display: 'inline-flex',
  alignItems: 'center',
  ...(status === 'Admin' && {
    background: alpha('#50cd89', 0.1),
    color: '#50cd89',
  }),
  ...(status === 'Worker' && {
    background: alpha('#009ef7', 0.1),
    color: '#009ef7',
  }),
  ...(status === 'Client' && {
    background: alpha('#f1416c', 0.1),
    color: '#f1416c',
  }),
}));

const ActionButton = styled(Button)(({ variant }) => ({
  background: variant === 'create' 
    ? 'linear-gradient(45deg, #3498db 30%, #2980b9 90%)'
    : 'linear-gradient(45deg, #e74c3c 30%, #c0392b 90%)',
  boxShadow: variant === 'create'
    ? '0 3px 5px 2px rgba(52, 152, 219, .3)'
    : '0 3px 5px 2px rgba(231, 76, 60, .3)',
  borderRadius: '8px',
  padding: '10px 25px',
  color: 'white',
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: variant === 'create'
      ? 'linear-gradient(45deg, #2980b9 30%, #2c3e50 90%)'
      : 'linear-gradient(45deg, #c0392b 30%, #a93226 90%)',
  }
}));

const UserManagement = () => {
  // Extraer el token desde Redux (asegúrate de que el path sea el correcto)
  const token = useSelector((state) => state.auth.accessToken);
  // Extrae el token y el userId desde Redux
  const userId = useSelector((state) =>  state.auth.user.userId);

  // Estado de usuarios (se obtendrán de la API)
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el diálogo (crear/editar/eliminar)
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedUser, setSelectedUser] = useState(null);

  // Estado del formulario (para crear/editar)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    address: '',
    phone: '',
  });

  // Estado para el loading del envío del formulario
  const [formLoading, setFormLoading] = useState(false);

  // Paginación
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  // Verifica e imprime el token en consola
  useEffect(() => {
    console.log('Token desde Redux:', token);
  }, [token]);

  // Obtener todos los usuarios desde la API cuando se monte el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/developer/users/', {
          headers: {
            'Content-Type': 'application/json',
            // Enviar el token en el header "accesstoken" (sin "Bearer")
            'accesstoken': token
          }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Error al cargar usuarios');
        toast.error('Error al cargar usuarios', { position: 'top-center' });
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Función para abrir el diálogo según la acción
  const openDialog = (mode, user = null) => {
    setDialogMode(mode);
    setSelectedUser(user);
    if (mode === 'edit' && user) {
      setFormData({ ...user });
    } else if (mode === 'create') {
      setFormData({ name: '', email: '', password: '', role: '', address: '', phone: '' });
    }
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedUser(null);
    setFormLoading(false);
  };

  // Manejo del envío del formulario para crear/editar
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    // Validación mínima: nombre y email obligatorios (ajusta según tus necesidades)
    if (!formData.name || !formData.email) {
      toast.error('Nombre y Email son obligatorios', { position: 'top-center' });
      return;
    }
  
    if (formLoading) return;
    setFormLoading(true);
  
    if (dialogMode === 'edit') {
      try {
        // Determina el ID del usuario a actualizar (considera que puede venir como userId o id)
        const idToUpdate = selectedUser.userId || selectedUser.id;
        if (!idToUpdate) {
          toast.error('ID del usuario no definido', { position: 'top-center' });
          setFormLoading(false);
          return;
        }
  
        // Arma el objeto con los datos actualizados
        const updatedData = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
        };
  
        // Si se ingresa una nueva contraseña, se envía
        if (formData.password && formData.password.trim() !== '') {
          updatedData.password = formData.password;
        }
  
        // Envía la petición PUT al backend para actualizar el usuario
        const response = await axios.put(
          `http://localhost:3000/developer/users/${idToUpdate}`,
          updatedData,
          {
            headers: {
              'Content-Type': 'application/json',
              'accesstoken': token,
            },
          }
        );
  
        // Actualiza el estado local (actualizando la tabla) para reflejar los nuevos datos
        const updatedUsers = users.map((user) => {
          const currentUserId = user.userId || user.id;
          if (currentUserId === idToUpdate) {
            return { ...user, ...updatedData };
          }
          return user;
        });
        setUsers(updatedUsers);
  
        toast.success('Usuario actualizado exitosamente', { position: 'top-center' });
        closeDialog();
      } catch (err) {
        console.error(err);
        toast.error('Error al actualizar usuario', { position: 'top-center' });
        setFormLoading(false);
      }
    }
  };
  
  const handleDelete = async () => {
    if (!selectedUser) {
      toast.error('No se ha seleccionado ningún usuario para eliminar', { position: 'top-center' });
      return;
    }
  
    // Usamos selectedUser.userId o selectedUser.id, según como venga desde la API
    const idToDelete = selectedUser.userId || selectedUser.id;
    if (!idToDelete) {
      toast.error('El usuario seleccionado no tiene un ID definido', { position: 'top-center' });
      return;
    }
  
    try {
      // Se envía la solicitud DELETE con el ID en el parámetro de la URL
      await axios.delete(`http://localhost:3000/developer/users/${idToDelete}`, {
        headers: {
          'Content-Type': 'application/json',
          'accesstoken': token,
        }
      });
  
      // Se actualiza el estado eliminando el usuario borrado
      const updatedUsers = users.filter((user) => {
        // Considera que el usuario puede tener la propiedad "userId" o "id"
        const currentUserId = user.userId || user.id;
        return currentUserId !== idToDelete;
      });
      setUsers(updatedUsers);
  
      toast.success('Usuario eliminado correctamente', { position: 'top-center' });
      closeDialog();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar usuario', { position: 'top-center' });
    }
  };
  
  // Manejo inmediato del cambio de rol en la tabla
  const handleRoleChange = (userId, newRole) => {
    const updatedUsers = users.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u
    );
    setUsers(updatedUsers);
    toast.success('Rol actualizado', { position: 'top-center' });
  };

  const currentUsers = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <StyledBox>
      <ToastContainer />
      
      <PageHeader>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#181c32',
          mb: 1,
        }}>
          Gestión de Usuarios
        </Typography>
        <Typography variant="body1" sx={{ color: '#7e8299' }}>
          Administra y gestiona todos los usuarios del sistema
        </Typography>
      </PageHeader>

      <EnhancedTableContainer>
        <TableToolbar>
          <SearchBar>
            <SearchIcon />
            <TextField
              placeholder="Buscar usuario..."
              variant="standard"
              InputProps={{
                disableUnderline: true,
              }}
            />
          </SearchBar>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<FilterListIcon />}
              sx={{
                background: '#f3f6f9',
                color: '#7e8299',
                '&:hover': { background: '#e9ecef' },
              }}
            >
              Filtrar
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => openDialog('create')}
              sx={{
                background: 'linear-gradient(135deg, #3699ff 0%, #2284f7 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2284f7 0%, #1876f0 100%)',
                },
              }}
            >
              Nuevo Usuario
            </Button>
          </Box>
        </TableToolbar>

        <Table>
          <StyledTableHead>
            <TableRow>
              <TableCell>Usuario</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Dirección</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {currentUsers.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ 
                      background: `linear-gradient(135deg, ${stringToColor(user.name)} 0%, ${adjustColor(stringToColor(user.name), -20)} 100%)`,
                    }}>
                      {getInitials(user.name)}
                    </Avatar>
                    <Typography sx={{ color: '#3f4254', fontWeight: 500 }}>
                      {user.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <StatusChip status={user.role}>
                    {user.role}
                  </StatusChip>
                </TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => openDialog('edit', user)}
                    sx={{ color: '#3699ff' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => openDialog('delete', user)}
                    sx={{ color: '#f1416c' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

        <Box sx={{ 
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #ebedf3',
        }}>
          <Typography sx={{ color: '#7e8299' }}>
            Mostrando {currentUsers.length} de {users.length} usuarios
          </Typography>
          <Pagination
            count={Math.ceil(users.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            sx={{
              '& .MuiPaginationItem-root': {
                borderColor: '#e9ecef',
                color: '#7e8299',
                '&.Mui-selected': {
                  background: '#f3f6f9',
                  borderColor: '#3699ff',
                  color: '#3699ff',
                },
              },
            }}
          />
        </Box>
      </EnhancedTableContainer>

      {/* Diálogo mejorado */}
      <Dialog
        open={dialogOpen && (dialogMode === 'create' || dialogMode === 'edit')}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            '& .MuiDialogTitle-root': {
              background: 'linear-gradient(45deg, #2c3e50 30%, #34495e 90%)',
              color: 'white',
              padding: '20px 24px'
            }
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#34495e', 
          color: 'white',
          fontSize: '1.25rem'
        }}>
          {dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <Box component="form" onSubmit={handleFormSubmit}>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <TextField
              margin="dense"
              label="Contraseña"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControl fullWidth margin="dense" variant="outlined" required>
              <InputLabel id="role-dialog-label">Rol</InputLabel>
              <Select
                labelId="role-dialog-label"
                label="Rol"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Dirección"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Teléfono"
              type="text"
              fullWidth
              variant="outlined"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} disabled={formLoading}>Cancelar</Button>
            <Button type="submit" variant="contained" color="primary" disabled={formLoading}>
              {dialogMode === 'create' ? (formLoading ? 'Creando...' : 'Crear') : 'Guardar'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={dialogOpen && dialogMode === 'delete'} onClose={closeDialog}>
        <DialogTitle>Eliminar Usuario</DialogTitle>
        <DialogContent dividers>
          <Typography>
            ¿Estás seguro de eliminar a <strong>{selectedUser?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </StyledBox>
  );
};

export default UserManagement;

// Funciones auxiliares
const stringToColor = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
};

const adjustColor = (color, amount) => {
  return '#' + color.replace(/^#/, '').replace(/../g, color => 
    ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).slice(-2)
  );
};

const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

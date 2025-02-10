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
  } from '@mui/material';
  import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
  import 'react-toastify/dist/ReactToastify.css';

  const roles = ['Admin', 'Worker', 'Client'];

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
      <Box sx={{ p: 4 }}>
        <ToastContainer />
        <Typography variant="h4" align="center" gutterBottom>
          Gestión de Usuarios
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography variant="body1" color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => openDialog('create')}>
                Crear Usuario
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table>
                <TableHead sx={{ backgroundColor: '#f4f4f4' }}>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Teléfono</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <FormControl variant="standard" sx={{ minWidth: 120 }}>
                          <InputLabel id={`role-label-${user.id}`}>Rol</InputLabel>
                          <Select
                            labelId={`role-label-${user.id}`}
                            label="Rol"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            {roles.map((role) => (
                              <MenuItem key={role} value={role}>
                                {role}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" onClick={() => openDialog('edit', user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => openDialog('delete', user)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {currentUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No hay usuarios disponibles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(users.length / rowsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          </>
        )}

        {/* Diálogo para crear/editar */}
        <Dialog
          open={dialogOpen && (dialogMode === 'create' || dialogMode === 'edit')}
          onClose={closeDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{dialogMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}</DialogTitle>
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

      </Box>
    );
  };

  export default UserManagement;

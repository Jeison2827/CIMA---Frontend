import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientTable.css';

const ClientTable = () => {
  const [clients, setClients] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [selectedClient, setSelectedClient] = useState(null); 
  const [clientToDelete, setClientToDelete] = useState(null); 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); 
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
  const [notification, setNotification] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el texto de búsqueda

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/developer/users');
        setClients(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleEditClick = (client) => {
    setSelectedClient(client); 
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (client) => {
    setClientToDelete(client); 
    setIsDeleteModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null); 
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null); 
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:3000/developer/users/${selectedClient.userId}`, selectedClient);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.userId === selectedClient.userId ? selectedClient : client
        )
      );
      setNotification('Cliente actualizado con éxito');
      setTimeout(() => setNotification(null), 3000);
      handleCloseEditModal();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/developer/users/${clientToDelete.userId}`);
      setClients((prevClients) =>
        prevClients.filter((client) => client.userId !== clientToDelete.userId)
      );
      setNotification('Cliente eliminado con éxito');
      setTimeout(() => setNotification(null), 3000);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  // Filtrar clientes según el texto de búsqueda
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="client-table-container">
      <h1>Lista de Usuarios</h1>
      
      {notification && <div className="notification">{notification}</div>}

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Actualizar el estado de búsqueda
        className="search-bar"
      />

      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.map((client) => (
            <tr key={client.userId}>
              <td>{client.userId}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.role}</td>
              <td>{new Date(client.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEditClick(client)}>Editar</button>
                <button onClick={() => handleDeleteClick(client)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {isEditModalOpen && selectedClient && (
        <div className="modal modal-fade-in">
          <div className="modal-content">
            <h2>Editar Cliente</h2>
            <form>
              <label>
                Nombre:
                <input
                  type="text"
                  value={selectedClient.name}
                  onChange={(e) =>
                    setSelectedClient({ ...selectedClient, name: e.target.value })
                  }
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={selectedClient.email}
                  onChange={(e) =>
                    setSelectedClient({ ...selectedClient, email: e.target.value })
                  }
                />
              </label>
              <label>
                Rol:
                <input
                  type="text"
                  value={selectedClient.role}
                  onChange={(e) =>
                    setSelectedClient({ ...selectedClient, role: e.target.value })
                  }
                />
              </label>
              <button type="button" onClick={handleSaveChanges}>
                Guardar Cambios
              </button>
              <button type="button" onClick={handleCloseEditModal}>
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && clientToDelete && (
        <div className="modal modal-fade-in">
          <div className="modal-content">
            <h2>Confirmar Eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar al cliente <strong>{clientToDelete.name}</strong>?
            </p>
            <button type="button" onClick={handleConfirmDelete}>
              Sí, eliminar
            </button>
            <button type="button" onClick={handleCloseDeleteModal}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTable;

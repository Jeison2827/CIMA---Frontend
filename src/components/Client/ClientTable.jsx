import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClientTable.css';

const ClientTable = () => {
  const [clients, setClients] = useState([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true); // Estado para el cargando

  // Realizar la petición a la API cuando el componente se monta
  useEffect(() => {
    const fetchClients = async () => {
      try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'http://localhost:3000/developer/users',
          headers: { }
        };

        const response = await axios.request(config);
        setClients(response.data); // Guardar los usuarios en el estado
        setLoading(false); // Marcar como cargado
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []); // El array vacío asegura que el efecto solo se ejecute una vez, cuando el componente se monta

  if (loading) {
    return <div>Loading...</div>; // Mostrar un mensaje de cargando mientras se obtiene la data
  }

  return (
    <div className="client-table-container">
      <h1>Lista de Usuarios</h1>
      <table className="client-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.userId}>
              <td>{client.userId}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.role}</td>
              <td>{new Date(client.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;

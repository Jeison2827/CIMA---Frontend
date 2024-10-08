import React, { useState } from 'react';
import './ClientTable.css'; // Asegúrate de que tengas este archivo CSS

const ClientTable = () => {
  // Datos ficticios para pruebas (puedes cambiar esto por tus datos reales)
  const allClients = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', address: 'Calle 123', phone: '555-1234' },
    { id: 2, name: 'Ana García', email: 'ana@example.com', address: 'Avenida 456', phone: '555-5678' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', address: 'Calle 789', phone: '555-9012' },
    { id: 4, name: 'Marta Ruiz', email: 'marta@example.com', address: 'Calle 101', phone: '555-3456' },
    { id: 5, name: 'Pedro Fernández', email: 'pedro@example.com', address: 'Calle 102', phone: '555-6789' },
    { id: 6, name: 'Luis Gómez', email: 'luis@example.com', address: 'Calle 103', phone: '555-4321' },
    { id: 7, name: 'Sofia Vargas', email: 'sofia@example.com', address: 'Calle 104', phone: '555-9876' },
    { id: 8, name: 'Carlos Romero', email: 'carlosr@example.com', address: 'Calle 105', phone: '555-1122' },
    { id: 9, name: 'Raul Gómez', email: 'raul@example.com', address: 'Calle 106', phone: '555-3321' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(3); // Número de clientes por página

  // Obtener clientes actuales de acuerdo a la paginación
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = allClients.slice(indexOfFirstClient, indexOfLastClient);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="client-table-container">
      <h1>Lista de Clientes</h1>
      <table className="client-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentClients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.address}</td>
              <td>{client.phone}</td>
              <td>
                <button className="edit-button" onClick={() => alert(`Editar cliente ${client.name}`)}>Editar</button>
                <button className="delete-button" onClick={() => alert(`Eliminar cliente ${client.name}`)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: Math.ceil(allClients.length / clientsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ClientTable;

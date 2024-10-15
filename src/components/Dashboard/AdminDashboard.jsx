// components/Dashboard/AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css'; // Importar los estilos

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h1>Panel de Administración</h1>

      <div className="admin-dashboard-cards">
        <Link to="/create-users-register" className="card">
          <i className="fas fa-user-plus"></i>
          <h2>Crear Cliente</h2>
          <p>Agrega nuevos clientes al sistema.</p>
        </Link>

        <Link to="/clients" className="card">
          <i className="fas fa-users-cog"></i>
          <h2>Gestionar Clientes</h2>
          <p>Administra la información de los clientes.</p>
        </Link>

        <Link to="/roles" className="card">
          <i className="fas fa-user-shield"></i>
          <h2>Gestionar Roles</h2>
          <p>Asigna y gestiona roles de usuario.</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;

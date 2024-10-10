import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import ClientDashboard from './ClientDashboard';
import ExcelImport from '../Excel/ExcelImport'; 
import ExcelExport from '../Excel/ExcelExport';
import ProjectStatus from '../ProjectStatus/ProjectStatus'; 
import CustomerSupport from '../CustomerSupport/CustomerSupport';
import ClientProjects from '../ClientProjects/ClientProjects';  // Corregir la importación
import './Dashboard.css'; 
import { logout } from '../../redux/slices/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estados para controlar qué vista mostrar
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(true); 
  const [showExcelExport, setShowExcelExport] = useState(false); 
  const [showProjectStatus, setShowProjectStatus] = useState(false);
  const [showCustomerSupport, setShowCustomerSupport] = useState(false); 
  const [showClientProjects, setShowClientProjects] = useState(false);

  if (!user || !user.role) {
    return <p>Acceso no autorizado</p>;
  }

  // Funciones para alternar la visibilidad de los componentes
  const toggleExcelImport = () => {
    setShowExcelImport(true);
    setShowAdminPanel(false);
    setShowExcelExport(false);
    setShowProjectStatus(false);
    setShowCustomerSupport(false);
    setShowClientProjects(false);
  };

  const toggleExcelExport = () => {
    setShowExcelExport(true);
    setShowAdminPanel(false);
    setShowExcelImport(false);
    setShowProjectStatus(false);
    setShowCustomerSupport(false);
    setShowClientProjects(false);
  };

  const showAdminDashboard = () => {
    setShowAdminPanel(true);
    setShowExcelImport(false);
    setShowExcelExport(false);
    setShowProjectStatus(false);
    setShowCustomerSupport(false);
    setShowClientProjects(false);
  };

  const showProjectStatusDashboard = () => {
    setShowProjectStatus(true);
    setShowAdminPanel(false);
    setShowExcelImport(false);
    setShowExcelExport(false);
    setShowCustomerSupport(false);
    setShowClientProjects(false);
  };

  const showCustomerSupportDashboard = () => {
    setShowCustomerSupport(true);
    setShowAdminPanel(false);
    setShowExcelImport(false);
    setShowExcelExport(false);
    setShowProjectStatus(false);
    setShowClientProjects(false);
  };

  const showClientProjectsDashboard = () => {
    setShowClientProjects(true);
    setShowAdminPanel(false);
    setShowExcelImport(false);
    setShowExcelExport(false);
    setShowProjectStatus(false);
    setShowCustomerSupport(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>{user.name}</h2>
          <p>{user.role === 'Admin' ? 'Administrador' : user.role}</p>
        </div>
        <ul className="sidebar-menu">
          {user.role === 'Admin' && (
            <>
              <li onClick={showAdminDashboard}><i className="fas fa-home"></i> Home</li>
              <li onClick={toggleExcelImport}><i className="fas fa-file-excel"></i> Importar Excel</li>
              <li onClick={toggleExcelExport}><i className="fas fa-file-export"></i> Exportar Excel</li>
              <li onClick={showProjectStatusDashboard}><i className="fas fa-chart-line"></i> Estado del Proyecto</li>
              <li onClick={showCustomerSupportDashboard}><i className="fas fa-headset"></i> Soporte</li>
            </>
          )}
          {user.role === 'Worker' && (
            <>
              <li><i className="fas fa-project-diagram"></i> Proyectos</li>
              <li><i className="fas fa-tasks"></i> Tareas</li>
            </>
          )}
          {user.role === 'Client' && (
            <>
              <li onClick={showClientProjectsDashboard}><i className="fas fa-project-diagram"></i> Mis Proyectos</li>
              <li onClick={showProjectStatusDashboard}><i className="fas fa-chart-line"></i> Estado del Proyecto</li>
              <li onClick={showCustomerSupportDashboard}><i className="fas fa-headset"></i> Soporte al Cliente</li>
            </>
          )}
          <li onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</li>
        </ul>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bienvenido, {user.name}</h1>
        </header>

        <section className="dashboard-content">
          {/* Mostrar el contenido dependiendo del botón presionado */}
          {showAdminPanel && user.role === 'Admin' && <AdminDashboard />}
          {showExcelImport && <ExcelImport />}
          {showExcelExport && <ExcelExport />}
          {showProjectStatus && <ProjectStatus userRole={user.role} />}
          {showCustomerSupport && <CustomerSupport />}
          {user.role === 'Client' && showClientProjects } {/* Mostrar interfaz de "Mis Proyectos" */}
          {user.role === 'Worker' && <WorkerDashboard />}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;

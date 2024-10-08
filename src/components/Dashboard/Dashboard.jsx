import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate en lugar de useHistory
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import ClientDashboard from './ClientDashboard';
import ExcelImport from '../Excel/ExcelImport'; 
import ExcelExport from '../Excel/ExcelExport';
import ProjectStatus from '../ProjectStatus/ProjectStatus'; // Importamos el componente de estado del proyecto
import './Dashboard.css'; 
import { logout } from '../../redux/slices/authSlice'; // Asumiendo que tienes una acción para cerrar sesión

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Usamos useNavigate para redireccionar

  // Estados para controlar qué vista mostrar
  const [showExcelImport, setShowExcelImport] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(true); // Estado para el botón "Home"
  const [showExcelExport, setShowExcelExport] = useState(false); // Estado para el botón "Exportar Excel"
  const [showProjectStatus, setShowProjectStatus] = useState(false); // Nuevo estado para el botón "Estado del Proyecto"

  if (!user || !user.role) {
    return <p>Acceso no autorizado</p>;
  }

  // Función para alternar la visibilidad del componente ExcelImport
  const toggleExcelImport = () => {
    setShowExcelImport(true);
    setShowAdminPanel(false);
    setShowExcelExport(false);
    setShowProjectStatus(false); // Ocultar Estado del Proyecto
  };

  // Función para alternar la visibilidad del componente ExcelExport
  const toggleExcelExport = () => {
    setShowExcelExport(true);
    setShowAdminPanel(false);
    setShowExcelImport(false);
    setShowProjectStatus(false); // Ocultar Estado del Proyecto
  };

  // Función para mostrar el panel de administración (cuando se presiona "Home")
  const showAdminDashboard = () => {
    setShowAdminPanel(true);
    setShowExcelImport(false);
    setShowExcelExport(false);
    setShowProjectStatus(false); // Ocultar Estado del Proyecto
  };

  // Función para mostrar el estado del proyecto
  const showProjectStatusDashboard = () => {
    setShowProjectStatus(true); // Mostrar Estado del Proyecto
    setShowAdminPanel(false); 
    setShowExcelImport(false); 
    setShowExcelExport(false); 
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    dispatch(logout()); // Despachar acción de logout (si existe en Redux)
    navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
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
              <li onClick={showAdminDashboard}><i className="fas fa-home"></i> Home</li> {/* Botón Home */}
              <li onClick={toggleExcelImport}><i className="fas fa-file-excel"></i> Importar Excel</li> {/* Botón para importar Excel */}
              <li onClick={toggleExcelExport}><i className="fas fa-file-export"></i> Exportar Excel</li> {/* Botón para exportar Excel */}
              <li onClick={showProjectStatusDashboard}><i className="fas fa-chart-line"></i> Estado del Proyecto</li> {/* Botón Estado del Proyecto */}
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
              <li><i className="fas fa-briefcase"></i> Mis Proyectos</li>
              <li onClick={showProjectStatusDashboard}><i className="fas fa-chart-line"></i> Estado del Proyecto</li> {/* Botón Estado del Proyecto para el cliente */}
              <li><i className="fas fa-headset"></i> Soporte</li>
            </>
          )}
          <li onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Cerrar Sesión</li> {/* Botón para cerrar sesión */}
        </ul>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <h1>Bienvenido, {user.name}</h1>
        </header>

        <section className="dashboard-content">
          {/* Mostrar el contenido dependiendo del botón presionado */}
          {showAdminPanel && user.role === 'Admin' && <AdminDashboard />} {/* Mostrar el panel de administración si "Home" está seleccionado */}
          {showExcelImport && <ExcelImport />} {/* Mostrar el componente Importar Excel si "Importar Excel" está seleccionado */}
          {showExcelExport && <ExcelExport />} {/* Mostrar el componente Exportar Excel si "Exportar Excel" está seleccionado */}
          {showProjectStatus && <ProjectStatus userRole={user.role} />} {/* Mostrar el estado del proyecto si está seleccionado */}

          {/* Otros roles muestran sus propios dashboards */}
          {user.role === 'Worker' && <WorkerDashboard />}
          {user.role === 'Client' && !showProjectStatus && <ClientDashboard />} {/* Dashboard del cliente */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


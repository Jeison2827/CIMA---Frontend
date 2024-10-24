import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import AdminDashboard from './AdminDashboard';
import WorkerDashboard from './WorkerDashboard';
import ClientDashboard from './ClientDashboard';
import ExcelImport from '../Excel/ExcelImport'; 
import ExcelExport from '../Excel/ExcelExport';
import CustomerSupport from '../CustomerSupport/CustomerSupport';
import ClientProjects from '../ClientProjects/ClientProjects'; 
import WorkerProjects from '../WorkerProjects/WorkerProjects';  
import WorkerTasks from '../WorkerTasks/WorkerTasks';
import FaqClient from '../FaqClient/FaqClient';
import FaqAdmin from '../FaqAdmin/FaqAdmin';
import AdminProyects from '../AdminProyects/AdminProyects'
import './Dashboard.css'; 
import { logout } from '../../redux/slices/authSlice';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Estado para manejar la vista activa
  const [activeView, setActiveView] = useState('adminDashboard'); // Vista por defecto

  if (!user || !user.role) {
    return <p>Acceso no autorizado</p>;
  }

  // Función para cambiar la vista activa
  const changeView = (view) => {
    setActiveView(view);
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
              <li onClick={() => changeView('adminDashboard')}><i className="fas fa-home"></i> Home</li>
              <li onClick={() => changeView('adminProyects')}><i className="fas fa-question-circle"></i> Administrar Proyectos</li>
              <li onClick={() => changeView('excelImport')}><i className="fas fa-file-excel"></i> Importar Excel</li>
              <li onClick={() => changeView('faqAdmin')}><i className="fas fa-question-circle"></i> Gestionar FAQs</li>
            </>
          )}
          {user.role === 'Worker' && (
            <>
              <li onClick={() => changeView('workerProjects')}><i className="fas fa-project-diagram"></i> Proyectos</li>
              <li onClick={() => changeView('workerTasks')}><i className="fas fa-tasks"></i> Tareas</li>
            </>
          )}
          {user.role === 'Client' && (
            <>
              <li onClick={() => changeView('clientProjects')}><i className="fas fa-project-diagram"></i> Mis Proyectos</li>
              <li onClick={() => changeView('customerSupport')}><i className="fas fa-headset"></i> Soporte al Cliente</li>
              <li onClick={() => changeView('faqClient')}><i className="fas fa-question-circle"></i> Preguntas Frecuentes</li>
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
          {activeView === 'adminDashboard' && user.role === 'Admin' && <AdminDashboard />}
          {activeView === 'excelImport' && <ExcelImport />}
          {activeView === 'excelExport' && <ExcelExport />}
          {activeView === 'customerSupport' && <CustomerSupport />}
          {activeView === 'clientProjects' && user.role === 'Client' && <ClientProjects />}
          {activeView === 'faqClient' && user.role === 'Client' && <FaqClient />}
          {activeView === 'workerProjects' && user.role === 'Worker' && <WorkerProjects />}
          {activeView === 'workerTasks' && user.role === 'Worker' && <WorkerTasks />}
          {activeView === 'faqAdmin' && user.role === 'Admin' && <FaqAdmin />}
          {activeView === 'workerAdmin' && user.role === 'Admin' && <AdminProyects />}
          {activeView === 'adminProyects' && user.role === 'Admin' && <AdminProyects />}

        </section>
      </main>
    </div>
  );
};

export default Dashboard;
   
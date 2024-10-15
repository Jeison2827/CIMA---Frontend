import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkerProjects.css';

const WorkerProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdates, setStatusUpdates] = useState({});
  const navigate = useNavigate();

  // Simulamos la obtención de datos de los proyectos (en un escenario real, esto provendría de una API)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = [
          { id: 1, name: 'Proyecto A', status: 'En progreso', startDate: '2023-01-15' },
          { id: 2, name: 'Proyecto B', status: 'En progreso', startDate: '2023-02-10' },
          { id: 3, name: 'Proyecto C', status: 'En espera', startDate: '2023-03-01' },
        ];
        setProjects(response);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los proyectos.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleViewDetails = (projectId) => {
    navigate(`/project-status/${projectId}`);
  };

  const handleStatusChange = (projectId, newStatus) => {
    setStatusUpdates((prevUpdates) => ({
      ...prevUpdates,
      [projectId]: newStatus,
    }));
  };

  const handleUpdateStatus = (projectId) => {
    const updatedStatus = statusUpdates[projectId];
    if (updatedStatus) {
      // Simulamos una actualización en el servidor
      const updatedProjects = projects.map((project) =>
        project.id === projectId ? { ...project, status: updatedStatus } : project
      );
      setProjects(updatedProjects);
      alert(`Estado del proyecto ${projectId} actualizado a: ${updatedStatus}`);
    }
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="worker-projects-container">
      <h1>Proyectos Asignados</h1>
      {projects.length === 0 ? (
        <p>No tienes proyectos asignados en este momento.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <h2>{project.name}</h2>
              <p>Estado actual: {project.status}</p>
              <p>Fecha de inicio: {new Date(project.startDate).toLocaleDateString()}</p>
              
              {/* Formulario para cambiar el estado */}
              <label htmlFor={`status-${project.id}`}>Actualizar Estado:</label>
              <select
                id={`status-${project.id}`}
                value={statusUpdates[project.id] || project.status}
                onChange={(e) => handleStatusChange(project.id, e.target.value)}
              >
                <option value="En progreso">En progreso</option>
                <option value="Completado">Completado</option>
                <option value="En espera">En espera</option>
              </select>

              <button
                className="btn-update"
                onClick={() => handleUpdateStatus(project.id)}
              >
                Actualizar Estado
              </button>

              <button 
                className="btn-details" 
                onClick={() => handleViewDetails(project.id)}
              >
                Ver Detalles
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkerProjects;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate
import './ClientProjects.css'; // Archivo para los estilos

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para redirigir a otra ruta

  // Simulamos la obtención de datos de los proyectos (en un escenario real, esto provendría de una API)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Simulamos una respuesta del servidor con proyectos en ejecución
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
    // Redirigimos a la página ProjectStatus pasando el id del proyecto en la URL
    navigate(`/project-status/${projectId}`);
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="client-projects-container">
      <h1>Proyectos en Ejecución</h1>
      {projects.length === 0 ? (
        <p>No tienes proyectos en ejecución en este momento.</p>
      ) : (
        <ul className="project-list">
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <h2>{project.name}</h2>
              <p>Estado: {project.status}</p>
              <p>Fecha de inicio: {new Date(project.startDate).toLocaleDateString()}</p>
              <button 
                className="btn-details" 
                onClick={() => handleViewDetails(project.id)} // Añadimos el manejador de clic
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

export default ClientProjects;


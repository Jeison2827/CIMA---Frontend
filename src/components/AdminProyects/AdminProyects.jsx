import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminProyects.css';

const ClientTable = () => {
  const [projects, setProjects] = useState([]); // Estado para proyectos
  const [workers, setWorkers] = useState([]); // Estado para trabajadores
  const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
  const [assignedWorkers, setAssignedWorkers] = useState([]); // Trabajadores asignados
  const [taskDescription, setTaskDescription] = useState(''); // Descripción de la tarea
  const [notification, setNotification] = useState(null); // Notificación de éxito o error

  // Cargar proyectos y trabajadores al iniciar
  useEffect(() => {
    const fetchProjectsAndWorkers = async () => {
      try {
        const projectsResponse = await axios.get('http://localhost:3000/projects');
        const workersResponse = await axios.get('http://localhost:3000/workers');
        setProjects(projectsResponse.data); // Guardar proyectos
        setWorkers(workersResponse.data); // Guardar trabajadores
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProjectsAndWorkers();
  }, []);

  // Manejar la asignación de trabajadores a un proyecto
  const handleAssignWorkers = async () => {
    if (!selectedProject || assignedWorkers.length === 0 || !taskDescription) {
      setNotification('Por favor, selecciona un proyecto, asigna trabajadores y define la tarea.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/projects/${selectedProject.id}/assign-workers`, {
        workers: assignedWorkers,
        taskDescription
      });

      setNotification('Trabajadores asignados con éxito.');
      setTimeout(() => setNotification(null), 3000); // Limpiar la notificación después de 3 segundos
      setAssignedWorkers([]); // Limpiar asignaciones
      setTaskDescription(''); // Limpiar descripción
    } catch (error) {
      console.error('Error assigning workers:', error);
      setNotification('Error al asignar trabajadores.');
    }
  };

  return (
    <div className="client-table-container">
      <h1>Asignación de Tareas por Proyecto</h1>

      {notification && <div className="notification">{notification}</div>} {/* Mostrar notificación */}

      {/* Dropdown para seleccionar proyecto */}
      <label htmlFor="project-select">Seleccionar Proyecto:</label>
      <select
        id="project-select"
        value={selectedProject ? selectedProject.id : ''}
        onChange={(e) =>
          setSelectedProject(projects.find((project) => project.id === parseInt(e.target.value)))
        }
      >
        <option value="">Selecciona un proyecto</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {/* Selección de trabajadores */}
      <div className="workers-assignment">
        <label htmlFor="workers-select">Seleccionar Trabajadores:</label>
        <select
          id="workers-select"
          multiple
          value={assignedWorkers}
          onChange={(e) =>
            setAssignedWorkers(Array.from(e.target.selectedOptions, (option) => option.value))
          }
        >
          {workers.map((worker) => (
            <option key={worker.id} value={worker.id}>
              {worker.name}
            </option>
          ))}
        </select>
      </div>

      {/* Input para la descripción de la tarea */}
      <div className="task-assignment">
        <label htmlFor="taskDescription">Descripción de la Tarea:</label>
        <textarea
          id="taskDescription"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          placeholder="Describe la tarea..."
        />
      </div>

      {/* Botón para asignar trabajadores */}
      <button type="button" onClick={handleAssignWorkers}>
        Asignar Trabajadores
      </button>

      {/* Mostrar tabla de proyectos y asignaciones */}
      <table className="client-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Trabajadores Asignados</th>
            <th>Tarea</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td>{project.name}</td>
              <td>
                {workers
                  .filter((worker) => worker.projectId === project.id)
                  .map((worker) => worker.name)
                  .join(', ')}
              </td>
              <td>{project.taskDescription || 'Sin tarea asignada'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;

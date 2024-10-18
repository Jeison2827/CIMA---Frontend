import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ClientProjects.css'; // Estilos personalizados


const ClientProjectsViewOnly = () => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]); // Tareas del proyecto seleccionado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado para mostrar en el modal

  // Simulamos la obtención de los proyectos
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = [
          { id: 1, name: 'Proyecto A', status: 'En progreso' },
          { id: 2, name: 'Proyecto B', status: 'Finalizado' },
          { id: 3, name: 'Proyecto C', status: 'En espera' },
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

  // Función para mostrar tareas en el modal
  const handleViewDetails = async (project) => {
    setSelectedProject(project);
    try {
      // Simulamos la obtención de las tareas desde la base de datos
      const tasksResponse = [
        { id: 1, description: 'Proceso 1', status: 'Cumplida' },
        { id: 2, description: 'Proceso 2', status: 'Pendiente' },
        { id: 3, description: 'Proceso 3', status: 'En progreso' },
      ];
      setProjectTasks(tasksResponse);
      setShowModal(true); // Mostramos el modal
    } catch (err) {
      setError('Error al cargar las tareas del proyecto.');
    }
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProject(null);
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Proyectos en Ejecución (Solo Vista)</h1>
      <div className="row">
        <div className="col-12">
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th>#</th>
                <th>Nombre del Proyecto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project.id}>
                  <td>{index + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => handleViewDetails(project)}
                    >
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para visualizar tareas */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Proyecto: {selectedProject?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Tareas del Proyecto</h5>
          <ul className="list-group">
            {projectTasks.map((task) => (
              <li key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
                <span>{task.description}</span>
                {/* Deshabilitamos el select para que sea solo de vista */}
                <select
                  className="form-control w-50"
                  value={task.status}
                  disabled // Deshabilitado para evitar edición
                >
                  <option value="Cumplida">Cumplida</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En progreso">En progreso</option>
                </select>
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientProjectsViewOnly;

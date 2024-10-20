import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false); // Modal para nuevo proyecto
  const [showNewTaskModal, setShowNewTaskModal] = useState(false); // Modal para nueva tarea
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState(''); // Nombre del nuevo proyecto
  const [newProjectStatus, setNewProjectStatus] = useState('En progreso'); // Estado del nuevo proyecto
  const [newTaskDescription, setNewTaskDescription] = useState(''); // Descripción de la nueva tarea
  const [newTaskStatus, setNewTaskStatus] = useState('Pendiente'); // Estado de la nueva tarea

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
      const tasksResponse = [
        { id: 1, description: 'Tarea 1', status: 'Cumplida' },
        { id: 2, description: 'Tarea 2', status: 'Pendiente' },
        { id: 3, description: 'Tarea 3', status: 'En progreso' },
      ];
      setProjectTasks(tasksResponse);
      setShowModal(true);
    } catch (err) {
      setError('Error al cargar las tareas del proyecto.');
    }
  };

  // Función para agregar un nuevo proyecto
  const handleAddNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      status: newProjectStatus,
    };
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false); // Cerrar el modal
    setNewProjectName(''); // Limpiar los campos
    setNewProjectStatus('En progreso');
  };

  // Función para agregar una nueva tarea
  const handleAddNewTask = () => {
    const newTask = {
      id: projectTasks.length + 1,
      description: newTaskDescription,
      status: newTaskStatus,
    };
    setProjectTasks([...projectTasks, newTask]);
    setShowNewTaskModal(false); // Cerrar el modal
    setNewTaskDescription(''); // Limpiar los campos
    setNewTaskStatus('Pendiente');
  };

  // Función para manejar el cambio de estado de una tarea
  const handleTaskStatusChange = (taskId, newStatus) => {
    setProjectTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
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
      <h1 className="mb-4">Proyectos en Ejecución</h1>

      {/* Botón para agregar nuevo proyecto */}
      <Button variant="success" className="mb-3" onClick={() => setShowNewProjectModal(true)}>
        Agregar Nuevo Proyecto
      </Button>

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
                    <Button variant="primary" onClick={() => handleViewDetails(project)}>
                      Ver Detalles
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para visualizar y editar tareas */}
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
                <select
                  className="form-control w-50"
                  value={task.status}
                  onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
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
          <Button variant="primary" onClick={() => setShowNewTaskModal(true)}>
            Agregar Nueva Tarea
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar nuevo proyecto */}
      <Modal show={showNewProjectModal} onHide={() => setShowNewProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newProjectName">
              <Form.Label>Nombre del Proyecto</Form.Label>
              <Form.Control
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Ingrese el nombre del proyecto"
              />
            </Form.Group>
            <Form.Group controlId="newProjectStatus">
              <Form.Label>Estado del Proyecto</Form.Label>
              <Form.Control
                as="select"
                value={newProjectStatus}
                onChange={(e) => setNewProjectStatus(e.target.value)}
              >
                <option value="En progreso">En progreso</option>
                <option value="Finalizado">Finalizado</option>
                <option value="En espera">En espera</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewProjectModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddNewProject}>
            Guardar Proyecto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para agregar nueva tarea */}
      <Modal show={showNewTaskModal} onHide={() => setShowNewTaskModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Tarea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="newTaskDescription">
              <Form.Label>Descripción de la Tarea</Form.Label>
              <Form.Control
                type="text"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Ingrese la descripción de la tarea"
              />
            </Form.Group>
            <Form.Group controlId="newTaskStatus">
              <Form.Label>Estado de la Tarea</Form.Label>
              <Form.Control
                as="select"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Cumplida">Cumplida</option>
                <option value="En progreso">En progreso</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewTaskModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddNewTask}>
            Guardar Tarea
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientProjects;

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('En progreso');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskStatus, setNewTaskStatus] = useState('Pendiente');
  const [showUserManagement, setShowUserManagement] = useState(false); // Modal for managing users

  // Simulate fetching data for projects and users
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = [
          { id: 1, name: 'Proyecto A', status: 'En progreso', owner: 'Juan' },
          { id: 2, name: 'Proyecto B', status: 'Finalizado', owner: 'Maria' },
          { id: 3, name: 'Proyecto C', status: 'En espera', owner: 'Ana' },
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

  // Display tasks in modal
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

  // Add new project
  const handleAddNewProject = () => {
    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      status: newProjectStatus,
      owner: 'Admin', // Added owner for admin role
    };
    setProjects([...projects, newProject]);
    setShowNewProjectModal(false);
    setNewProjectName('');
    setNewProjectStatus('En progreso');
  };

  // Add new task
  const handleAddNewTask = () => {
    const newTask = {
      id: projectTasks.length + 1,
      description: newTaskDescription,
      status: newTaskStatus,
    };
    setProjectTasks([...projectTasks, newTask]);
    setShowNewTaskModal(false);
    setNewTaskDescription('');
    setNewTaskStatus('Pendiente');
  };

  // Manage users
  const handleManageUsers = () => {
    setShowUserManagement(true);
  };

  // Close user management modal
  const handleCloseUserManagement = () => {
    setShowUserManagement(false);
  };

  // Delete a project
  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter((project) => project.id !== projectId));
  };

  // Change task status
  const handleTaskStatusChange = (taskId, newStatus) => {
    setProjectTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task))
    );
  };

  if (loading) return <p>Cargando proyectos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Panel de Control del Administrador</h1>

      {/* Project and User Management Section */}
      <div className="mb-4 d-flex justify-content-between">
        <Button variant="success" onClick={() => setShowNewProjectModal(true)}>
          Agregar Nuevo Proyecto
        </Button>
        <Button variant="info" onClick={handleManageUsers}>
          Gestión de Usuarios
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre del Proyecto</th>
            <th>Estado</th>
            <th>Responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id}>
              <td>{index + 1}</td>
              <td>{project.name}</td>
              <td>{project.status}</td>
              <td>{project.owner}</td>
              <td>
                <Button variant="primary" onClick={() => handleViewDetails(project)}>
                  Ver Detalles
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for viewing and editing tasks */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => setShowNewTaskModal(true)}>
            Agregar Nueva Tarea
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for adding new project */}
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

      {/* Modal for adding new task */}
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
                <option value="En progreso">En progreso</option>
                <option value="Cumplida">Cumplida</option>
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

      {/* Modal for managing users */}
      <Modal show={showUserManagement} onHide={handleCloseUserManagement}>
        <Modal.Header closeButton>
          <Modal.Title>Gestión de Usuarios</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Aquí iría la gestión de los usuarios. Ejemplo de listado de usuarios y sus roles.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUserManagement}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;

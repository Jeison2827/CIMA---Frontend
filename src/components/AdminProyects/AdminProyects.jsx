import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminProyects.css';

const ClientTable = () => {
  // Datos iniciales para proyectos y trabajadores
  const [projects, setProjects] = useState([
    { id: 1, name: "Proyecto Alpha", plan: "Plan inicial para Alpha", taskDescription: "Desarrollar el backend", taskStatus: "pendiente", contractType: "Platino" },
    { id: 2, name: "Proyecto Beta", plan: "Plan para desarrollo del frontend", taskDescription: "Implementar el diseño", taskStatus: "en progreso", contractType: "Oro" },
  ]);
  
  const [workers, setWorkers] = useState([
    { id: 1, name: "Juan Perez", projectId: 1 },
    { id: 2, name: "Ana Gómez", projectId: 1 },
    { id: 3, name: "Carlos López", projectId: 2 },
  ]);

  // Estados para gestionar la interacción
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectPlan, setNewProjectPlan] = useState('');
  const [newProjectContractType, setNewProjectContractType] = useState('Platino'); // Estado para el tipo de contrato
  const [assignedWorkers, setAssignedWorkers] = useState([]);
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('pendiente');
  const [notification, setNotification] = useState(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Crear un nuevo proyecto
  const handleCreateProject = () => {
    if (!newProjectName || !newProjectPlan) {
      setNotification('Por favor, ingresa el nombre, el plan y el tipo de contrato del proyecto.');
      return;
    }

    const newProject = {
      id: projects.length + 1,
      name: newProjectName,
      plan: newProjectPlan,
      taskDescription: '',
      taskStatus: 'pendiente',
      contractType: newProjectContractType // Añadido el tipo de contrato
    };

    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectPlan('');
    setNewProjectContractType('Platino'); // Reset tipo de contrato
    setNotification('Proyecto creado con éxito.');
    setTimeout(() => setNotification(null), 3000);
    setShowProjectModal(false);
  };

  // Asignar trabajadores a un proyecto
  const handleAssignWorkers = () => {
    if (!selectedProject || assignedWorkers.length === 0 || !taskDescription) {
      setNotification('Por favor, selecciona un proyecto, asigna trabajadores y define la tarea.');
      return;
    }

    setProjects(projects.map((project) =>
      project.id === selectedProject.id
        ? { ...project, taskDescription, taskStatus }
        : project
    ));

    setWorkers(
      workers.map((worker) =>
        assignedWorkers.includes(worker.id.toString())
          ? { ...worker, projectId: selectedProject.id }
          : worker
      )
    );

    setNotification('Trabajadores asignados con éxito.');
    setTimeout(() => setNotification(null), 3000);
    setAssignedWorkers([]);
    setTaskDescription('');
    setTaskStatus('pendiente');
    setShowAssignmentModal(false);
  };

  // Editar proyecto (incluyendo trabajadores asignados, descripción y estado de la tarea)
  const handleEditProject = () => {
    if (!newProjectName || !newProjectPlan || !newProjectContractType) {
      setNotification('Por favor, ingresa todos los detalles del proyecto.');
      return;
    }

    setProjects(
      projects.map((project) =>
        project.id === selectedProject.id
          ? {
              ...project,
              name: newProjectName,
              plan: newProjectPlan,
              taskDescription: taskDescription,
              taskStatus: taskStatus,
              contractType: newProjectContractType // Actualización del tipo de contrato
            }
          : project
      )
    );

    setWorkers(
      workers.map((worker) =>
        assignedWorkers.includes(worker.id.toString())
          ? { ...worker, projectId: selectedProject.id }
          : worker
      )
    );

    setNotification('Proyecto actualizado con éxito.');
    setTimeout(() => setNotification(null), 3000);
    setShowEditModal(false);
  };

  // Eliminar proyecto
  const handleDeleteProject = () => {
    setProjects(projects.filter((project) => project.id !== selectedProject.id));
    setWorkers(workers.map(worker => worker.projectId === selectedProject.id ? { ...worker, projectId: null } : worker)); // Desasignar trabajadores del proyecto eliminado
    setNotification('Proyecto eliminado con éxito.');
    setTimeout(() => setNotification(null), 3000);
    setShowDeleteModal(false);
  };

  return (
    <div className="client-table-container">
      <h1>Administración de Proyectos</h1>

      {notification && <div className="notification">{notification}</div>} {/* Mostrar notificación */}

      {/* Lista de proyectos */}
      <table className="client-table">
        <thead>
          <tr>
            <th>Proyecto</th>
            <th>Trabajadores Asignados</th>
            <th>Plan</th>
            <th>Tareas</th>
            <th>Contrato</th> {/* Nueva columna para mostrar el tipo de contrato */}
            <th>Acciones</th>
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
                  .join(', ') || 'Sin trabajadores asignados'}
              </td>
              <td>{project.plan}</td>
              <td>{project.taskDescription || 'Sin tarea asignada'}</td>
              <td>{project.contractType}</td> {/* Mostrar el tipo de contrato */}
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setSelectedProject(project);
                    setNewProjectName(project.name);
                    setNewProjectPlan(project.plan);
                    setTaskDescription(project.taskDescription || '');
                    setTaskStatus(project.taskStatus || 'pendiente');
                    setNewProjectContractType(project.contractType); // Preseleccionar tipo de contrato
                    setAssignedWorkers(
                      workers.filter(worker => worker.projectId === project.id).map(worker => worker.id.toString())
                    );
                    setShowEditModal(true);
                  }}
                >
                  Editar
                </Button>
                {' '}
                <Button
                  variant="danger"
                  onClick={() => {
                    setSelectedProject(project);
                    setShowDeleteModal(true);
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Botones para abrir los modales */}
      <Button variant="primary" onClick={() => setShowProjectModal(true)}>
        Crear Proyecto
      </Button>
      <Button variant="secondary" onClick={() => setShowAssignmentModal(true)}>
        Asignar Trabajadores
      </Button>

      {/* Modal para creación de proyecto */}
      <Modal show={showProjectModal} onHide={() => setShowProjectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Nuevo Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="newProjectName">Nombre del Proyecto:</label>
          <input
            type="text"
            id="newProjectName"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="form-control"
          />
          <label htmlFor="newProjectPlan">Plan del Proyecto:</label>
          <input
            type="text"
            id="newProjectPlan"
            value={newProjectPlan}
            onChange={(e) => setNewProjectPlan(e.target.value)}
            className="form-control"
          />
          <label htmlFor="newProjectContractType">Tipo de Contrato:</label>
          <select
            id="newProjectContractType"
            value={newProjectContractType}
            onChange={(e) => setNewProjectContractType(e.target.value)}
            className="form-control"
          >
            <option value="Platino">Platino</option>
            <option value="Oro">Oro</option>
            <option value="Diamante">Diamante</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProjectModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleCreateProject}>
            Crear Proyecto
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para asignación de trabajadores */}
      <Modal show={showAssignmentModal} onHide={() => setShowAssignmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Asignar Trabajadores</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Dropdown para seleccionar proyecto */}
          <label htmlFor="project-select">Seleccionar Proyecto:</label>
          <select
            id="project-select"
            value={selectedProject ? selectedProject.id : ''}
            onChange={(e) =>
              setSelectedProject(projects.find((project) => project.id === parseInt(e.target.value)))
            }
            className="form-control"
          >
            <option value="">Selecciona un proyecto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {/* Selección de trabajadores */}
          <label htmlFor="workers-select">Seleccionar Trabajadores:</label>
          <select
            id="workers-select"
            multiple
            value={assignedWorkers}
            onChange={(e) =>
              setAssignedWorkers(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="form-control"
          >
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>

          {/* Input para la descripción de la tarea */}
          <label htmlFor="taskDescription">Descripción de la Tarea:</label>
          <textarea
            id="taskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe la tarea..."
            className="form-control"
          />

          {/* Estado de la tarea */}
          <label htmlFor="taskStatus">Estado de la Tarea:</label>
          <select
            id="taskStatus"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="form-control"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAssignmentModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAssignWorkers}>
            Asignar Trabajadores
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar proyecto */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <label htmlFor="editProjectName">Nombre del Proyecto:</label>
          <input
            type="text"
            id="editProjectName"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            className="form-control"
          />
          <label htmlFor="editProjectPlan">Plan del Proyecto:</label>
          <input
            type="text"
            id="editProjectPlan"
            value={newProjectPlan}
            onChange={(e) => setNewProjectPlan(e.target.value)}
            className="form-control"
          />

          {/* Selección del tipo de contrato */}
          <label htmlFor="editProjectContractType">Tipo de Contrato:</label>
          <select
            id="editProjectContractType"
            value={newProjectContractType}
            onChange={(e) => setNewProjectContractType(e.target.value)}
            className="form-control"
          >
            <option value="Platino">Platino</option>
            <option value="Oro">Oro</option>
            <option value="Diamante">Diamante</option>
          </select>

          {/* Selección de trabajadores */}
          <label htmlFor="editWorkersSelect">Seleccionar Trabajadores:</label>
          <select
            id="editWorkersSelect"
            multiple
            value={assignedWorkers}
            onChange={(e) =>
              setAssignedWorkers(Array.from(e.target.selectedOptions, (option) => option.value))
            }
            className="form-control"
          >
            {workers.map((worker) => (
              <option key={worker.id} value={worker.id}>
                {worker.name}
              </option>
            ))}
          </select>

          {/* Input para la descripción de la tarea */}
          <label htmlFor="editTaskDescription">Descripción de la Tarea:</label>
          <textarea
            id="editTaskDescription"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
            placeholder="Describe la tarea..."
            className="form-control"
          />

          {/* Estado de la tarea */}
          <label htmlFor="editTaskStatus">Estado de la Tarea:</label>
          <select
            id="editTaskStatus"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="form-control"
          >
            <option value="pendiente">Pendiente</option>
            <option value="en progreso">En progreso</option>
            <option value="completada">Completada</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditProject}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para eliminar proyecto */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Proyecto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar el proyecto <strong>{selectedProject?.name}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteProject}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ClientTable;

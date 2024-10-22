import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminProyects.css';

const ClientTable = () => {
  const [projects, setProjects] = useState([]); // Estado para proyectos
  const [workers, setWorkers] = useState([]); // Estado para trabajadores
  const [selectedProject, setSelectedProject] = useState(null); // Proyecto seleccionado
  const [newProjectName, setNewProjectName] = useState(''); // Nombre de nuevo proyecto o para edición
  const [newProjectPlan, setNewProjectPlan] = useState(''); // Plan del proyecto nuevo o para edición
  const [assignedWorkers, setAssignedWorkers] = useState([]); // Trabajadores asignados
  const [taskDescription, setTaskDescription] = useState(''); // Descripción de la tarea
  const [taskStatus, setTaskStatus] = useState('pendiente'); // Estado de la tarea
  const [notification, setNotification] = useState(null); // Notificación de éxito o error
  const [showProjectModal, setShowProjectModal] = useState(false); // Modal para creación de proyecto
  const [showAssignmentModal, setShowAssignmentModal] = useState(false); // Modal para asignar trabajadores
  const [showEditModal, setShowEditModal] = useState(false); // Modal para editar proyecto
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal para eliminar proyecto

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

  // Crear un nuevo proyecto
  const handleCreateProject = async () => {
    if (!newProjectName || !newProjectPlan) {
      setNotification('Por favor, ingresa el nombre y el plan del proyecto.');
      return;
    }

    try {
      const newProject = {
        name: newProjectName,
        plan: newProjectPlan,
      };
      const response = await axios.post('http://localhost:3000/projects', newProject);
      setProjects([...projects, response.data]); // Agregar nuevo proyecto a la lista
      setNewProjectName(''); // Limpiar nombre del proyecto
      setNewProjectPlan(''); // Limpiar plan del proyecto
      setNotification('Proyecto creado con éxito.');
      setTimeout(() => setNotification(null), 3000);
      setShowProjectModal(false); // Cerrar modal de proyecto
    } catch (error) {
      console.error('Error creating project:', error);
      setNotification('Error al crear el proyecto.');
    }
  };

  // Manejar la asignación de trabajadores a un proyecto
  const handleAssignWorkers = async () => {
    if (!selectedProject || assignedWorkers.length === 0 || !taskDescription) {
      setNotification('Por favor, selecciona un proyecto, asigna trabajadores y define la tarea.');
      return;
    }

    try {
      await axios.post(`http://localhost:3000/projects/${selectedProject.id}/assign-workers`, {
        workers: assignedWorkers,
        taskDescription,
        taskStatus,
      });

      setNotification('Trabajadores asignados con éxito.');
      setTimeout(() => setNotification(null), 3000); // Limpiar la notificación después de 3 segundos
      setAssignedWorkers([]); // Limpiar asignaciones
      setTaskDescription(''); // Limpiar descripción
      setTaskStatus('pendiente'); // Resetear estado de tarea
      setShowAssignmentModal(false); // Cerrar modal de asignación
    } catch (error) {
      console.error('Error assigning workers:', error);
      setNotification('Error al asignar trabajadores.');
    }
  };

  // Editar proyecto
  const handleEditProject = async () => {
    if (!newProjectName || !newProjectPlan) {
      setNotification('Por favor, ingresa el nombre y el plan del proyecto.');
      return;
    }

    try {
      const updatedProject = {
        name: newProjectName,
        plan: newProjectPlan,
      };
      await axios.put(`http://localhost:3000/projects/${selectedProject.id}`, updatedProject);

      setProjects(
        projects.map((project) =>
          project.id === selectedProject.id ? { ...project, ...updatedProject } : project
        )
      );
      setNotification('Proyecto actualizado con éxito.');
      setTimeout(() => setNotification(null), 3000);
      setShowEditModal(false); // Cerrar modal de edición
    } catch (error) {
      console.error('Error updating project:', error);
      setNotification('Error al actualizar el proyecto.');
    }
  };

  // Eliminar proyecto
  const handleDeleteProject = async () => {
    try {
      await axios.delete(`http://localhost:3000/projects/${selectedProject.id}`);
      setProjects(projects.filter((project) => project.id !== selectedProject.id)); // Remover proyecto de la lista
      setNotification('Proyecto eliminado con éxito.');
      setTimeout(() => setNotification(null), 3000);
      setShowDeleteModal(false); // Cerrar modal de eliminación
    } catch (error) {
      console.error('Error deleting project:', error);
      setNotification('Error al eliminar el proyecto.');
    }
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
                  .join(', ')}
              </td>
              <td>{project.plan}</td>
              <td>{project.taskDescription || 'Sin tarea asignada'}</td>
              <td>
                <Button
                  variant="warning"
                  onClick={() => {
                    setSelectedProject(project);
                    setNewProjectName(project.name);
                    setNewProjectPlan(project.plan);
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

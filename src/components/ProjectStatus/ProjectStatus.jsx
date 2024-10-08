import React, { useState, useEffect } from 'react';
import './ProjectStatus.css'; 
import { FaCheckCircle, FaRegCircle, FaEdit, FaSave, FaSpinner } from 'react-icons/fa'; 
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css'; 

const ProjectStatus = ({ userRole }) => {
  const isAdmin = userRole === 'admin'; 

  // Datos simulados del proyecto
  const [projectData, setProjectData] = useState({
    projectName: 'Campaña de Marketing Digital',
    milestones: [
      { title: 'Estrategia de contenido', status: 'completed' },
      { title: 'Calendario editorial', status: 'completed' },
      { title: 'Facebook Ads', status: 'in-progress' },
      { title: 'Google Ads', status: 'in-progress' },
      { title: 'Monitoreo', status: 'pending' },
      { title: 'Informe final', status: 'pending' },
    ]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [newProjectName, setNewProjectName] = useState(projectData.projectName);
  const [editedMilestones, setEditedMilestones] = useState([...projectData.milestones]);
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Cálculo de progreso
  const calculateProgress = (milestones) => {
    const completedTasks = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completedTasks / milestones.length) * 100);
  };

  useEffect(() => {
    setProgressPercentage(calculateProgress(editedMilestones));
  }, [editedMilestones]);

  const handleProjectNameChange = (e) => setNewProjectName(e.target.value);

  const handleMilestoneChange = (index, newTitle) => {
    const updatedMilestones = [...editedMilestones];
    updatedMilestones[index].title = newTitle;
    setEditedMilestones(updatedMilestones);
  };

  const handleStatusChange = (index, newStatus) => {
    const updatedMilestones = [...editedMilestones];
    updatedMilestones[index].status = newStatus;
    setEditedMilestones(updatedMilestones);
  };

  const saveChanges = () => {
    setProjectData({
      ...projectData,
      projectName: newProjectName,
      milestones: editedMilestones,
    });
    setIsEditing(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="icon-completed" />;
      case 'in-progress':
        return <FaSpinner className="icon-in-progress" />;
      case 'pending':
      default:
        return <FaRegCircle className="icon-pending" />;
    }
  };

  return (
    <div className="project-status-container">
      <div className="project-header">
        {isEditing ? (
          <input
            type="text"
            value={newProjectName}
            onChange={handleProjectNameChange}
            className="edit-project-name"
          />
        ) : (
          <h2>{projectData.projectName}</h2>
        )}
        {isAdmin && !isEditing && (
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            <FaEdit /> Editar
          </button>
        )}
        {isEditing && (
          <button className="save-button" onClick={saveChanges}>
            <FaSave /> Guardar
          </button>
        )}
      </div>

      {/* Gráfico circular de progreso */}
      <div className="progress-circle">
        <CircularProgressbar
          value={progressPercentage}
          text={`${progressPercentage}%`}
          styles={buildStyles({
            textColor: '#000',
            pathColor: '#4caf50',
            trailColor: '#d6d6d6',
            textSize: '14px'
          })}
        />
      </div>

      {/* Lista de hitos con iconos */}
      <ul className="milestones-list">
        {editedMilestones.map((milestone, index) => (
          <li key={index} className={milestone.status}>
            {isEditing ? (
              <div className="edit-milestone">
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => handleMilestoneChange(index, e.target.value)}
                  className="edit-milestone-input"
                />
                <select
                  value={milestone.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                  className="edit-milestone-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="in-progress">En curso</option>
                  <option value="completed">Completada</option>
                </select>
              </div>
            ) : (
              <div className="milestone-info">
                {getStatusIcon(milestone.status)}
                <span>{milestone.title}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectStatus;

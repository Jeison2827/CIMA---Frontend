// src/context/ProjectContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const ProjectContext = createContext();

const API_BASE_URL = 'http://localhost:3000/developer/projects';

export const ProjectProvider = ({ children }) => {
  // Asegurarnos de obtener el token correctamente del estado de Redux
  const auth = useSelector((state) => state.auth);
  const accessToken = auth?.accessToken;

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectStats, setProjectStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    inProgress: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });

  // Configuración de axios con interceptores
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Interceptor para añadir el token en cada petición
  axiosInstance.interceptors.request.use(
    (config) => {
      // Verificar que el token existe y tiene el formato correcto
      if (accessToken) {
        console.log('Token siendo enviado:', accessToken);
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['accessToken'] = accessToken;
      } else {
        console.warn('No hay token disponible para la petición');
      }
      // Log de la configuración final
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: config.headers
      });
      return config;
    },
    (error) => {
      console.error('Error en interceptor de request:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor para manejar respuestas
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('Respuesta exitosa:', {
        url: response.config.url,
        status: response.status,
        data: response.data
      });
      return response;
    },
    (error) => {
      console.error('Error en la respuesta:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers
      });
      
      if (error.response?.status === 401) {
        showNotification('Error de autenticación. Verificando sesión...', 'error');
      }
      return Promise.reject(error);
    }
  );

  // GET /stats con verificación de token
  const fetchProjectStats = async () => {
    if (!accessToken) {
      console.warn('Intentando obtener stats sin token');
      return;
    }
    try {
      console.log('Obteniendo estadísticas con token:', accessToken);
      const response = await axiosInstance.get('/stats');
      if (response.data.success) {
        setProjectStats(response.data.stats);
      }
    } catch (error) {
      handleError(error, 'Error al obtener estadísticas');
    }
  };

  // GET / con verificación de token
  const fetchProjects = async (filters = {}) => {
    if (!accessToken) {
      console.warn('Intentando obtener proyectos sin token');
      return;
    }
    setLoading(true);
    try {
      console.log('Obteniendo proyectos con token:', accessToken);
      const params = new URLSearchParams(filters);
      const response = await axiosInstance.get(`/?${params}`);
      if (response.data) {
        setProjects(response.data);
        setFilteredProjects(response.data);
      }
    } catch (error) {
      handleError(error, 'Error al cargar los proyectos');
    } finally {
      setLoading(false);
    }
  };

  // Función auxiliar para manejar errores
  const handleError = (error, defaultMessage) => {
    const errorMessage = error.response?.data?.message || defaultMessage;
    console.error(defaultMessage, error);
    setError(errorMessage);
    showNotification(errorMessage, 'error');
  };

  // Efecto para cargar datos iniciales
  useEffect(() => {
    console.log('Estado de autenticación:', { auth, accessToken });
    if (accessToken) {
      console.log('Iniciando carga de datos con token:', accessToken);
      fetchProjects();
      fetchProjectStats();
    }
  }, [accessToken]);

  // Función para filtrar proyectos
  const filterProjects = (filters = {}) => {
    let filtered = [...projects];

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.clientId) {
      filtered = filtered.filter(p => p.clientId === filters.clientId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.projectName.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProjects(filtered);
  };

  // Función para crear proyecto
  const createProject = async (projectData) => {
    try {
      const response = await axiosInstance.post('/project', projectData);
      
      if (response.data.success) {
        const newProject = response.data.project;
        setProjects(prev => [...prev, newProject]);
        setFilteredProjects(prev => [...prev, newProject]);
        showNotification('Proyecto creado exitosamente', 'success');
        await fetchProjectStats();
      }
      return response.data.project;
    } catch (error) {
      handleError(error, 'Error al crear el proyecto');
      throw error;
    }
  };

  // 4. Obtener Proyecto por ID
  const getProjectById = async (id) => {
    try {
      const response = await axiosInstance.get(`/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Error al obtener el proyecto');
      throw error;
    }
  };

  // Función para actualizar proyecto
  const updateProject = async (id, projectData) => {
    try {
      const response = await axiosInstance.put(`/project/${id}`, projectData);
      
      if (response.data.success) {
        setProjects(prev => 
          prev.map(p => p.id === id ? response.data.project : p)
        );
        setFilteredProjects(prev => 
          prev.map(p => p.id === id ? response.data.project : p)
        );
        showNotification('Proyecto actualizado exitosamente', 'success');
        await fetchProjectStats();
      }
      return response.data.project;
    } catch (error) {
      handleError(error, 'Error al actualizar el proyecto');
      throw error;
    }
  };

  // 6. Actualizar Estado
  const updateProjectStatus = async (id, status) => {
    try {
      const response = await axiosInstance.patch(`/${id}/status`, { status });
      if (response.data.success) {
        setProjects(prev => prev.map(p => p.id === id ? response.data.project : p));
        showNotification('Estado actualizado exitosamente', 'success');
        await fetchProjectStats();
      }
      return response.data.project;
    } catch (error) {
      handleError(error, 'Error al actualizar el estado');
      throw error;
    }
  };

  // 7. Eliminar Proyecto
  const deleteProject = async (id) => {
    try {
      await axiosInstance.delete(`/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
      showNotification('Proyecto eliminado exitosamente', 'success');
      await fetchProjectStats();
    } catch (error) {
      handleError(error, 'Error al eliminar el proyecto');
      throw error;
    }
  };

  // 8. Obtener Proyectos por Cliente
  const getProjectsByClient = async (clientId) => {
    try {
      const response = await axiosInstance.get(`/client/${clientId}`);
      return response.data;
    } catch (error) {
      handleError(error, 'Error al obtener proyectos del cliente');
      throw error;
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  // Efecto inicial
  useEffect(() => {
    if (accessToken) {
      console.log('Iniciando carga de datos...');
      fetchProjects();
      fetchProjectStats();
    }
  }, [accessToken]);

  // Efecto para debugging
  useEffect(() => {
    console.log('Estado actual de proyectos:', {
      total: projects.length,
      filtered: filteredProjects.length,
      projects,
      filteredProjects
    });
  }, [projects, filteredProjects]);

  // Valor del contexto
  const contextValue = {
    projects,
    filteredProjects,
    projectStats,
    loading,
    error,
    notification,
    setNotification,
    createProject,
    fetchProjects,
    filterProjects,
    getProjectById,
    updateProject,
    updateProjectStatus,
    deleteProject,
    getProjectsByClient,
    fetchProjectStats
  };

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export default ProjectProvider;

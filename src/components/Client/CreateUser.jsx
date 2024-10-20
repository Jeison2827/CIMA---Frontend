import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createClient } from '../../redux/slices/clientSlice';
import './CreateClient.css'; // Importar los estilos
import { ToastContainer, toast } from 'react-toastify'; // Importa react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Estilos de react-toastify

const CreateClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    email: '',
    password:'',
    role:'Client', // Por defecto seleccionamos 'Client'
    phone: '',
  });

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validación básica
    if (formData.name === '' || formData.email === '') {
      toast.error('El nombre y el email son obligatorios', { position: "top-center" });
      return;
    }
    try{
      dispatch(createClient(formData));
      toast.success('Cliente creado con éxito', { position: "top-center" });
    }
    catch(error){
      toast.error(error, { position: "top-center" });
    }
    
    // Limpiar formulario
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'Client', // Reseteamos el select a 'Client'
    });
  };

  return (
    <div className="create-client-container">
      <ToastContainer />
      <h1>Crear Usuario</h1>
      <form onSubmit={handleSubmit} className="create-client-form">
        <div className="form-group">
          <label htmlFor="name">Nombre <span className="required">*</span></label>
          <input
            type="text"
            id="name"
            placeholder="Nombre del Cliente"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            type="email"
            id="email"
            placeholder="Correo Electronico"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>

        {/* Cambiamos el input por un select para el rol */}
        <div className="form-group">
          <label htmlFor="role">Rol <span className="required">*</span></label>
          <select
            id="role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="Client">Client</option>
            <option value="Admin">Admin</option>
            <option value="Worker">Worker</option>
          </select>
        </div>

        <button type="submit" className="btn-submit">Crear Cliente</button>
      </form>
    </div>
  );
};

export default CreateClient;

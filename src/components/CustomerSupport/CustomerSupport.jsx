import React, { useState } from 'react';
import './CustomerSupport.css'; // Estilos CSS opcionales



const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para enviar el formulario al backend (puedes usar fetch o axios)
    console.log('Ticket enviado:', formData);

    // Limpiar el formulario
    setFormData({
      name: '',
      email: '',
      subject: '',
      description: '',
    });
  };

  return (
    <div className="support-container">
      <h2>Soporte al Cliente</h2>
      <form onSubmit={handleSubmit} className="support-form">
        <div className="form-group">
          <label htmlFor="name">Nombre:</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Asunto:</label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción del problema:</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-submit">Enviar Ticket</button>
      </form>
    </div>
  );
};

export default CustomerSupport;

import React, { useState } from 'react';
import './FaqClient.css'; // Archivo CSS para estilos

const FaqClient = () => {
  // Lista de preguntas frecuentes simulada
  const faqs = [
    {
      id: 1,
      question: '¿Cómo puedo crear un proyecto?',
      answer: 'Para crear un proyecto, debes ir a la sección "Mis Proyectos" y hacer clic en "Crear Nuevo Proyecto".',
    },
    {
      id: 2,
      question: '¿Cómo puedo contactar al soporte?',
      answer: 'Puedes contactar al soporte desde la sección de "Soporte al Cliente" o enviando un correo a soporte@example.com.',
    },
    {
      id: 3,
      question: '¿Cómo puedo actualizar mis datos personales?',
      answer: 'Dirígete a "Mi Perfil" y haz clic en "Editar" para actualizar tus datos personales.',
    },
    {
      id: 4,
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos pagos con tarjeta de crédito, PayPal y transferencias bancarias.',
    },
  ];

  // Estado para controlar qué preguntas están abiertas
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id); // Alterna el estado de la pregunta
  };

  return (
    <div className="faq-client-container">
      <h1>Preguntas Frecuentes</h1>
      <ul className="faq-list">
        {faqs.map((faq) => (
          <li key={faq.id} className="faq-item">
            <h2 onClick={() => toggleFaq(faq.id)} className="faq-question">
              {faq.question}
            </h2>
            {openFaq === faq.id && <p className="faq-answer">{faq.answer}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaqClient;

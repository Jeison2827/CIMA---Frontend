import React, { useState } from 'react';
import './FaqAdmin.css'; // Archivo CSS para estilos

const FaqAdmin = () => {
  // Lista de preguntas frecuentes (simulada)
  const [faqs, setFaqs] = useState([
    { id: 1, question: '¿Cómo puedo crear un proyecto?', answer: 'Para crear un proyecto, ve a la sección "Mis Proyectos" y haz clic en "Crear Nuevo Proyecto".' },
    { id: 2, question: '¿Cómo puedo contactar al soporte?', answer: 'Puedes contactar al soporte desde la sección de "Soporte al Cliente" o enviando un correo a soporte@example.com.' },
  ]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editFaq, setEditFaq] = useState(null); // Para controlar qué FAQ está en edición
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  // Agregar una nueva pregunta frecuente
  const handleAddFaq = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newFaq = {
        id: faqs.length + 1,
        question: newQuestion,
        answer: newAnswer,
      };
      setFaqs([...faqs, newFaq]);
      setNewQuestion('');
      setNewAnswer('');
    }
  };

  // Eliminar una pregunta frecuente
  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  // Iniciar la edición de una pregunta frecuente
  const handleEditFaq = (faq) => {
    setEditFaq(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  // Guardar los cambios de una pregunta frecuente editada
  const handleSaveFaq = (id) => {
    setFaqs(faqs.map(faq => (faq.id === id ? { ...faq, question: editQuestion, answer: editAnswer } : faq)));
    setEditFaq(null); // Finalizar edición
    setEditQuestion('');
    setEditAnswer('');
  };

  return (
    <div className="faq-admin-container">
      <h1>Administrar Preguntas Frecuentes</h1>

      {/* Formulario para agregar nuevas FAQs */}
      <div className="faq-add-container">
        <h2>Agregar nueva pregunta</h2>
        <input
          type="text"
          placeholder="Pregunta"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
        />
        <textarea
          placeholder="Respuesta"
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
        />
        <button onClick={handleAddFaq}>Agregar</button>
      </div>

      {/* Lista de FAQs existentes */}
      <ul className="faq-list">
        {faqs.map(faq => (
          <li key={faq.id} className="faq-item">
            {editFaq === faq.id ? (
              // Modo edición
              <div className="faq-edit-container">
                <input
                  type="text"
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                />
                <textarea
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                />
                <button onClick={() => handleSaveFaq(faq.id)}>Guardar</button>
              </div>
            ) : (
              // Vista normal
              <div className="faq-view-container">
                <h2>{faq.question}</h2>
                <p>{faq.answer}</p>
                <button onClick={() => handleEditFaq(faq)}>Editar</button>
                <button onClick={() => handleDeleteFaq(faq.id)}>Eliminar</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FaqAdmin;

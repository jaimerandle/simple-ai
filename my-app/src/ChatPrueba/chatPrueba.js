import React, { useState, useEffect } from 'react';
import './chatPrueba.css';
import Navbar from '../Home/Navbar';
import SimpleAiWhite from "../assets/SimpleAiWhite.png"
import SimpleAi from "../assets/simpleLogo.webp"
import { useMediaQuery } from '@mui/material';

function ChatPrueba() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [assistantInput, setAssistantInput] = useState(''); // Input para el asistente de OpenAI
  const [isTyping, setIsTyping] = useState(false); // Nuevo estado para el estado de "Nicole está escribiendo"
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('URL_RECIBIR_MENSAJES');
      const data = await response.json();
      setMessages(data);
    };

    fetchMessages();
  }, []);

  // Función para manejar el envío al presionar Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir el comportamiento por defecto de "Enter" en formularios
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const eventId = String(Date.now()) + Math.floor(Math.random() * 999999);

      const newMessage = {
        id: eventId,
        clientId: 1,
        channelId: 14,
        source: '12345',
        target: 'demo',
        text: input,
      };

      // Actualiza mensajes con el nuevo mensaje del cliente
      setMessages(prevMessages => [...prevMessages, { user: 'CLIENTE', text: input, timestamp: new Date() }]);

      try {
        await fetch('https://bcyn2bhdqok5d3ivfomkhqygf40jvnex.lambda-url.us-east-1.on.aws/6/asdasd123', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });

        setInput('');

        // Mostrar "Nicole está escribiendo..."
        setIsTyping(true);

        setTimeout(() => startPolling(eventId), 10000);
      } catch (error) {
        console.error('Error enviando el mensaje:', error);
      }
    }
  };

  const startPolling = async (eventId) => {
    const pollingUrl = `https://p25wnfnld3cmko5bnstky43e5m0chfzy.lambda-url.us-east-1.on.aws/${eventId}`;

    try {
      const response = await fetch(pollingUrl);
      const result = await response.json();

      if (result.action === 'SKIP') {
        console.log('Mensaje combinado con otro, no se muestra.');
      } else if (result.action === 'WAIT') {
        setTimeout(() => startPolling(eventId), 2000);
      } else if (result.action === 'REPLY') {
        // Actualiza mensajes con la respuesta de Nicole
        setMessages(prevMessages => [...prevMessages, { user: 'NICOLE', text: result.text, timestamp: new Date() }]);
        setIsTyping(false); // Deja de mostrar "Nicole está escribiendo..." cuando llega la respuesta
      }

    } catch (error) {
      console.error('Error durante el polling:', error);
    }
  };

  const sendToAssistant = async () => {
    if (assistantInput.trim() !== '') {
      const response = await fetch('URL_OPENAI_ASSISTANT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: assistantInput }),
      });

      const data = await response.json();
      setMessages(prevMessages => [...prevMessages, { user: 'NICOLE', text: data.response, timestamp: new Date() }]);
      setAssistantInput('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="playground-container">
        <div className="header-container">
          <h1>¡Bienvenido a tu prueba, Juan!</h1>
          <p>Desde acá vas a poder modificar tu asistente y simular una conversación Cliente-Asistente</p>
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', maxHeight: "80%", minHeight: "80%" }}>
          <div className="assistant-box" style={{ marginLeft: isMobile ? "0%" : "2%" }}>
            <textarea
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              placeholder="Interactúa con el asistente de Simple-Ai. Ejemplo: sos muy carismática, hablas coloquial."
            />
            <button onClick={sendToAssistant}>Enviar al Asistente{' '}<img src={SimpleAiWhite} style={{ height: "25px" }} /> <img style={{ height: "20px" }} src={SimpleAi} /> </button>
          </div>
          <div className="chat-box">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.user === 'CLIENTE' ? 'own-message' : 'nicole-message'}`} // Cambiar la clase si es mensaje de Nicole
                >
                  <strong>{message.user === 'CLIENTE' ? 'CLIENTE' : 'NICOLE'}</strong>
                  <span>{message.text}</span>
                </div>
              ))}
              {/* Mostrar "Nicole está escribiendo..." cuando esté haciendo el polling */}
              {isTyping && (
                <div className="nicole-typing">
                  <span>Nicole está escribiendo...</span>
                </div>
              )}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress} // Añadir este listener para manejar "Enter"
                placeholder="Escribe un mensaje..."
                style={{ width: isMobile ? "50%" : "60%" }}
              />
              <button onClick={sendMessage} style={{ width: isMobile ? "40%" : "30%" }}>Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatPrueba;

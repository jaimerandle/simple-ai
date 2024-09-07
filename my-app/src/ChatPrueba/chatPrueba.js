import React, { useState, useEffect } from 'react';
import './chatPrueba.css';
import Navbar from '../Home/Navbar';
import { Box, Button, useMediaQuery } from '@mui/material';
import Listado from "../assets/description.png";
import { useNavigate } from 'react-router-dom';
import { getAssistants, getUserInfo, updateAssistant } from '../services/bffService';
import Loading from '../components/Loading';

function ChatPrueba() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); // Estado para "Nicole está escribiendo"
  const [extraPrompt, setExtraPrompt] = useState(''); // Estado para el extraPrompt del asistente
  const [assistantInput, setAssistantInput] = useState(''); // Estado para el input que permite modificar el extraPrompt
  const [demoChannelId, setDemoChannelId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [assistantId, setAssistantId] = useState(null);
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [dates, setDates] = useState("")

  useEffect(() => {
    const fetchAssistantData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/'); // Redirigir si no hay token
        return;
      }

      try {
        // Obtener los asistentes y el primer extraPrompt
        const assistants = await getAssistants(token);
        setDates(assistants[0].last_updated)
        const firstAssistant = assistants[0]; // Tomar el primer asistente
        const prompt = firstAssistant.config.extraPrompt || ''; // Si no hay extraPrompt, usar string vacío
        setExtraPrompt(prompt); // Guarda el extraPrompt
        setAssistantId(firstAssistant.id); // Guarda el ID del asistente
        setAssistantInput(prompt); // Asigna el extraPrompt al textarea

        // Obtener el demoChannelId del cliente
        const clientInfo = await getUserInfo(token);
        setDemoChannelId(clientInfo?.clientInfo.details?.demoChannelId); // Guarda el demoChannelId

        setLoading(false); // Deja de cargar una vez que tienes los datos
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchAssistantData();
  }, [navigate]);

  // Función para manejar el envío al presionar Enter en el chat
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevenir el comportamiento por defecto de "Enter" en formularios
      sendMessage();
    }
  };
  console.log(demoChannelId, "demochannel")

  // Función para enviar mensajes en el chat
  const sendMessage = async () => {
    if (input.trim() !== '') {
      const eventId = String(Date.now()) + Math.floor(Math.random() * 999999);

      const newMessage = {
        id: eventId,
        clientId: 1,
        channelId: demoChannelId,
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
        setTimeout(() => startPolling(eventId), 5000);
      } else if (result.action === 'REPLY') {
        // Actualiza mensajes con la respuesta de Nicole
        setMessages(prevMessages => [...prevMessages, { user: 'NICOLE', text: result.text, timestamp: new Date() }]);
        setIsTyping(false); // Deja de mostrar "Nicole está escribiendo..." cuando llega la respuesta
      }

    } catch (error) {
      console.error('Error durante el polling:', error);
    }
  };

  // Función para enviar la configuración al asistente (actualización del extraPrompt)
  const sendToAssistant = async () => {
    setLoading(true)
    if (assistantInput.trim() !== '') {
        const token = localStorage.getItem('authToken');

        try {
            // Obtener el asistente actual
            const assistants = await getAssistants(token);
            const firstAssistant = assistants[0]; // Tomar el primer asistente
            setDates(firstAssistant.last_updated)

            // Actualizar solo el campo extraPrompt en la config, pero enviamos el asistente completo
            const updatedAssistant = {
                ...firstAssistant, // Copiamos todo el asistente
                config: {
                    ...firstAssistant.config, // Copiamos toda la config existente
                    extraPrompt: assistantInput, // Sobrescribimos solo el extraPrompt
                },
            };

            // Realizar el PUT a /assistants/ID para actualizar el asistente completo
            await updateAssistant(firstAssistant.id, updatedAssistant, token);
            console.log(firstAssistant, "actualizada")

            // Actualizar el extraPrompt en el estado y mostrar en el input
            setExtraPrompt(assistantInput);


        } catch (error) {
            console.error('Error actualizando el asistente:', error);
        }
        setLoading(false)
    }
};

const date = new Date(dates)


// Convertir la fecha a zona horaria de Argentina (ART - UTC-3)
const options = {
  timeZone: 'America/Argentina/Buenos_Aires', 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit', 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit'
};

// Obtener la fecha formateada
const argentinaTime = date.toLocaleString('es-AR', options);

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <Navbar />
      {loading ?(
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Loading /> 
      </Box>
       ) : (
      <div className="playground-container">
        <div className="header-container">
          <h1 style={{ fontSize: "30px", color: "grey", marginTop: "10px" }}>Configuración asistente</h1>
          <Button style={{ display: "flex", width: "20%", border: "1px solid grey", height: "50px" }} onClick={() => { navigate("/home") }}>
            <img src={Listado} alt="" style={{ height: "20px" }} />
            {!isMobile && <p style={{ color: "grey", marginTop: "20px", marginLeft: "5px", fontSize: "15px" }}>Volver al dashboard</p>}
          </Button>
        </div>
        <div style={{ border: "0.5px solid #9747FF", marginBottom: "0px", width: "90%" }}></div>
        <div style={{ width: "90%", marginTop: "10px" }}>
          <p style={{ textAlign: "left", color: "grey" }}>Desde acá vas a poder modificar tu asistente y simular una conversación Cliente - Asistente.</p>
          <p style={{ textAlign: "left", color: "grey" }}>{`Ultima actualizacion del prompt: ${argentinaTime}`}</p>
          
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', maxHeight: "70%", minHeight: "450px", overflow: "auto" }}>
          <div className="assistant-box" style={{ marginLeft: isMobile ? "0%" : "2%" }}>
            <textarea
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              placeholder={extraPrompt && assistantInput ? '' : "Interactúa con el asistente de Simple-Ai. Ejemplo: sos muy carismática, hablas coloquial."}
            />
            <button onClick={sendToAssistant} style={{ fontWeight: "bold", marginBottom: "5px" }}>ENVIAR A ASISTENTE SIMPLE AI</button>
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
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Manejar "Enter" para enviar mensaje
                placeholder="Escribe un mensaje..."
                style={{ width: isMobile ? "50%" : "60%" }}
              />
              <button onClick={sendMessage} style={{ width: isMobile ? "40%" : "30%", fontWeight: "bold" }}>ENVIAR</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
); 
}

export default ChatPrueba;

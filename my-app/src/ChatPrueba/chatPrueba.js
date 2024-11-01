import React, { useState, useEffect, useRef } from 'react';
import './chatPrueba.css';
import Navbar from '../Home/Navbar';
import { Box, Button, useMediaQuery } from '@mui/material';
import Listado from "../assets/description.png";
import { useNavigate } from 'react-router-dom';
import { getAssistants, getUserInfo, updateAssistant } from '../services/bffService';
import Loading from '../components/Loading';
import { formatText } from '../utils/FormatText';

function ChatPrueba() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false); 
  const [extraPrompt, setExtraPrompt] = useState('');
  const [assistantInput, setAssistantInput] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [demoChannelId, setDemoChannelId] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [assistantId, setAssistantId] = useState(null);
  const [clientId, setClientId]= useState(null);
  const [source, setSource]= useState('');
  const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const [dates, setDates] = useState('');

  const messagesEndRef = useRef(null);

  const generateConversationId = () => {
    return String(Date.now()) + Math.floor(Math.random() * 999999);
  };

  useEffect(() => {
    setSource(generateConversationId()); 
  }, []);

  const startNewConversation = () => {
    setSource(generateConversationId());
    setMessages([]); 
    setIsTyping(false); 
  };

  useEffect(() => {
    const fetchAssistantData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/');
        return;
      }

      try {
        const assistants = await getAssistants(token);
        setDates(assistants[0].last_updated);
        const firstAssistant = assistants[0]; 
        const prompt = firstAssistant.config.extraPrompt || ''; 
        setExtraPrompt(prompt); 
        setAssistantId(firstAssistant.id);
        setAssistantName(firstAssistant.name);
        setAssistantInput(prompt);

        const clientInfo = await getUserInfo(token);
        setDemoChannelId(clientInfo?.clientInfo.details?.demoChannelId);
        setClientId(clientInfo.client_id);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };

    fetchAssistantData();
  }, [navigate]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom(); 
  }, [messages , isTyping]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() !== '') {
      const eventId = String(Date.now()) + Math.floor(Math.random() * 999999);

      const newMessage = {
        id: eventId,
        clientId: clientId,
        channelId: demoChannelId,
        source: source,
        target: 'demo',
        text: input,
      };

      setMessages(prevMessages => [...prevMessages, { user: 'CLIENTE', text: input, timestamp: new Date() }]);

      try {
        await fetch('https://7slvz4c3sadkqahhvs2v6mvvua0arqfj.lambda-url.us-east-1.on.aws/6/asdasd123', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });

        setInput('');

        setIsTyping(true);

        setTimeout(() => startPolling(eventId), 10000);
      } catch (error) {
        console.error('Error enviando el mensaje:', error);
      }
    }
  };

  const startPolling = async (eventId) => {
    const pollingUrl = `https://ye7vfne74zvjc3twxc2h2mtkqq0ezayn.lambda-url.us-east-1.on.aws/${eventId}`;
  
    try {
      const response = await fetch(pollingUrl);
      const result = await response.json();
  
      if (result.action === 'SKIP') {
        console.log('Mensaje combinado con otro, no se muestra.');
      } else if (result.action === 'WAIT') {
        setTimeout(() => startPolling(eventId), 2000);
      } else if (result.action === 'REPLY') {
        const replyMessages = result?.text
          ? [{ type: 'textWap', body: result.text}]
          : result.messages || [];
  
        replyMessages.forEach((replyMessage) => {
          let formattedMessage;
  
          if (replyMessage.type === 'textWap') {
            {formattedMessage = replyMessage.text.body}}
            if (replyMessage.type === 'text'){
            formattedMessage = `<p>${replyMessage.text.body}</p>`;
          } else if (replyMessage.type === 'image') {
            formattedMessage = `
     <div>
       <img src="${replyMessage.image.link}" alt="${replyMessage.image.caption || 'Imagen'}">
       ${replyMessage.image.caption ? `<p style={{fontWeight: bold}}>${replyMessage.image.caption}</p>` : ''}
     </div>
           `;
          } else if (replyMessage.type === 'document') {
            formattedMessage = `<a href="${replyMessage.document.url}" target="_blank">${replyMessage.document.caption || 'Documento'}</a>`;
          }
  
          setMessages((prevMessages) => [
            ...prevMessages,
            { user: 'NICOLE', text: formattedMessage, timestamp: new Date() },
          ]);
        });
  
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error durante el polling:', error);
    }
  };
  

  const sendToAssistant = async () => {
    setLoading(true);
    if (assistantInput.trim() !== '') {
      const token = localStorage.getItem('authToken');

      try {
        const assistants = await getAssistants(token);
        const firstAssistant = assistants[0]; 
        setDates(firstAssistant.last_updated);

        const updatedAssistant = {
          ...firstAssistant, 
          config: {
            ...firstAssistant.config, 
            extraPrompt: assistantInput, 
          },
        };

        await updateAssistant(firstAssistant.id, updatedAssistant, token);
        setExtraPrompt(assistantInput);

      } catch (error) {
        console.error('Error actualizando el asistente:', error);
      }
      setLoading(false);
    }
  };

  const date = new Date(dates);
  const options = {
    timeZone: 'America/Argentina/Buenos_Aires', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit'
  };
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
          <Button variant="outlined" onClick={startNewConversation} style={{backgroundColor:"#C896FC", color:"white", border:'0px solid', fontWeight:"bold", marginBottom :"10px"}}>
            Nueva conversación
          </Button>
        </div>
        <div style={{ display: "flex", width: "100%", justifyContent: 'space-between', maxHeight: "70%", minHeight: "450px", overflow: "auto"}}>
          <div className="assistant-box" style={{ marginLeft: isMobile ? "0%" : "2%" }}>
            <textarea
              value={assistantInput}
              onChange={(e) => setAssistantInput(e.target.value)}
              placeholder={extraPrompt && assistantInput ? '' : "Agrega instrucciones adicionales para el asistente"}
            />
            <button onClick={sendToAssistant} style={{ fontWeight: "bold", marginTop: "5px" }}>ENVIAR A ASISTENTE SIMPLE AI</button>
          </div>
          <div className="chat-box">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${message.user === 'CLIENTE' ? 'own-message' : 'nicole-message'}`} // Cambiar la clase si es mensaje de Nicole
                >
                  <strong>{message.user === 'CLIENTE' ? 'Cliente' : assistantName}</strong>
                  <span>{ <div dangerouslySetInnerHTML={{ __html: formatText(message.text)}} />}</span>
                </div>
              ))}
              {isTyping && (
                <div className="nicole-typing">
                  <span>{assistantName} está escribiendo...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()} // Manejar "Enter" para enviar mensaje
                placeholder="Escribe un mensaje..."
                style={{ width: isMobile ? "50%" : "60%" ,  backgroundColor: "#E0E2E9", borderRadius:0, display:"flex",justifyContent:"flex-end" }}
              />
              <button onClick={sendMessage} style={{ width: isMobile ? "40%" : "20%", fontWeight: "bold" }}>ENVIAR</button>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
); 
}

export default ChatPrueba;
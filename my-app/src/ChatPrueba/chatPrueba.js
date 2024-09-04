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
    const isMobile = useMediaQuery('(max-width:600px)');
    useEffect(() => {
      const fetchMessages = async () => {
        const response = await fetch('URL_RECIBIR_MENSAJES');
        const data = await response.json();
        setMessages(data);
      };
  
      fetchMessages();
    }, []);
  
    const sendMessage = async () => {
      if (input.trim() !== '') {
        const newMessage = {
          user: 'CLIENTE',
          text: input,
          timestamp: new Date(),
        };
  
        setMessages([...messages, newMessage]);
  
        await fetch('URL_ENVIAR_MENSAJES', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMessage),
        });
  
        setInput('');
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
        setMessages([...messages, { user: 'NICOLE', text: data.response, timestamp: new Date() }]);
        setAssistantInput('');
      }
    };
  
    return (
        <>
        <Navbar/>
      <div className="playground-container">
        <div className="header-container">
          <h1>¡Bienvenido a tu prueba, Juan!</h1>
          <p>Desde acá vas a poder modificar tu asistente y simular una conversación Cliente-Asistente</p>
        </div>
        <div style={{display:"flex", width:"100%",justifyContent: 'space-between', maxHeight:"80%", minHeight:"80%"}}>
        <div className="assistant-box" style={{marginLeft: isMobile? "0%":"2%"}}>
          <textarea
            value={assistantInput}
            onChange={(e) => setAssistantInput(e.target.value)}
            placeholder="Interactúa con el asistente de Simple-Ai.
             Ejemplo: sos muy carismatica, hablas coloquial."
          />
          <button onClick={sendToAssistant}>Enviar al Asistente{' '}<img src={SimpleAiWhite}style={{height:"25px"}}/> <img style={{height:"20px"}} src={SimpleAi}/> </button>
        </div>
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.user === 'CLIENTE' ? 'own-message' : ''}`}>
                <strong>{message.user === 'CLIENTE' ? 'CLIENTE' : 'NICOLE'}</strong>
                <span>{message.text}</span>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe un mensaje..."
              style={{width:isMobile? "50%":"60%"}}
            />
            <button  onClick={sendMessage} style={{width: isMobile? "40%":"30%"}}>Enviar </button>
          </div>
        </div>
        </div>
      </div>
      </>
    );
  }
  

export default ChatPrueba;

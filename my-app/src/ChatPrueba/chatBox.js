import React from 'react';
import "./chatPrueba.css";
import { useMediaQuery } from '@mui/material';

function ChatBox({ messages, input, setInput, onSend, isTyping, assistantName, messagesEndRef}) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-box" style={{width:"100%",height:isMobile?"90%":"100%"}}>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.user === 'CLIENTE' ? 'own-message' : 'nicole-message'}`}>
            <strong>{message.user === 'CLIENTE' ? 'Cliente' : assistantName}</strong>
            <span dangerouslySetInnerHTML={{ __html: message.text }}  ref={messagesEndRef}/>
          </div>
        ))}
        {isTyping && (
          <div className="nicole-typing">
            <span>{assistantName} está escribiendo...</span>
          </div>
        )}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe un mensaje..."
        />
        <button style={{fontWeight:"bold", backgroundColor:"rgb(67, 10, 98)"}} onClick={onSend}>ENVIAR</button>

      </div>
    </div>
  );
}

export default ChatBox;

// MessageList.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatBubble from '../components/ChatBubble';
import AvatarWrapper from '../components/AvatarWrapper';

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const MessageList = ({ conversation }) => {
    let currentDate = '';  // Ahora es una variable simple
  
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: 'black', border: "1px solid white", borderRadius: "20px", }}>
        {conversation.messages && conversation.messages.length > 0 ? (
          conversation.messages.map((mensaje, index) => {
            const messageDate = formatDate(mensaje.timestamp);
            const isNewDay = messageDate !== currentDate;
            currentDate = messageDate;  // Actualiza currentDate para el siguiente mensaje
            console.log(conversation.channel_type,"jaimeeee")
            return (
              <React.Fragment key={index}>
                {isNewDay && (
                  <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
                    <Typography variant="caption" color="#b0b0b0">{messageDate}</Typography>
                  </Box>
                )}
                <Box display="flex" alignItems="center" justifyContent={mensaje.from === 'user' ? 'flex-start' : 'flex-end'}>
                  <AvatarWrapper de={mensaje.from} />
                  <ChatBubble de={mensaje.from} canal={conversation.channel_type} horaFecha={formatTime(mensaje.timestamp)}>
                    {mensaje.text}
                    <Typography variant="body2" color="white" sx={{ 
                        marginTop: 5, 
                        fontSize: '0.55rem', 
                        textAlign: 'left',
                        bottom: 0,
                        display:"flex",
                        left: 10 ,
                        "min-width": "fit-content",
                        "align-self": "self-end"
                      }}>
                      {formatTime(mensaje.timestamp)}
                    </Typography>
                  </ChatBubble>
                </Box>
              </React.Fragment>
            );
          })
        ) : (
          <Typography>No hay mensajes en esta conversación.</Typography>
        )}
      </Box>
    );
  };
  
  export default MessageList;
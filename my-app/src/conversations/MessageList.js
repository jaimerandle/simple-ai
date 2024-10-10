// MessageList.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatBubble from '../components/ChatBubble';
import AvatarWrapper from '../components/AvatarWrapper';
import { useMediaQuery } from '@mui/material';
import { formatText } from '../utils/FormatText';
import { useEffect , useRef} from 'react';


const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
  };
  
  const MessageList = ({ conversation, isManual }) => {
    let currentDate = '';  // Ahora es una variable simple
    const isMobile = useMediaQuery('(max-width:600px)');
    const messagesEndRef = useRef(null); // Ref para el final de la lista de mensajes

  // Función para hacer scroll al final
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hacer scroll al final cada vez que cambian los mensajes
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);
  
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: '#EEE5FA', border: "0.5px solid grey", marginTop:"-30px", width: isMobile? "100%":"70%", overflow:"auto", height:"75vh" }}>
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((mensaje, index) => {
              const messageDate = formatDate(mensaje.timestamp);
              const isNewDay = messageDate !== currentDate;
              currentDate = messageDate;
    
              return (
                <React.Fragment key={index}>
                  {isNewDay && (
                    <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
                      <Typography variant="caption" color="#969AB8">{messageDate}</Typography>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent={mensaje.from === 'user' ? 'flex-start' : 'flex-end'}
                   
                  >
                    {mensaje.from === 'user' ? (
                      <>
                        <AvatarWrapper de={mensaje.from} />
                        <ChatBubble
                          de={mensaje.from}
                          canal={conversation.channel_type}
                          horaFecha={formatTime(mensaje.timestamp)}
                          style={{
                            color: "grey",
                            fontSize: "13px",
                            boxShadow: "1px 1px 10px 1px grey",
                            borderRadius: "20px",
                            maxWidth: '70%',
                          }}
                        >
                          {<div dangerouslySetInnerHTML={{ __html: formatText(mensaje.text)}} />}
                          <Typography
                            variant="body2"
                            color="#969AB8"
                            sx={{
                              marginTop: 5,
                              fontSize: '0.55rem',
                              textAlign: 'left',
                              bottom: 0,
                              display: "flex",
                              left: 10,
                              minWidth: "fit-content",
                              alignSelf: "self-end",
                            }}
                          >
                            {formatTime(mensaje.timestamp)}
                          </Typography>
                        </ChatBubble>
                      </>
                    ) : (
                      <>
                        <ChatBubble
                          de={mensaje.from}
                          canal={conversation.channel_type}
                          horaFecha={formatTime(mensaje.timestamp)}
                          style={{
                            color: "grey",
                            fontSize: "13px",
                            boxShadow: "1px 1px 10px 1px grey",
                            borderRadius: "20px",
                            maxWidth: '70%',
                            backgroundColor: '#E6FFEA', 
                            // Fondo verde claro para diferenciar el mensaje de Nicole
                          }}
                        >
                         { <div dangerouslySetInnerHTML={{ __html: formatText( mensaje.text)}} />}
                          <Typography
                            variant="body2"
                            color="#969AB8"
                            sx={{
                              marginTop: 5,
                              fontSize: '0.55rem',
                              textAlign: 'right', // Texto alineado a la derecha para los mensajes de Nicole
                              bottom: 0,
                              display: "flex",
                              left: 10,
                              minWidth: "fit-content",
                              alignSelf: "self-end",
                            }}
                          >
                            {formatTime(mensaje.timestamp)}
                          </Typography>
                        </ChatBubble>
                        <AvatarWrapper de={mensaje.from} />
                      </>
                    )}
                     <div ref={messagesEndRef} />
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
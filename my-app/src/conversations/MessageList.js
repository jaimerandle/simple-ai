import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ChatBubble from '../components/ChatBubble';
import AvatarWrapper from '../components/AvatarWrapper';
import { useMediaQuery } from '@mui/material';
import { formatText } from '../utils/FormatText';


const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};


const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const MessageList = ({ conversation, isManual }) => {
  let currentDate = ''; 
  const isMobile = useMediaQuery('(max-width:750px)');
  const messagesEndRef = useRef(null); 

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: '#EEE5FA', border: "0.5px solid grey", marginTop:"-30px", width: isMobile? "100%":"70%", overflow:isMobile?"" : "auto", height:isMobile?"max-content":'70vh', position:isMobile? "relative" : ""}}>
      {conversation.messages && conversation.messages.length > 0 ? (
        conversation.messages.map((mensaje, index) => {
          const messageDate = formatDate(mensaje.timestamp);
          const isNewDay = messageDate !== currentDate;
          currentDate = messageDate;
          console.log(mensaje.text , "texto")

          return (
            <React.Fragment key={index} >
              {isNewDay && (
                <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }} style={{position: isMobile?? "fixed"}}>
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
                        display:"block"
                      }}
                    >
                      {/* Renderizado según el tipo de mensaje */}
                      {mensaje.text && (
                        <div style={{marginTop:"10px", fontSize:"14px"}} dangerouslySetInnerHTML={{ __html: formatText(mensaje.text|| '') }} />
                      )}
                      {mensaje.image && (
                        <div style={{display:"grid"}}>
                          <div>
                          <img src={mensaje.image?.link} alt={<div dangerouslySetInnerHTML={{ __html: formatText(mensaje.image.caption || '') }}/>} style={{ maxWidth: '100%'}} />
                          </div>
                          {mensaje.image?.caption && <Typography variant="caption">{<div dangerouslySetInnerHTML={{ __html: formatText(mensaje.image.caption || '') }}/>}</Typography>}
                        </div>
                      )}
                      {mensaje.document && (
                        <div>
                          <a href={mensaje.document?.link} target="_blank" rel="noopener noreferrer">
                            {mensaje.document?.caption || 'Documento'}
                          </a>
                        </div>
                      )}
                      <Typography
                        variant="body2"
                        color="#969AB8"
                        sx={{
                          marginTop: 1,
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
                        display:"block"
                      }}
                    >
                      {/* Renderizado según el tipo de mensaje */}
                      {mensaje.text && (
                        <div  style={{marginTop:"10px", fontSize:"14px !important"}} dangerouslySetInnerHTML={{ __html: formatText(mensaje.text|| '') }} />
                      )}
                      {mensaje.image && (
                        <div style={{display:"grid"}}>
                          <div style={{'display': 'flex', 'width': '100%', 'justify-items': 'center', 'justify-content': 'center', marginBottom:"10px", marginTop:"10px"}}>
                          <img src={mensaje.image?.link} alt={mensaje.image?.caption || 'Imagen'} style={{ maxWidth: '60%'}} />
                          </div>
                          {mensaje.image?.caption && <Typography variant="caption">{<div dangerouslySetInnerHTML={{ __html: formatText(mensaje.image.caption || '') }}/>}</Typography>}
                        </div>
                      )}
                      {mensaje.document && (
                        <div>
                          <a href={mensaje.document?.link} target="_blank" rel="noopener noreferrer">
                            {mensaje.document?.caption || 'Documento'}
                          </a>
                        </div>
                      )}
                      <Typography
                        variant="body2"
                        color="#969AB8"
                        sx={{
                          marginTop: 1,
                          fontSize: '0.55rem',
                          textAlign: 'right',
                          bottom: 0,
                          display: "block",
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

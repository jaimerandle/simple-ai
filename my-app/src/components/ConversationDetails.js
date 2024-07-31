// src/components/ConversationDetails.js

import React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WhatsAppLogo from '../assets/WhatsAppLogo.svg';
import InstagramLogo from '../assets/Instagram.svg';
import MercadoLibreLogo from '../assets/mercadolibre.svg';
import conversations from '../data/conversations';
import ChatBubble from './ChatBubble';
import AvatarWrapper from './AvatarWrapper';
import ConversationContainer from './ConversationContainer';
import MercadoLibreMessage from './MercadoLibreMessage';
import CanalLogo from './CanalLogo';
import Navbar from '../Home/Navbar';

const ConversationDetails = () => {
  const { id } = useParams();
  const conversation = conversations[id];

  if (!conversation) {
    return <Typography>No se encontró la conversación.</Typography>;
  }

  let logoSrc;
  switch (conversation.canal) {
    case 'WhatsApp':
      logoSrc = WhatsAppLogo;
      break;
    case 'Instagram':
      logoSrc = InstagramLogo;
      break;
    case 'Mercado Libre':
      logoSrc = MercadoLibreLogo;
      break;
    default:
      logoSrc = '';
  }

  return (
    <>
        <Navbar/>
    <ConversationContainer canal={conversation.canal}>
      <Box sx={{ padding: 2, position: 'relative' }}>
        <Typography variant="h4" gutterBottom>Detalles de la Conversación</Typography>
        <Typography variant="body1"><strong>Canal:</strong> {conversation.canal}</Typography>
        <Typography variant="body1"><strong>Fecha:</strong> {conversation.fecha}</Typography>
        <Typography variant="body1"><strong>Hora:</strong> {conversation.hora}</Typography>
        <CanalLogo src={logoSrc} alt={`${conversation.canal} logo`} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: 'white',border:"1px solid black", borderRadius:"20px" }}>
        {conversation.mensajes.map((mensaje, index) => (
          conversation.canal === 'Mercado Libre' ? (
            <MercadoLibreMessage key={index} de={mensaje.de}>
              <Typography variant="body1" component="div">{mensaje.mensaje}</Typography>
              <Typography variant="body2" color="textSecondary">{mensaje.fecha}</Typography>
            </MercadoLibreMessage>
          ) : (
            <Box key={index} display="flex" alignItems="center" justifyContent={mensaje.de === 'cliente' ? 'flex-start' : 'flex-end'}>
              <AvatarWrapper de={mensaje.de} src={mensaje.avatar} />
              <ChatBubble de={mensaje.de} canal={conversation.canal}>
                {mensaje.mensaje}
              </ChatBubble>
            </Box>
          )
        ))}
      </Box>
    </ConversationContainer>
    </>
  );
};

export default ConversationDetails;

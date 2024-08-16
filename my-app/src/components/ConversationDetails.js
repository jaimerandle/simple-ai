import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WhatsAppLogo from '../assets/WhatsAppLogo.svg';
import InstagramLogo from '../assets/Instagram.svg';
import MercadoLibreLogo from '../assets/mercadolibre.svg';
import { getConversationDetails } from '../services/bffService';
import ChatBubble from './ChatBubble';
import AvatarWrapper from './AvatarWrapper';
import ConversationContainer from './ConversationContainer';
import MercadoLibreMessage from './MercadoLibreMessage';
import CanalLogo from './CanalLogo';
import Navbar from '../Home/Navbar';
import { CircularProgress } from '@mui/material';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const ConversationDetails = () => {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchConversationDetails = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/');
    } else {
      if (token) {
        try {
          const conversationDetails = await getConversationDetails(id, token);
          setConversation(conversationDetails);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setError('No auth token found');
        setLoading(false);
      }
    };
  }

    fetchConversationDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  if (!conversation) {
    return <Typography>No se encontró la conversación.</Typography>;
  }

  let logoSrc;
  let canal;
  switch (conversation.channel_type) {
    case 3:
      logoSrc = MercadoLibreLogo;
      canal = 'MELI';
      break;
    case 4:
      logoSrc = WhatsAppLogo;
      canal = 'WhatsApp';
      break;
    default:
      logoSrc = InstagramLogo;
      canal = 'Otro';
  }
  const numeroCorto = conversation.channel_source.substr(3, 18);

  // Variables para mantener la fecha actual y decidir cuándo mostrar una nueva fecha
  let currentDate = '';

  return (
    <>
      <Navbar />
      <ConversationContainer canal={canal} style={{ paddingBottom: '100px' }}>
        <Box sx={{ padding: 2, position: 'relative' }}>
          <Typography variant="h4" gutterBottom>Detalles de la Conversación</Typography>
          <Typography variant="body1"><strong>Canal:</strong> {canal === "MELI" ? "Mercado Libre" : canal}</Typography>
          <Typography variant="body1"><strong>{canal === "MELI"?  "Referencia:" : "Numero:" }</strong> {canal === "MELI" ? conversation.channel_source : numeroCorto }</Typography>
          <Typography variant="body1"><strong>Fecha:</strong> {new Date(conversation.last_updated).toLocaleDateString()}</Typography>
          <Typography variant="body1"><strong>Hora:</strong> {new Date(conversation.last_updated).toLocaleTimeString()}</Typography>
          <Typography variant="body1"><strong>Prioridad:</strong> {""}</Typography>
          <CanalLogo src={logoSrc} alt={`${canal} logo`} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: 'white', border: "1px solid black", borderRadius: "20px" }}>
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((mensaje, index) => {
              const messageDate = formatDate(mensaje.timestamp);
              const isNewDay = messageDate !== currentDate;
              currentDate = messageDate;

              return (
                <React.Fragment key={index}>
                  {isNewDay && (
                    <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
                      <Typography variant="caption" color="grey">{messageDate}</Typography>
                    </Box>
                  )}
                  <Box display="flex" alignItems="center" justifyContent={mensaje.from === 'user' ? 'flex-start' : 'flex-end'}>
                    <AvatarWrapper de={mensaje.from} />
                    <ChatBubble de={mensaje.from} canal={canal} horaFecha={formatTime(mensaje.timestamp)}>
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
      </ConversationContainer>
    </>
  );
};

export default ConversationDetails;

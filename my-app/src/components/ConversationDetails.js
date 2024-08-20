import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import WhatsAppLogo from '../assets/WhatsAppLogo.svg';
import InstagramLogo from '../assets/Instagram.svg';
import MercadoLibreLogo from '../assets/mercadolibre.svg';
import { getConversationDetails, updateConversationMetadata } from '../services/bffService'; // Asegúrate de importar esta función
import ChatBubble from './ChatBubble';
import AvatarWrapper from './AvatarWrapper';
import ConversationContainer from './ConversationContainer';
import CanalLogo from './CanalLogo';
import Navbar from '../Home/Navbar';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, useMediaQuery } from '@mui/material';
import { deleteConversation } from '../services/bffService'; 
import StateSelector from './StateSelector';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const ConversationDetails = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversationDetails = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/');
      } else {
        try {
          const conversationDetails = await getConversationDetails(id, token);
          setConversation(conversationDetails);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchConversationDetails();
  }, [id, navigate]);

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await deleteConversation(id, token);
  
      // Elimina la conversación del sessionStorage
      const storedConversations = JSON.parse(sessionStorage.getItem('conversations'));
      if (storedConversations) {
        const updatedConversations = storedConversations.filter(conversation => conversation.id !== parseInt(id));
        sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
      }
  
      setOpen(false);
      navigate('/home');
    } catch (error) {
      console.error('Error al eliminar la conversación:', error.message);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

 
  const handleStateChange = (id, newState) => {
    // Actualiza el estado de la conversación actual en el objeto `conversation`
    setConversation(prevConversation => ({
      ...prevConversation,
        state: newState  // Aquí se actualiza el campo `state` en `metadata`
    }));
  
    // Actualiza también el estado en sessionStorage
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations'));
    if (storedConversations) {
      const updatedConversations = storedConversations.map(conversation =>
        conversation.id === parseInt(id) 
          ? { ...conversation, state: newState  }  // Actualiza el estado en el almacenamiento de sesión
          : conversation
      );
      sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
    }
  };
  
  

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
  const numeroCorto = conversation.channel_source?.substr(3, 18);

  let currentDate = '';
  console.log(conversation,"conversation")

  return (
    <>
      <Navbar />
      <ConversationContainer canal={canal} style={{ paddingBottom: '100px' }}>
        <Box sx={{ padding: 2, position: 'relative' }}>
          <Typography variant="h4" gutterBottom color="#b0b0b0">Detalles de la Conversación</Typography>
          <Typography color="#b0b0b0"><strong>Canal:</strong> {canal === "MELI" ? "Mercado Libre" : canal}</Typography>
          <Typography color="#b0b0b0"><strong>{canal === "MELI" ? "Referencia:" : "Numero:"}</strong> {canal === "MELI" ? conversation.channel_source : numeroCorto}</Typography>
          <Typography color="#b0b0b0"><strong>Fecha:</strong> {new Date(conversation.last_updated).toLocaleDateString()}</Typography>
          <Typography color="#b0b0b0"><strong>Hora:</strong> {new Date(conversation.last_updated).toLocaleTimeString()}</Typography>
          <div style={{display:"flex", justifyContent:"center" , width: isMobile? "30%" :"10%", border:"1px solid white", borderRadius:"5px", marginTop:"10px", marginBottom:"10px"}} >
            <strong style={{width:"100%", marginLeft:"10px"}}> 
              <StateSelector id={id} initialState={conversation.metadata? conversation.metadata.state : "baja" } onStateChange={handleStateChange}/>
            </strong>
          </div>
          <CanalLogo src={logoSrc} alt={`${canal} logo`} />
          
          <Button variant="contained" color="secondary" onClick={handleOpenDialog} sx={{ mt: 2 }}>
            Eliminar conversación
          </Button>
        </Box>
        
        <Dialog
          open={open}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{
            '& .MuiDialog-paper': {
              padding: '10px', 
              backgroundColor:"black",
              color:"white",
              boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)',
              borderRadius:"20px"
            },
          }}
        >
          <DialogTitle id="alert-dialog-title">¿Estás seguro de que queres eliminar esta conversación?</DialogTitle>
          <DialogActions>
            <Button onClick={handleCloseDialog}
            sx={{
              color:'purple',
              '&:hover': {
                boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra en hover
              }
            }}
            >
            Cancelar</Button>
            <Button onClick={handleDelete}
            sx={{
              color:'red',
              '&:hover': {
                boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra en hover
              }
            }}
            >
            Eliminar</Button>
          </DialogActions>
        </Dialog>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, backgroundColor: 'black', border: "1px solid white", borderRadius: "20px", }}>
          {conversation.messages && conversation.messages.length > 0 ? (
            conversation.messages.map((mensaje, index) => {
              const messageDate = formatDate(mensaje.timestamp);
              const isNewDay = messageDate !== currentDate;
              currentDate = messageDate;

              return (
                <React.Fragment key={index}>
                  {isNewDay && (
                    <Box sx={{ textAlign: 'center', marginTop: 2, marginBottom: 2 }}>
                      <Typography variant="caption" color="#b0b0b0">{messageDate}</Typography>
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

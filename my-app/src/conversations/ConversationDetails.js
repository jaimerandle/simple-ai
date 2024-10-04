import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, IconButton, useMediaQuery, TextField, Switch } from '@mui/material';
import Navbar from '../Home/Navbar';
import { getConversationDetails, deleteConversation } from '../services/bffService';
import ConversationHeader from './ConversationHeader';
import MessageList from './MessageList';
import DeleteDialog from './DeleteDialog';
import ConversationContainer from './ConversationContainer';
import WhatsAppLogo from '../assets/WhatsAppLogo.svg';
import InstagramLogo from '../assets/Instagram.svg';
import MercadoLibreLogo from '../assets/mercadolibre.svg';
import Loading from '../components/Loading';
import { ConversationsTop } from './ConversationTop';
import SendIcon from '@mui/icons-material/Send';

const ConversationDetails = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [manualMessage, setManualMessage] = useState(''); // Estado para el mensaje manual
  const [manualMode, setManualMode] = useState(false); // Estado del switch para modo manual
  const navigate = useNavigate();
  const textFieldRef = useRef(null); 

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

  useEffect(() => {
    if (manualMode && textFieldRef.current) {
      // Desplazarse hacia el TextField cuando el switch está activado
      textFieldRef.current.scrollIntoView({ behavior: 'smooth' });

    }
  }, [manualMode]);

  const handleStateChange = (id, newState) => {
    setConversation(prevConversation => ({
      ...prevConversation,
      state: newState
    }));

    const storedConversations = JSON.parse(sessionStorage.getItem('conversations'));
    if (storedConversations) {
      const updatedConversations = storedConversations.map(conversation =>
        conversation.id === parseInt(id)
          ? { ...conversation, state: newState }
          : conversation
      );
      sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
    }
  };

  // Maneja el cambio del switch
  const handleManualModeChange = (event) => {
    setManualMode(event.target.checked);
    if (event.target.checked && textFieldRef.current) {
      // Si el switch está activado, desplázate hacia el TextField
      textFieldRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Maneja el cambio en el campo de mensaje manual
  const handleManualMessageChange = (event) => {
    setManualMessage(event.target.value);
  };

  // Maneja el envío del mensaje manual
  const handleSendManualMessage = () => {
    if (manualMessage.trim() !== '') {
      // Aquí puedes implementar la lógica para enviar el mensaje manual al backend o actualizar el estado de la conversación
      console.log('Mensaje enviado:', manualMessage);
      setManualMessage(''); // Limpiar el campo de mensaje después de enviar
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading />
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
    case 1:
      logoSrc = WhatsAppLogo;
      canal = 'WhatsApp';
      break;
    case 6:
      logoSrc = WhatsAppLogo;
      canal = 'Demo';
      break;
    default:
      logoSrc = WhatsAppLogo;
      canal = 'WhatsApp';
  }

  return (
    <div style={{ height: '100vh', overflowY: 'auto' }}>
      <Navbar />
      <div style={{ width: "90%", marginLeft: "5%", height:"80vh" }}>
        <ConversationContainer canal={canal} style={{ paddingBottom: '100px', backgroundColor: "white" }}>
          <ConversationsTop canal={canal} logoSrc={logoSrc} style={{ backgroundColor: "white" }} />
          <div style={{ border: "0.3px solid #E1C9FF", zIndex: "1111", marginTop: "20px" }}></div>
          <Box sx={{ marginTop: 2, display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ marginRight: 2, marginLeft:2 }}>Modo IA</Typography>
          <Switch checked={manualMode} onChange={handleManualModeChange} />
          <Typography sx={{ marginLeft: 2 }}>Modo Manual</Typography>
          </Box>
          <div style={{ display: isMobile ? "block" : "flex", backgroundColor: "white" }}>
            <ConversationHeader conversation={conversation} id={id} isMobile={isMobile} onStateChange={handleStateChange} canal={canal} logoSrc={logoSrc} />
            <MessageList style={{ backgroundColor: "pink" }} conversation={conversation} />
          </div>

          {/* Agregar el switch y el campo de texto si está activado */}

          {manualMode && (
              <Box
              sx={{
                display: 'flex',
                alignItems: 'right',
                padding: '10px',
                borderRadius: '10px', // Bordes redondeados
                marginTop: 2,
                width: "100%",
                justifyContent:"flex-end"
              }}
              ref={textFieldRef} 
            >
              {/* Campo de texto estilo WhatsApp */}
              <TextField
              
                fullWidth
                placeholder="Escribe un mensaje..."
                value={manualMessage}
                onChange={handleManualMessageChange}
                variant="outlined"
                multiline
                style={{width:"65%", display:"flex", justifyContent:"flex-end"}}
                maxRows={4} // Limita las filas a 4 para un efecto similar a WhatsApp
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '8px 10px', // Espaciado interior
                    borderRadius: '20px', // Bordes redondeados
                    backgroundColor: 'white', // Fondo blanco
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey', // Sin borde visible
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'grey',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'transparent',
                  },
                }}
              />
        
              {/* Botón de enviar alineado a la derecha */}
              <IconButton
                color="primary"
                onClick={handleSendManualMessage}
                sx={{
                  marginLeft: '10px',
                  backgroundColor: '#25d366', // Color de fondo estilo WhatsApp
                  '&:hover': {
                    backgroundColor: '#22b358', // Color al hacer hover
                  },
                }}
              >
                <SendIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          )}
        </ConversationContainer>
      </div>
    </div>
  );
};

export default ConversationDetails;

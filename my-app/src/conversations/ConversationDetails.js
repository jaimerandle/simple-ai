import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, IconButton, useMediaQuery, TextField, Switch } from '@mui/material';
import Navbar from '../Home/Navbar';
import { getConversationDetails, deleteConversation, pauseConversation, resumeConversation, sendManualMessage, replyToConversation } from '../services/bffService';
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
  const [manualMessage, setManualMessage] = useState(''); // Estado para el mensaje manual
  const [manualMode, setManualMode] = useState(false); // Estado del switch para modo manual
  const navigate = useNavigate();
  const textFieldRef = useRef(null); 
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState(null);
  const token = localStorage?.getItem('authToken');
  const messagesEndRef = useRef(null);
  const [manualMessages, setManualMessages] = useState([]); 

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

  useEffect( () => {
    async function setStatus(){
      if ( await conversation?.status === 3 ){
        setManualMode(true)
        
      }
      else {setManualMode(false)}
    }
    setStatus()
    const pollMessages = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await getConversationDetails(id, token, lastMessageTimestamp);
  
        if (response.messages.length > 0) {
          const newTimestamp = response.messages[response.messages.length - 1].timestamp;
          setLastMessageTimestamp(newTimestamp);
  
          // Filtrar los nuevos mensajes que no están ya en la conversación y excluir los mensajes del "dashboard"
          const newMessages = response.messages.filter(
            msg => !conversation.messages.some(existingMsg => existingMsg.timestamp === msg.timestamp) 
            && msg.from !== 'dashboard' // Excluir mensajes que vienen del dashboard
          );
  
          if (newMessages.length > 0) {
            setConversation(prev => ({
              ...prev,
              messages: [...prev.messages, ...newMessages], // Agregar solo mensajes nuevos que no están duplicados
            }));
          }
        }
      } catch (error) {
        console.error('Error al hacer polling:', error);
      }
    };
  
    const pollingInterval = setInterval(pollMessages, 5000);
  
    return () => clearInterval(pollingInterval); 
  }, [id, lastMessageTimestamp, conversation?.messages]);
  
  
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };


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
  const handleManualModeChange = async (event) => {
    const isManual = event.target.checked ;
    setManualMode(isManual);
  
    if (isManual) {
      // Pausar la conversación
      try {
        await pauseConversation(id , token); // POST a /conversations/:id/pause
        console.log('Conversación pausada');
      } catch (error) {
        console.error('Error al pausar la conversación:', error);
      }
    } else {
      // Reanudar la conversación
      try {
        await resumeConversation(id, token); // POST a /conversations/:id/resume
        console.log('Conversación reanudada');
      } catch (error) {
        console.error('Error al reanudar la conversación:', error);
      }
    }
  
    if (isManual && textFieldRef.current) {
      textFieldRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Maneja el cambio en el campo de mensaje manual
  const handleManualMessageChange = (event) => {
    setManualMessage(event.target.value);
  };

// Función para enviar un mensaje manual
const handleSendManualMessage = async () => {
  if (manualMessage.trim() !== '') {
    try {
      const token = localStorage.getItem('authToken');
      await replyToConversation(id, { text: manualMessage }, token); // Enviar el mensaje manual

      const newMessage = {
        text: manualMessage,
        from: 'dashboard',
        timestamp: new Date().toISOString(),
      };

      // Actualizar la conversación localmente
      setConversation(prevConversation => ({
        ...prevConversation,
        messages: [...prevConversation?.messages, newMessage], // Agregar el mensaje manual
      }));

      // Agregar el mensaje manual a la lista de mensajes enviados
      setManualMessages(prev => [...prev, newMessage]);
      setManualMessage(''); // Limpiar el campo de mensaje
      scrollToBottom();
    } catch (error) {
      console.error('Error al enviar el mensaje manual:', error.message);
    }
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
            <MessageList style={{ backgroundColor: "pink" }} conversation={conversation} isManual={manualMode} />
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
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault(); // Evita que se agregue una nueva línea
                    // Detiene la propagación del evento para que no afecte al Switch
                    handleSendManualMessage(); // Llama a la función de envío de mensaje
                  }
                }}
                variant="outlined"
                multiline
                style={{width:"65%", display:"flex", justifyContent:"flex-end"}}
                maxRows={4} // Limita las filas a 4 para un efecto similar a WhatsApp
                sx={{
                  '& .MuiOutlinedInput-root': {
                    padding: '8px 10px', // Espaciado interior
                    borderRadius: '10px', // Bordes redondeados
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
                  alignSelf:"center",
                  height:"40px",
                  width:"4%",
                  backgroundColor: '#25d366', // Color de fondo estilo WhatsApp
                  '&:hover': {
                    backgroundColor: '#22b358', // Color al hacer hover
                  },
                }}
              >
                <SendIcon sx={{ color: 'white',  width:"100%" }} />
              </IconButton>
            </Box>
          )}
        </ConversationContainer>
      </div>
    </div>
  );
};

export default ConversationDetails;

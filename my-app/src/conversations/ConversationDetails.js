// ConversationDetails.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, useMediaQuery } from '@mui/material';
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
    <div>
      <Navbar />
      <div style={{width:"90%", marginLeft:"5%"}}>
      <ConversationContainer canal={canal} style={{ paddingBottom: '100px' , backgroundColor:"white" }}>
        <ConversationsTop canal={canal} logoSrc={logoSrc} style={{backgroundColor:"white"}}/>
        <div style={{border:"0.3px solid #E1C9FF", zIndex:"1111", marginTop:"20px"}}></div>
        <div style={{display:isMobile? "block":"flex", backgroundColor:"white"}}>
        <ConversationHeader conversation={conversation} id={id} isMobile={isMobile} onStateChange={handleStateChange} canal={canal} logoSrc={logoSrc}/>
        <MessageList style={{backgroundColor:"pink"}} conversation={conversation} />
        </div>
      </ConversationContainer>
    </div>
    </div>
  );
};

export default ConversationDetails;

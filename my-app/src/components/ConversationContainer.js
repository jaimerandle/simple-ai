// src/components/ConversationContainer.js

import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const ConversationContainer = styled(Box)(({ theme, canal }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: canal === 'WhatsApp' ? '#e5ddd5' : canal === 'Instagram' ? 'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)' : '#ffe600',
  padding: theme.spacing(2),
  height: '100vh',
  overflowY: 'auto',
  marginTop:"-20px",
  marginBottom:"40px"
}));

export default ConversationContainer;

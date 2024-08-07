// src/components/ChatBubble.js

import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const ChatBubble = styled(Box)(({ theme, de, canal }) => ({
  maxWidth: '70%',
  padding: theme.spacing(2),
  margin: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: de === 'cliente' ? theme.palette.grey[300] : theme.palette.primary.main,
  color: de === 'cliente' ? theme.palette.text.primary : theme.palette.common.white,
  alignSelf: de === 'cliente' ? 'flex-start' : 'flex-end',
  display: 'flex',
  alignItems: 'center',
  fontSize: '15px',
  ...(canal === 'Instagram' && {
    backgroundColor: de === 'user' ? '#E5E1E0' : '#833ab4',
  }),
  ...(canal === 'WhatsApp' && {
    backgroundColor: de === 'user' ? '#25d366' : '#34b7f1',
  }),
  ...(canal === 'MELI' && {
    backgroundColor: de === 'user' ? '#f1f1f1' : '#dfe6e9',
    color: theme.palette.text.primary,
  }),
}));

export default ChatBubble;

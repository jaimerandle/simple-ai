// src/components/MercadoLibreMessage.js

import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const MercadoLibreMessage = styled(Box)(({ theme, de }) => ({
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(2),
  marginLeft: de === 'usuario' ? theme.spacing(3) : 0,
  borderLeft: de === 'usuario' ? `2px solid ${theme.palette.grey[300]}` : 'none',
  paddingLeft: de === 'usuario' ? theme.spacing(1) : 0,
}));

export default MercadoLibreMessage;

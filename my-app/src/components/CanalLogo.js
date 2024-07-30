// src/components/CanalLogo.js

import React from 'react';
import { styled } from '@mui/material/styles';

const CanalLogo = styled('img')(({ theme }) => ({
  width: '70px',
  height: '70px',
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
}));

export default CanalLogo;

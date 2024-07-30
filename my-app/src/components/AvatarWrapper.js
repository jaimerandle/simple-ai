// src/components/AvatarWrapper.js

import React from 'react';
import Avatar from '@mui/material/Avatar';
import { styled } from '@mui/material/styles';

const AvatarWrapper = styled(Avatar)(({ theme, de }) => ({
  marginRight: de === 'cliente' ? theme.spacing(1) : 0,
  marginLeft: de === 'cliente' ? 0 : theme.spacing(1),
}));

export default AvatarWrapper;

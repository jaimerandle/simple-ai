// src/components/AvatarWrapper.js
// AvatarWrapper.js
import React from 'react';
import Avatar from '@mui/material/Avatar';
import nicoleAvatar from '../assets/Nicole.jpeg';  // Imagen de Nicole

const AvatarWrapper = ({ de }) => {
  const avatarSrc = de === 'user' ? "" : nicoleAvatar; // Si el mensaje es del usuario, muestra su avatar, si no, el de Nicole

  return (
    <Avatar
      src={avatarSrc}
      alt={de === 'user' ? 'Usuario' : 'Nicole'}
      sx={{
        width: 40,
        height: 40,
        margin: de === 'user' ? '0 10px 0 0' : '0 0 0 10px', 
        justifyContent: de !== "user"?? "flex-end",
        // Margen adecuado para posicionar el avatar correctamente
      }}
    />
  );
};

export default AvatarWrapper;


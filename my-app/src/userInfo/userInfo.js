import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import StoreIcon from '@mui/icons-material/Store';
import Navbar from '../Home/Navbar';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import './userInfo.css'; // Asegúrate de usar esta hoja de estilos

// Estilo para el contenedor del perfil del usuario
const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh', // Centra verticalmente el contenido
  padding: theme.spacing(4),
  backgroundColor: 'transparent',
  
}));

// Estilo para el avatar del usuario
const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(16),
  height: theme.spacing(16),
  marginBottom: theme.spacing(2),
}));

// Estilo para la caja que contiene la información del usuario
const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  padding: theme.spacing(4),
  textAlign: 'center',
  zIndex:"1111",
  width: '400px',
  marginTop:"-100px" // Tamaño fijo para la caja
}));

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width:600px)');
  
  useEffect(() => {
    const cachedUserInfo = localStorage.getItem('userInfo');
    if (cachedUserInfo) {
      setUser(JSON.parse(cachedUserInfo));
      setLoading(false);
    } else {
      const token = localStorage.getItem('authToken');
      if (!token) {
        localStorage.clear();
        sessionStorage.clear();
        navigate('/');
      }
    }
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loading />
      </Box>
    );
  }

  return (
    <div className="USER">
      <Navbar />
      <UserInfoContainer >
        <InfoBox style={{width: isMobile? '90%' : "", marginLeft: isMobile? '0%' : "", height:isMobile? "480px":""}}>
          <UserAvatar alt={user.name} src={user.avatar} style={{marginLeft:isMobile? "33%" : "30%", width:isMobile? "33%":"", height: isMobile? "70px": ""}}/>
          <Typography variant="h5" color="textPrimary" gutterBottom>{user.name}</Typography>
          <Typography variant="body1" color="black">{user.email}</Typography>
          <List style={{marginLeft:"20%"}}>
            <ListItem style={{marginTop:'25px'}}>
              <ListItemIcon style={{marginTop:"-20px"}}>
                <WhatsAppIcon color={user.whatsapp ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText  primary="WhatsApp" secondary={user.whatsapp ? "Cuenta activa" : "Cuenta inactiva"} />
            </ListItem>
            <div className='border'/>
            <ListItem>
              <ListItemIcon style={{marginTop:"-20px"}}>
                <InstagramIcon color={user.instagram ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText  primary="Instagram" secondary={user.instagram ? "Cuenta activa" : "Cuenta inactiva"} />
            </ListItem>
            <div className='border'/>
            <ListItem>
              <ListItemIcon style={{marginTop:"-20px"}}>
                <StoreIcon color={user.mercadolibre ? "primary" : "disabled"} />
              </ListItemIcon>
              <ListItemText primary="Mercado Libre" secondary={user.mercadolibre ? "Cuenta activa" : "Cuenta inactiva"} />
            </ListItem>
          </List>
        </InfoBox>
      </UserInfoContainer>
    </div>
  );
};

export default UserInfo;

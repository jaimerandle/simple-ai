import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import StoreIcon from '@mui/icons-material/Store';
import Navbar from '../Home/Navbar';
import { useNavigate } from 'react-router-dom';

const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(4),
  backgroundColor: "transparent",
}));

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const UserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <UserInfoContainer style={{ paddingBottom: '100px' }}>
        <UserAvatar alt={user.name} src={user.avatar} />
        <Typography variant="h5" color="#b0b0b0" gutterBottom>{user.name}</Typography>
        <Typography variant="body1" color="#b0b0b0">{user.email}</Typography>
        <Typography variant="body2" color="#b0b0b0">{user.bio}</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <WhatsAppIcon color={user.whatsapp ? "primary" : "primary"} />
            </ListItemIcon>
            <ListItemText  primary="WhatsApp" secondary={user.whatsapp ? "Cuenta activa" : "Cuenta inactiva"} style={{color:"#b0b0b0"}}/>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InstagramIcon color={user.instagram ? "primary" : "primary"} />
            </ListItemIcon>
            <ListItemText primary="Instagram" secondary={user.instagram ? "Cuenta activa" : "Cuenta inactiva"} style={{color:"#b0b0b0"}}/>
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StoreIcon color={user.mercadolibre ? "primary" : "primary"} />
            </ListItemIcon>
            <ListItemText primary="Mercado Libre" secondary={user.mercadolibre ? "Cuenta activa" : "Cuenta inactiva"} style={{color:"#b0b0b0"}} />
          </ListItem>
        </List>
      </UserInfoContainer>
    </>
  );
};

export default UserInfo;

// src/components/UserInfo.js

import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import InstagramIcon from '@mui/icons-material/Instagram';
import StoreIcon from '@mui/icons-material/Store';
import Navbar from '../Home/Navbar';
import { getUserInfo } from '../services/bffService';
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
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        localStorage.clear(); // Limpia todo el localStorage
        sessionStorage.clear(); // Limpia todo el sessionStorage
        navigate('/');
    } else {
      if (token) {
        try {
          const userInfo = await getUserInfo(token);
          setUser(userInfo);
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      }
    };
  }

    fetchUserInfo();
  }, []);

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
        <Typography variant="h5" gutterBottom>{user.name}</Typography>
        <Typography variant="body1" color="textSecondary">{user.email}</Typography>
        <Typography variant="body2" color="textSecondary">{user.bio}</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <WhatsAppIcon color={user.whatsapp ? "primary" : "disabled"} />
            </ListItemIcon>
            <ListItemText primary="WhatsApp" secondary={user.whatsapp ? "Cuenta activa" : "Cuenta inactiva"} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <InstagramIcon color={user.instagram ? "primary" : "disabled"} />
            </ListItemIcon>
            <ListItemText primary="Instagram" secondary={user.instagram ? "Cuenta activa" : "Cuenta inactiva"} />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <StoreIcon color={user.mercadolibre ? "primary" : "disabled"} />
            </ListItemIcon>
            <ListItemText primary="Mercado Libre" secondary={user.mercadolibre ? "Cuenta activa" : "Cuenta inactiva"} />
          </ListItem>
        </List>
      </UserInfoContainer>
    </>
  );
};

export default UserInfo;

// src/components/UserStats.js

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography, CircularProgress } from '@mui/material';
import { getConversations } from '../services/bffService';
import Navbar from '../Home/Navbar';

const UserStats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const conversations = await getConversations(token);
          const platformCounts = {
            'WhatsApp': 0,
            'Mercado Libre': 0,
            'Instagram': 0,
          };

          // Contar las conversaciones por plataforma basado en channel_id
          conversations.forEach(conversation => {
            switch (conversation.channel_id) {
              case 9:
                platformCounts['Mercado Libre']++;
                break;
              case 10:
                platformCounts['WhatsApp']++;
                break;
              case 11:
                platformCounts['Instagram']++;
                break;
              default:
                break;
            }
          });

          // Convertir los datos a un formato adecuado para recharts
          const chartData = Object.entries(platformCounts).map(([name, conversaciones]) => ({ name, conversaciones }));
          setData(chartData);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        
        setError('No auth token found');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const COLORS = {
    Instagram: 'url(#instagramGradient)',
    WhatsApp: '#63cb77',
    'Mercado Libre': '#ffe600',
    'Otro': '#8884d8'
  };

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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: "black",
          marginTop: "-20px",
          padding: '16px',
          paddingBottom: "100px"
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "white" }}>
          Dashboard de tus productos
        </Typography>
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          {error ? (
            <Typography variant="body1" color="error">{error}</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data}
                margin={{
                  top: 20, right: 10, left: 10, bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="instagramGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#833ab4" />
                    <stop offset="50%" stopColor="#fd1d1d" />
                    <stop offset="100%" stopColor="#fcb045" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip cursor={{ fill: 'grey' }} />
                <Legend />
                <Bar dataKey="conversaciones" fill="#8884d8">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserStats;

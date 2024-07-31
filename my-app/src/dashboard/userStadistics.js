// src/components/UserStats.js

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import { Box, Typography } from '@mui/material';
import conversations from '../data/conversations';
import Navbar from '../Home/Navbar';

const UserStats = () => {
  const platformCounts = {};

  // Contar las conversaciones por plataforma
  Object.values(conversations).forEach(conversation => {
    const canal = conversation.canal;
    if (platformCounts[canal]) {
      platformCounts[canal]++;
    } else {
      platformCounts[canal] = 1;
    }
  });

  // Convertir los datos a un formato adecuado para recharts
  const data = Object.entries(platformCounts).map(([name, conversaciones]) => ({ name, conversaciones }));

  const COLORS = {
    Instagram: 'url(#instagramGradient)',
    WhatsApp: '#63cb77',
    'Mercado Libre': '#ffe600',
  };

  return (
    <>
    <Navbar/>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor:"black",
        marginTop:"-20px"
      }}
    >
      <Typography variant="h4" gutterBottom style={{color:"white"}}>
        Dashboard de tus productos
      </Typography>
      <BarChart
        width={600}
        height={400}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
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
        <Tooltip cursor={{fill: 'grey'}} />
        <Legend />
        <Bar dataKey="conversaciones" fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Bar>
      </BarChart>
    </Box>
    </>
  );
};

export default UserStats;

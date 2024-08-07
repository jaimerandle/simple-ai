// src/components/UserStats.js

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography, CircularProgress, Button, ButtonGroup } from '@mui/material';
import { getConversations } from '../services/bffService';
import Navbar from '../Home/Navbar';

const COLORS = {
  'WhatsApp': '#63cb77',
  'Mercado Libre': '#ffe600',
  'Instagram': '#833ab4',
  'Otro': '#8884d8'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const channel = payload[0].name;
    const color = COLORS[channel];
    return (
      <div style={{ backgroundColor: '#333', color: 'white', padding: '10px', borderRadius: '5px' }}>
        <p style={{ margin: 0, color }}>{label}</p>
        <p style={{ margin: 0 }}>{`${channel}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const UserStats = () => {
  const [data, setData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('overall'); // 'overall' or 'weekly'

  useEffect(() => {
    const fetchConversations = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const conversations = await getConversations(token);
          
          // Overall data
          const platformCounts = {
            'WhatsApp': 0,
            'Mercado Libre': 0,
            'Instagram': 0,
          };
          
          // Weekly data
          const last7Days = {};
          for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            last7Days[dateString] = { 'WhatsApp': 0, 'Mercado Libre': 0, 'Instagram': 0 };
          }

          // Count conversations
          conversations.forEach(conversation => {
            const date = new Date(conversation.last_updated).toISOString().split('T')[0];
            const channel = conversation.channel_id === 9 ? 'Mercado Libre' :
                            conversation.channel_id === 10 ? 'WhatsApp' :
                            conversation.channel_id === 11 ? 'Instagram' : 'Otro';
            
            if (platformCounts[channel] !== undefined) {
              platformCounts[channel]++;
            }

            if (last7Days[date] && last7Days[date][channel] !== undefined) {
              last7Days[date][channel]++;
            }
          });

          const overallChartData = Object.entries(platformCounts).map(([name, conversaciones]) => ({ name, conversaciones }));
          const weeklyChartData = Object.entries(last7Days).map(([date, counts]) => ({
            date,
            ...counts,
          }));

          setData(overallChartData);
          setWeeklyData(weeklyChartData);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Changed to 'flex-start' to align items at the top
          alignItems: 'center',
          height: '100vh',
          overflowY: 'auto',
          marginTop: "-20px",
          background: 'linear-gradient(160deg, #ffffff, #cc86cc)',       
          paddingBottom:"100px"
        // Ensure vertical scroll is possible
        }}
      >
        <Typography variant="h4" gutterBottom style={{ color: "black" , marginTop:"25px"}}>
          Dashboard de tus productos
        </Typography>
        <ButtonGroup variant="contained" sx={{ marginBottom: 2 }}>
          <Button onClick={() => setView('overall')} color={view === 'overall' ? 'primary' : 'inherit'}>Vista General</Button>
          <Button onClick={() => setView('weekly')} color={view === 'weekly' ? 'primary' : 'inherit'}>Últimos 7 Días</Button>
        </ButtonGroup>
        <Box sx={{ width: '100%', maxWidth: 800, marginBottom: '20px' }}> {/* Added marginBottom */}
          {error ? (
            <Typography variant="body1" color="error">{error}</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              {view === 'overall' ? (
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="black" />
                  <XAxis dataKey="name" stroke="black" />
                  <YAxis stroke="black" />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#333', color: 'white' }} content={CustomTooltip} />
                  <Legend wrapperStyle={{ color: "black" }} />
                  <Bar dataKey="conversaciones" >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} strokeLinecap="inherit" stroke="#000" strokeWidth={1} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <BarChart
                  data={weeklyData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="black" />
                  <XAxis dataKey="date" stroke="black" />
                  <YAxis stroke="black" />
                  <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }} contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
                  <Legend wrapperStyle={{ color: "black" }} />
                  <Bar dataKey="WhatsApp" stackId="a" fill="#63cb77" stroke="#000" strokeWidth={1} />
                  <Bar dataKey="Mercado Libre" stackId="a" fill="#ffe600" stroke="#000" strokeWidth={1} />
                  <Bar dataKey="Instagram" stackId="a" fill="#833ab4" stroke="#000" strokeWidth={1} />
                </BarChart>
              )}
            </ResponsiveContainer>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default UserStats;

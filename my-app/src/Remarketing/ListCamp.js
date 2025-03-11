import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { format } from 'date-fns'; // Importamos la función de formateo

const CampañasListadas = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // Leemos las campañas almacenadas en sessionStorage
    const storedCampaigns = JSON.parse(sessionStorage.getItem('campaigns')) || [];
    setCampaigns(storedCampaigns);
  }, []);

  return (
    <Box sx={{ width: '100%', marginTop: '24px' }}>
      <Typography variant="h6" gutterBottom>
        Campañas Programadas:
      </Typography>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <Box
            key={campaign.id}
            sx={{
              marginBottom: '8px',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <Typography variant="body1">
              <strong>Mensaje:</strong> {campaign.message}
            </Typography>
            
            {/* Fecha de creación */}
            <Typography variant="body2">
              <strong>Fecha de creación:</strong> {campaign.campaignDate ? format(new Date(campaign.campaignDate), 'dd/MM/yyyy HH:mm') : 'No disponible'}
            </Typography>
            
            {/* Franja horaria */}
            <Typography variant="body2">
              <strong>Franja horaria:</strong> 
              {campaign.startDateTime && campaign.endDateTime
                ? `${format(new Date(campaign.startDateTime), ' HH:mm')} - ${format(new Date(campaign.endDateTime), ' HH:mm')}`
                : 'No disponible'}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" color="gray">
          No hay campañas programadas.
        </Typography>
      )}
    </Box>
  );
};

export default CampañasListadas;

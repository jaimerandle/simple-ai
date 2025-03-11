import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Formulario from './FormRemark';
import CampañasListadas from './ListCamp';
import Notificaciones from './Notification';
import Navbar from '../Home/Navbar';

const CampañaScreen = () => {
  const [openSnack, setOpenSnack] = useState(false);

  // Llamado cuando se guarda una campaña
  const handleCampaignSaved = () => {
    setOpenSnack(true);
  };

  return (
    <>
         <Navbar />
    <div style={{ height: '100vh', padding: '2%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Titulo */}
        <Typography variant="h6" gutterBottom style={{color:"purple"}}>
          Crear Campaña de Remarketing
        </Typography>

        {/* Formulario de entrada */}
        <Formulario onCampaignSaved={handleCampaignSaved} />

        {/* Listado de campañas */}
        <CampañasListadas />

        {/* Notificación de éxito */}
        <Notificaciones
          open={openSnack}
          onClose={() => setOpenSnack(false)}
          message="¡Campaña programada con éxito!"
        />
      </Box>
    </div>
    </>
  );
};

export default CampañaScreen;

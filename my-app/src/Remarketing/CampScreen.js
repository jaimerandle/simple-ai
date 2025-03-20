import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Formulario from './FormRemark';
import CampañasListadas from './ListCamp';
import Notificaciones from './Notification';
import Navbar from '../Home/Navbar';
import { getPeriodicJobs } from '../services/bffService';

const CampañaScreen = () => {
    const [campaigns, setCampaigns] = useState([]); // Estado para las campañas
    const [openSnack, setOpenSnack] = useState(false);
    const [campaignAdded, setCampaignAdded] = useState(false);


    const handleCampaignSaved = () => {
        setOpenSnack(true);
    };

    const updateCampaigns = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const userInfo = JSON.parse(localStorage.getItem("userInfo"));
            const clientId = userInfo.client_id;
            const fetchedCampaigns = await getPeriodicJobs(clientId, token);
            console.log("Campañas obtenidas:", fetchedCampaigns);
            setCampaigns(fetchedCampaigns); // Actualiza el estado en CampañaScreen
            setCampaignAdded(true);
        } catch (error) {
            console.error('Error al obtener las campañas:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ height: '100vh', padding: '2%', overflow: "auto" }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom style={{ color: "black", fontWeight: "bold" }}>
                        Crear Campaña de Remarketing
                    </Typography>

                    <Formulario onCampaignSaved={handleCampaignSaved} updateCampaigns={updateCampaigns} /> {/* Pasa updateCampaigns */}

                    {/* <CampañasListadas campaigns={campaigns} campaignAdded={campaignAdded}  /> Pasa campaigns */}

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
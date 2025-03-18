import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Tooltip,
  IconButton,
  Typography,
  Modal,
  CircularProgress,
} from '@mui/material';
import {
  createPeriodicJob,
  getPeriodicJobs,
  updatePeriodicJob,
  deletePeriodicJob,
} from '../services/bffService';
import Info from '@mui/icons-material/Info';
import Loading from '../components/Loading';

const Formulario = ({ onCampaignSaved, updateCampaigns }) => {
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startDateDaysAgo, setStartDateDaysAgo] = useState('');
  const [endDateDaysAgo, setEndDateDaysAgo] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [originalValues, setOriginalValues] = useState({});
  const isFirstRender = useRef(true);
  const [campaignId, setCampaignId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchCampaign = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const clientId = userInfo.client_id;
        const campaigns = await getPeriodicJobs(clientId, token);

        if (campaigns && campaigns.length > 0) {
          const campaign = campaigns[0];
          setCampaignId(campaign.id);
          setTitle(campaign.name);
          setMessage(campaign.config?.params?.prompt || '');
          const freq = scheduleToFrequency(campaign.schedule);
          setFrequency(freq.frequency);
          setDayOfWeek(freq.dayOfWeek);
          setStartDateDaysAgo(campaign.config?.params?.dateStart / 24);
          setEndDateDaysAgo(campaign.config?.params?.dateEnd / 24);
          setOriginalValues({
            message: campaign.config?.params?.prompt || '',
            title: campaign.name,
            frequency: freq.frequency,
            dayOfWeek: freq.dayOfWeek,
            startDateDaysAgo: campaign.config?.params?.dateStart / 24,
            endDateDaysAgo: campaign.config?.params?.dateEnd / 24,
          });
        }
      } catch (error) {
        console.error('Error al obtener la campaña:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, []);

  const scheduleToFrequency = (schedule) => {
    const parts = schedule.split(' ');
    if (parts.length === 6) {
      if (parts[1].startsWith('*/')) {
        const hours = parseInt(parts[1].substring(2), 10);
        if (hours === 24) return { frequency: 'allDays', dayOfWeek: '' };
        if (hours === 168 && parts[5] !== '*') {
          const dayOfWeekMap = {
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday',
            0: 'sunday',
          };
          return { frequency: 'oneDay', dayOfWeek: dayOfWeekMap[parseInt(parts[5])] };
        }
      } else if (parts[1] === '13' && parts[0] === '0' && parts[5] !== '*') {
        const dayOfWeekMap = {
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday',
          0: 'sunday',
        };
        return { frequency: 'oneDay', dayOfWeek: dayOfWeekMap[parseInt(parts[5])] };
      }
    } else if (parts.length === 5) {
      if (parts[1].startsWith('*/')) {
        const hours = parseInt(parts[1].substring(2), 10);
        if (hours === 24) return { frequency: 'allDays', dayOfWeek: '' };
        if (hours === 168 && parts[4] !== '*') {
          const dayOfWeekMap = {
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday',
            0: 'sunday',
          };
          return { frequency: 'oneDay', dayOfWeek: dayOfWeekMap[parseInt(parts[4])] };
        }
      } else if (parts[1] === '13' && parts[0] === '0' && parts[4] !== '*') {
        const dayOfWeekMap = {
          1: 'monday',
          2: 'tuesday',
          3: 'wednesday',
          4: 'thursday',
          5: 'friday',
          6: 'saturday',
          0: 'sunday',
        };
        return { frequency: 'oneDay', dayOfWeek: dayOfWeekMap[parseInt(parts[4])] };
      }
    }
    return { frequency: '', dayOfWeek: '' };
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
    if (e.target.value !== 'oneDay') {
      setDayOfWeek('');
    }
  };

  const handleDayOfWeekChange = (e) => {
    setDayOfWeek(e.target.value);
  };

  const handleStartDateDaysAgoChange = (e) => {
    setStartDateDaysAgo(e.target.value);
  };

  const handleEndDateDaysAgoChange = (e) => {
    setEndDateDaysAgo(e.target.value);
  };

  const frequencyToHours = (freq) => {
    switch (freq) {
      case 'allDays':
        return 24;
      case 'oneDay':
        return 168;
      default:
        return null;
    }
  };

  const checkChanges = () => {
    return (
      message !== originalValues.message ||
      title !== originalValues.title ||
      frequency !== originalValues.frequency ||
      dayOfWeek !== originalValues.dayOfWeek ||
      startDateDaysAgo !== originalValues.startDateDaysAgo ||
      endDateDaysAgo !== originalValues.endDateDaysAgo
    );
  };

  const handleSendCampaign = async () => {
    if (campaignId && checkChanges() && !isFirstRender.current) {
      setOpenModal(true);
    } else {
      await confirmSendCampaign();
    }
  };

  const confirmSendCampaign = async () => {
    if (message.trim()) {
      try {
        let hours = frequencyToHours(frequency);
        let schedule = `*/${hours} * * * *`;

        if (frequency === 'oneDay' && dayOfWeek) {
          const daysOfWeekMap = {
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
            sunday: 0,
          };
          const dayNumber = daysOfWeekMap[dayOfWeek];
          schedule = `0 13 * * ${dayNumber}`;
        }

        const token = localStorage.getItem('authToken');
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const assistant = JSON.parse(sessionStorage.getItem('asistentes'));
        const clientId = userInfo.client_id;
        const task = 'REMARKETING';
        const prompt = message;

        const endDateHours = parseInt(endDateDaysAgo) * 24;
        const startDateHours = parseInt(startDateDaysAgo) * 24;

        const params = {
          task: task,
          params: {
            clientId: clientId,
            assistantId: assistant[0].id,
            channelType: 7,
            dateEnd: endDateHours.toString(),
            dateStart: startDateHours.toString(),
            prompt: prompt,
          },
        };

        if (campaignId) {
            await updatePeriodicJob(campaignId, { name: title, config: params, schedule }, token);
          } else {
            const newCampaign = await createPeriodicJob(clientId, title, params, token, schedule);
            setCampaignId(newCampaign.id); // Actualizar campaignId con el ID de la nueva campaña
          }
       const campaigns = await getPeriodicJobs(clientId, token);
        if (campaigns && campaigns.length > 0) {
          const campaign = campaigns[0];
          setCampaignId(campaign.id);
          setTitle(campaign.name);
          setMessage(campaign.config?.params?.prompt || '');
          const freq = scheduleToFrequency(campaign.schedule);
          setFrequency(freq.frequency);
          setDayOfWeek(freq.dayOfWeek);
          setStartDateDaysAgo(campaign.config?.params?.dateStart / 24);
          setEndDateDaysAgo(campaign.config?.params?.dateEnd / 24);
          setOriginalValues({
            message: campaign.config?.params?.prompt || '',
            title: campaign.name,
            frequency: freq.frequency,
            dayOfWeek: freq.dayOfWeek,
            startDateDaysAgo: campaign.config?.params?.dateStart / 24,
            endDateDaysAgo: campaign.config?.params?.dateEnd / 24,
          });
        }

        onCampaignSaved();
        updateCampaigns();
        setOpenModal(false);
        setSuccessMessage('Tu campaña se creó/actualizó con éxito.');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error al crear/actualizar la campaña:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    if (isFirstRender.current) {
      setOriginalValues({ message, title, frequency, dayOfWeek, startDateDaysAgo, endDateDaysAgo });
      isFirstRender.current = false;
    }
  }, []);

  const tooltipMessages = {
    title: { title: 'Título de la Campaña', description: 'Asigna un nombre descriptivo a tu campaña para identificarla fácilmente.' },
    message: { title: 'Descripción del Remarketing', description: 'Indica cómo quieres que tu asistente realice el remarketing. Sé específico sobre el mensaje y la estrategia.' },
    frequency: { title: 'Frecuencia de Ejecución', description: 'Selecciona cada cuántos días se ejecutará el remarketing. Por ejemplo, cada 2 días o cada 10 días.' },
    days: { title: 'Rango de Fechas', description: 'Define el período de tiempo, en numero de dias, en el que tu asistente enfocará el remarketing. Indica los días hacia atrás desde el momento actual.' },
  };

  const renderTooltip = (field) => (
    <Tooltip title={
      <React.Fragment>
        <b>{tooltipMessages[field].title}</b>
        <br />
        {tooltipMessages[field].description}
      </React.Fragment>
    } arrow>
      <IconButton size="small">
        <Info />
      </IconButton>
    </Tooltip>
  );

  const handleDeleteCampaign = () => {
    setDeleteModalOpen(true);
  };

  const confirmDeleteCampaign = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await deletePeriodicJob(campaignId, token);
      setSuccessMessage('Eliminaste tu campaña con éxito.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setTitle('');
      setMessage('');
      setFrequency('');
      setDayOfWeek('');
      setStartDateDaysAgo('');
      setEndDateDaysAgo('');
      setCampaignId(null);
      setOriginalValues({});
      setDeleteModalOpen(false);
      await updateCampaigns();
    } catch (error) {
      console.error('Error al eliminar la campaña:', error);
    }
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  return (
   <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '60%',
      minHeight: '600px', // Aumenta la altura mínima de la caja
      padding: '24px',
      '& .MuiInputLabel-root': {
        color: 'black'
      },
      '& .MuiInputBase-root': {
        color: 'black'
      }
    }}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {successMessage && (
            <Typography variant="body1" color="success" sx={{ marginBottom: '16px' }}>
              {successMessage}
            </Typography>
          )}

          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <TextField
              label="Título de la Campaña"
              multiline
              rows={1}
              value={title}
              onChange={handleTitleChange}
              variant="outlined"
              fullWidth
              size="small"
              sx={{ flexGrow: 1, marginRight: '8px' }}
            />
            {renderTooltip('title')}
          </Box>

          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                ¿Estás seguro que quieres actualizar tu campaña?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button onClick={handleCloseModal} sx={{ marginRight: '8px' }}>Cancelar</Button>
                <Button onClick={confirmSendCampaign} variant="contained" color="primary">Confirmar</Button>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={deleteModalOpen}
            onClose={closeDeleteModal}
            aria-labelledby="delete-modal-title"
            aria-describedby="delete-modal-description"
          >
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography id="delete-modal-title" variant="h6" component="h2">
                ¿Estás seguro que quieres eliminar tu campaña?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button onClick={closeDeleteModal} sx={{ marginRight: '8px' }}>Cancelar</Button>
                <Button onClick={confirmDeleteCampaign} variant="contained" color="error">Eliminar</Button>
              </Box>
            </Box>
          </Modal>

          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <TextField
              helperText="ej: de acuerdo a lo que estuvimos hablando, preguntame si pude realizar la compra"
              label="Descripción del Remarketing"
              multiline
              rows={4}
              value={message}
              onChange={handleMessageChange}
              variant="outlined"
              fullWidth
              size="small"
              sx={{
                flexGrow: 1, marginRight: '8px', '& .MuiFormHelperText-root': {
                  color: 'black',
                },
              }}
            />
            {renderTooltip('message')}
          </Box>

          <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <FormControl fullWidth size="small" sx={{ flexGrow: 1, marginRight: '8px' }}>
              <InputLabel id="frequency-label">Frecuencia de Ejecución</InputLabel>
              <Select
                labelId="frequency-label"
                id="frequency-select"
                value={frequency}
                label="Frecuencia de Ejecución"
                onChange={handleFrequencyChange}
              >
                <MenuItem value="oneDay">Una vez por semana</MenuItem>
                <MenuItem value="allDays">Todos los dias</MenuItem>
              </Select>
            </FormControl>
            {renderTooltip('frequency')}
          </Box>
          {frequency === 'oneDay' && (
            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
              <FormControl fullWidth size="small" sx={{ flexGrow: 1, marginRight: '8px' }}>
                <InputLabel id="day-of-week-label">Día da Semana</InputLabel>
                <Select
                  labelId="day-of-week-label"
                  id="day-of-week-select"
                  value={dayOfWeek}
                  label="Día de la Semana"
                  onChange={handleDayOfWeekChange}
                >
                  <MenuItem value="monday">Lunes a las 13:00hs</MenuItem>
                  <MenuItem value="tuesday">Martes a las 13:00hs</MenuItem>
                  <MenuItem value="wednesday">Miércoles a las 13:00hs</MenuItem>
                  <MenuItem value="thursday">Jueves a las 13:00hs</MenuItem>
                  <MenuItem value="friday">Viernes a las 13:00hs</MenuItem>
                  <MenuItem value="saturday">Sábado a las 13:00hs</MenuItem>
                  <MenuItem value="sunday">Domingo a las 13:00hs</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
          <div style={{ width: '50%' }}>
            <div style={{ textAlign: 'center', marginBottom: '16px', fontSize: '1.2em', fontWeight: 'bold' }}>
              Antigüedad de las conversaciones:
            </div>
            <Grid container spacing={2} sx={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
              <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Antigüedad maxima (en dias)"
                  type="number"
                  value={startDateDaysAgo}
                  onChange={handleStartDateDaysAgoChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ flexGrow: 1, marginRight: '8px' }}
                />
              </Grid>
              <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  label="Antigüedad minima (en dias)"
                  type="number"
                  value={endDateDaysAgo}
                  onChange={handleEndDateDaysAgoChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ flexGrow: 1, marginRight: '8px' }}
                />
                {renderTooltip('days')}
              </Grid>
            </Grid>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendCampaign}
            sx={{
              width: '40%', marginBottom: '16px', backgroundColor: '#1976d2', color: 'white', '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {campaignId? "Actualizar Campaña" : "Enviar Campaña"}  
          </Button>
          {campaignId && (
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteCampaign}
              sx={{ width: '40%', backgroundColor: '#d32f2f', color: 'white', '&:hover': { backgroundColor: '#b71c1c' } }}
            >
           Eliminar Campaña
            </Button>
          )}
        </>
      )}
    </Box>
  );
};

export default Formulario;
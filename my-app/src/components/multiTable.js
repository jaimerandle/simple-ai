import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { TextField, CircularProgress, useMediaQuery, Select, MenuItem } from '@mui/material';
import { getConversations, updateConversationMetadata, deleteConversation } from '../services/bffService';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  '& .MuiDataGrid-columnHeader': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const getColorForState = (state) => {
  switch (state) {
    case 'alta':
      return 'red';
    case 'media':
      return 'orange';
    case 'baja':
      return 'green';
    default:
      return 'black';
  }
};

const StateSelector = ({ id, initialState, onStateChange }) => {
  const [state, setState] = useState(initialState);

  const handleChange = async (event) => {
    const newState = event.target.value;
    setState(newState);
    const token = localStorage.getItem('authToken');
    try {
      await updateConversationMetadata(id, { state: newState }, token);

      // Llamar a la función para actualizar el estado en SimpleTable
      onStateChange(id, newState);

      console.log('Estado actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar el estado:', error.message);
    }
  };

  return (
    <Select
      value={state}
      onChange={handleChange}
      variant="standard"
      fullWidth
      disableUnderline
      sx={{
        color: getColorForState(state),  // Aplicar color basado en el estado seleccionado
        fontWeight: 'bold',
        textShadow: '1px 1px 1px black',
        '& .MuiSelect-icon': {
          color: getColorForState(state),  // Aplicar color al ícono del select
        },
        '& .MuiOutlinedInput-notchedOutline': {
          border: 'none',
        },
      }}
    >
      <MenuItem value="alta" style={{ color: 'red' }}>Alta</MenuItem>
      <MenuItem value="media" style={{ color: 'orange' }}>Media</MenuItem>
      <MenuItem value="baja" style={{ color: 'green' }}>Baja</MenuItem>
    </Select>
  );
};

const ActionButton = ({ row, onDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleViewConversation = () => {
    navigate(`/conversation/${row.id}`);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('authToken');
    try {
      await deleteConversation(row.id, token);
  
      // Elimina la conversación del sessionStorage
      const storedConversations = JSON.parse(sessionStorage.getItem('conversations'));
      if (storedConversations) {
        const updatedConversations = storedConversations.filter(conversation => conversation.id !== row.id);
        sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
      }
  
      onDelete(row.id);
      setOpen(false); // Cierra el modal después de eliminar
    } catch (error) {
      console.error('Error al eliminar la conversación:', error.message);
    }
  };
  

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <IconButton color="primary" onClick={handleViewConversation}>
        <VisibilityIcon style={{ color: "black" }} />
      </IconButton>
      <IconButton color="secondary" onClick={handleOpen}>
        <DeleteIcon style={{ color: "black" }} />
      </IconButton>

      {/* Modal de confirmación */}
      <Dialog
      style={{background:"inear-gradient(160deg, #ffffff, #cc86cc)"}}
  open={open}
  onClose={handleClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
  sx={{
    '& .MuiDialog-paper': {
      padding: '10px', 
    },
  }}
>
  <DialogTitle
    id="alert-dialog-title"
    sx={{ textAlign: 'center', fontWeight: 'bold' }} // Centra y hace negrita el título
  >
    ¿Estás seguro de que queres borrar la conversación con la referencia "{row.referencia}" y ID {row.id}?
  </DialogTitle>
  <DialogContent>
  </DialogContent>
  <DialogActions
    sx={{ justifyContent: 'center' }} // Centra los botones
  >
    <Button onClick={handleClose} sx={{ color: 'purple' }}> 
      Cancelar
    </Button>
    <Button onClick={handleDelete} sx={{ color: 'red' }}> 
      Borrar
    </Button>
  </DialogActions>
</Dialog>
    </>
  );
};

const SimpleTable = () => {
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  const fetchConversations = async () => {
    setLoading(true);
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const conversations = await getConversations(token);
        const formattedRows = conversations.map((conversation) => {
          const date = new Date(conversation.last_updated);
          const formattedDate = date.toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          const formattedDateTime = date.toLocaleString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          }).replace(", ", " ");
          const numeroCorto = conversation.channel_source.substr(3, 18);
          const canal = conversation.channel_type === 3 ? 'Mercado Libre' : conversation.channel_type === 4 ? 'WhatsApp' : 'Instagram';
          const referencia = canal === 'WhatsApp' ? numeroCorto : conversation.channel_source.substr(0, 15);

          return {
            id: conversation.id,
            referencia: referencia,
            canal: canal,
            fechaHora: date,
            formattedFechaHora: isMobile ? formattedDate : formattedDateTime,
            state: conversation.metadata?.state || 'baja',
          };
        });

        formattedRows.sort((a, b) => b.fechaHora - a.fechaHora);

        sessionStorage.setItem('conversations', JSON.stringify(formattedRows));
        setRows(formattedRows);
        setFilteredRows(formattedRows);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const cachedConversations = sessionStorage.getItem('conversations');
    if (cachedConversations) {
      const parsedConversations = JSON.parse(cachedConversations);
      parsedConversations.sort((a, b) => b.fechaHora - a.fechaHora);
      setRows(parsedConversations);
      setFilteredRows(parsedConversations);
      setLoading(false);
    } else {
      fetchConversations();
    }
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilter(value);

    const filtered = rows.filter((row) =>
      row.id.toString().includes(value) ||
      row.canal.toLowerCase().includes(value) ||
      row.formattedFechaHora.toLowerCase().includes(value) ||
      row.referencia.toLowerCase().includes(value) ||
      row.state.toLowerCase().includes(value)
    );

    setFilteredRows(filtered);
  };

  const handleRefresh = () => {
    sessionStorage.removeItem('conversations');
    fetchConversations();
  };

  const handleDeleteRow = (id) => {
    const updatedRows = rows.filter(row => row.id !== id);
    const updatedFilteredRows = filteredRows.filter(row => row.id !== id);

    setRows(updatedRows);
    setFilteredRows(updatedFilteredRows);
    
    // Actualiza también en sessionStorage
    sessionStorage.setItem('conversations', JSON.stringify(updatedRows));
  };

  const handleStateChange = (id, newState) => {
    const updatedRows = rows.map(row => 
      row.id === id ? { ...row, state: newState } : row
    );
    setRows(updatedRows);
    setFilteredRows(updatedRows);
    
    // Actualiza también en sessionStorage
    sessionStorage.setItem('conversations', JSON.stringify(updatedRows));
  };

  
  const columns = isMobile
  ? [
      { field: 'referencia', headerName: 'Referencia', flex: 1 },
      {
        field: 'fechaHora',
        headerName: 'Fecha',
        flex: 1,
        sortComparator: (a, b) => new Date(b) - new Date(a),
      },
      {
        field: 'state',
        headerName: 'Estado',
        flex: 1,
        renderCell: (params) => (
          <StateSelector id={params.row.id} initialState={params.row.state} onStateChange={handleStateChange} />
        ),
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        flex: 1,
        renderCell: (params) => <ActionButton row={params.row} onDelete={handleDeleteRow} />,
      },
    ]
  : [
      { field: 'id', headerName: 'ID', flex: 1 },
      { field: 'referencia', headerName: 'Referencia', flex: 1 },
      { field: 'canal', headerName: 'Canal', flex: 1 },
      {
        field: 'fechaHora',
        headerName: 'Fecha y Hora',
        flex: 1,
        sortComparator: (a, b) => new Date(b) - new Date(a),
      },
      {
        field: 'state',
        headerName: 'Prioridad',
        flex: 1,
        renderCell: (params) => (
          <StateSelector id={params.row.id} initialState={params.row.state} onStateChange={handleStateChange} />
        ),
      },
      {
        field: 'actions',
        headerName: 'Acciones',
        flex: 1,
        renderCell: (params) => <ActionButton row={params.row} onDelete={handleDeleteRow} />,
      },
    ];

  return (
    <>
     <style  jsx global> 
       {`
       .css-ptiqhd-MuiSvgIcon-root {
         width: 0px;
         height: 0px;
       }
       .css-1k33q06 {
         width: 0px !important;
         height: 0px !important;
       }
       .css-t89xny-MuiDataGrid-columnHeaderTitle {
         font-weight: bold !important;
         width: 100%;
         position: absolute;
       }
       .css-mh3zap {
         font-weight: bold !important;
         width: 100%;
         position: absolute;
       }
       .MuiDataGrid-columnHeaderTitle css-mh3zap {
         font-weight: bold !important;
         width: 100% !important;
         position: absolute !important;
       }
      `}
    </style>
      <Box
        sx={{
          maxHeight: "400px",
          width: '100%',
          background: '',
          padding: isMobile ? 0 : 2,
          marginTop: "-25px",
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <TextField
            label="Filtrar"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            style={{ width: isMobile ? 'calc(100% - 1px)' : "400px", color: "black" }}
            sx={{
              width: isMobile ? 'calc(100% - 1px)' : '400px',
              '& .MuiInputBase-input': {
                color: 'black',
              },
              '& .MuiInputLabel-root': {
                color: 'black',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'black',
                },
                '&:hover fieldset': {
                  borderColor: 'black',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'black',
                },
              },
            }}
          />
          <IconButton color="black" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : (
          <StyledDataGrid
            rows={filteredRows.map(row => ({ ...row, fechaHora: row.formattedFechaHora }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
            autoHeight={false}
            getRowHeight={() => 'auto'}
            initialState={{
              sorting: {
                sortModel: [{ field: 'fechaHora', sort: 'desc' }],
              },
            }}
          />
        )}
      </Box>
    </>
  );
};


export default SimpleTable;
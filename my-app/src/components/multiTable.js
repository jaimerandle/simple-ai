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
import StateSelector from './StateSelector';
import NoteDialog from '../conversations/NoteDialog';
import Loading from './Loading';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    color: '#b0b0b0',
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
    color: "grey", // Color predeterminado del texto
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
  '& .MuiDataGrid-cell--textLeft': {
    color: "grey",
  },
  '& .MuiDataGrid-cell--textLeft:hover': {
    color: "#6728B8",
  },
  '& .MuiDataGrid-columnHeaderTitle': {
    color: "grey",
  },
  '& .MuiDataGrid-container--top, .MuiDataGrid-footerContainer, .css-yrdy0g-MuiDataGrid-columnHeaderRow': {
    background: "#E4E6EC",
    backgroundColor: "#E4E6EC !important",
  },
  '& .css-wop1k0-MuiDataGrid-footerContainer': {
    width: "0%",
    height: "0px",
  },
  '& .css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone': {
    '--DataGrid-rowBorderColor': "none",
  },
  '.MuiDataGrid-scrollbar': {
    width: "0px",
  },
  '& .MuiDataGrid-container--top [role="row"]': {
    background: "transparent !important",
  },
  '& .MuiDataGrid-row:hover': {
    backgroundColor: "#E4CAFF", // Cambiar el fondo de la fila al hacer hover
  },
  '& .MuiDataGrid-row:hover .MuiDataGrid-cell': {
    color: "#6728B8", // Cambiar el color del texto de todas las celdas al hacer hover en la fila
  }
}));

const ActionButton = ({ row, onDelete }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleViewConversation = () => {
    const url = `/conversation/${row.id}`; 
    window.open(url, '_blank');
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
      <IconButton color="primary" onClick={handleViewConversation}
       sx={{
        '&:hover': {
          boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra en hover
        }
      }}
      >
        <VisibilityIcon style={{ color: "#b0b0b0"}} />
      </IconButton>
      <IconButton color="secondary" onClick={handleOpen}
       sx={{
        '&:hover': {
          boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra en hover
        }
      }}
      >
        <DeleteIcon style={{ color: "#b0b0b0" }} />
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
      backgroundColor:"black",
      color:"white",
      boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)',
      borderRadius:"20px"
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
    <Button onClick={handleClose} 
    sx={{
      color:'purple',
      '&:hover': {
        boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)', // Sombra en hover
      }
    }}
    > 
      Cancelar
    </Button>
    <Button onClick={handleDelete} 
    sx={{
      color:'red',
      '&:hover': {
         boxShadow: '0 16px 54px 14px rgba(138, 43, 226, 0.5)'
      }
    }}
    > 
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
        console.log(conversations,"converstiosnsAll")
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
          const canal = conversation.channel_type === 3 ? 'Mercado Libre' : conversation.channel_type === 4 || 1 ? 'WhatsApp' : 'Instagram';
          const referencia = canal === 'WhatsApp' ? numeroCorto : conversation.channel_source.substr(0, 15);

          return {
            id: conversation.id,
            referencia: referencia,
            canal: canal,
            fechaHora: date,
            formattedFechaHora: isMobile ? formattedDate : formattedDateTime,
            state: conversation.metadata?.state || 'baja',
            note: conversation.metadata?.note || "",
            responsible: conversation.metadata?.responsible || "",
            extract: conversation.extract
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
    const fetchAndUpdateConversations = () => {
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
    };

    // Llamar a la función al montar el componente
    fetchAndUpdateConversations();

    // Listener para actualizaciones en sessionStorage
    const handleStorageChange = (event) => {
      if (event.key === 'conversations') {
        fetchAndUpdateConversations();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilter(value);
    console.log(rows,"ROW")

    const filtered = rows.filter((row) =>
      row.id.toString().includes(value) ||
      row.canal.toLowerCase().includes(value) ||
      row.formattedFechaHora.toLowerCase().includes(value) ||
      row.referencia.toLowerCase().includes(value) ||
      row.state.toLowerCase().includes(value) ||
      row.note.toLowerCase().includes(value) ||
      row.responsible.toLowerCase().includes(value) || 
      row.extract.toLowerCase().includes(value)
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
      <style jsx global>
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
          height: "70vh",
          width: '100%',
          background: '',
          padding: isMobile ? 0 : 2,
          marginTop: "15px",
          flexGrow: "1",
        }}
      >
        <Box sx={{ flexGrow: "1", display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          {!isMobile? <h1 style={{color:"grey", zIndex:"1111", fontSize:"30px", marginBottom:"-10px" }}>Dashboard</h1> : <></>}
          <TextField
            label="Filtrar"
            variant="outlined"
            value={filter}
            onChange={handleFilterChange}
            fullWidth
            margin="normal"
            style={{ width: isMobile ? 'calc(100% - 1px)' : "400px"}}
            sx={{
              width: isMobile ? 'calc(100% - 1px)' : '400px',
              '& .MuiInputBase-input': {
                color: '#b0b0b0',
              },
              '& .MuiInputLabel-root': {
                color: '#b0b0b0',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'grey',
                },
                '&:hover fieldset': {
                  borderColor: 'grey',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'grey',
                },
                "&.Mui-even": {
                  backgroundColor: "black"
                }
              },
            }}
          />
          <IconButton color="white" onClick={handleRefresh} style={{ color: "grey", width: isMobile ?? "20%" }} sx={{
          }}>
            <RefreshIcon style={{ height: "25px" }} />
          </IconButton>
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Loading/>
          </Box>
        ) : (
          <StyledDataGrid
            rows={filteredRows.map(row => ({ ...row, fechaHora: row.formattedFechaHora }))}
            columns={columns}
            getRowClassName={(params) =>
              params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
            }
            pageSize={10}
            rowsPerPageOptions={[5, 10, 20]}
            components={{ Toolbar: GridToolbar }}
            disableSelectionOnClick
            hideFooter
            autoHeight={false}
            getRowHeight={() => 'auto'}
            initialState={{
              sorting: {
                sortModel: [{ field: 'fechaHora', sort: 'desc' }],
              },
            }}
            sx={{
              flexGrow: 1, // Para que ocupe el espacio restante en el contenedor
              height: '100%',
            }}
          />
        )}
      </Box>
    </>
  );
};


export default SimpleTable;

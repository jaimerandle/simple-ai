import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RefreshIcon from '@mui/icons-material/Refresh';
import { TextField, CircularProgress, useMediaQuery } from '@mui/material';
import { getConversations } from '../services/bffService';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center',
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

const ActionButton = ({ row }) => {
  const navigate = useNavigate();

  const handleViewConversation = () => {
    navigate(`/conversation/${row.id}`);
  };

  return (
    <IconButton color="primary" onClick={handleViewConversation}>
      <VisibilityIcon style={{ color: "black" }} />
    </IconButton>
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
          }).replace(", ", " "); // Formatea la fecha y hora en español y elimina la coma
          const numeroCorto = conversation.channel_source.substr(3, 18);
          const canal = conversation.channel_type === 3 ? 'Mercado Libre' : conversation.channel_type === 4 ? 'WhatsApp' : 'Instagram';
          const referencia = canal === 'WhatsApp' ? numeroCorto : conversation.channel_source.substr(0, 15);

          return {
            id: conversation.id,
            referencia: referencia,
            canal: canal,
            fechaHora: date, // Guardamos la fecha como objeto Date para ordenar correctamente
            formattedFechaHora: isMobile ? formattedDate : formattedDateTime, // Mostramos solo la fecha en mobile
          };
        });

        formattedRows.sort((a, b) => b.fechaHora - a.fechaHora); // Ordenar filas antes de establecer el estado

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
      parsedConversations.sort((a, b) => b.fechaHora - a.fechaHora); // Ordenar filas en el caché
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
      row.referencia.toLowerCase().includes(value)
    );

    setFilteredRows(filtered);
  };

  const handleRefresh = () => {
    sessionStorage.removeItem('conversations');
    fetchConversations();
  };


  const columns = isMobile
    ? [
        { field: 'referencia', headerName: 'Referencia', flex: 1 },
        { field: 'canal', headerName: 'Canal', flex: 1 },
        {
          field: 'fechaHora',
          headerName: 'Fecha',
          flex: 1,
          sortComparator: (a, b) => new Date(b) - new Date(a), // Ordena de más reciente a más antiguo
        },
        {
          field: 'actions',
          headerName: 'Acciones',
          flex: 1,
          renderCell: (params) => <ActionButton {...params} />,
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
          sortComparator: (a, b) => new Date(b) - new Date(a), // Ordena de más reciente a más antiguo
        },
        {
          field: 'actions',
          headerName: 'Acciones',
          flex: 1,
          renderCell: (params) => <ActionButton {...params} />,
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

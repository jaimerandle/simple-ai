// src/components/SimpleTable.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import conversations from '../data/conversations';
import { TextField } from '@mui/material';


const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center', 
     // Centrar el texto de los encabezados de las columnas
  },
  '& .MuiDataGrid-cell': {
    textAlign: 'center',  // Centrar el texto de las celdas
  },
  '& .MuiDataGrid-footerContainer': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
    display: 'flex',
    justifyContent: 'center', // Centrar horizontalmente
    alignItems: 'center',     // Centrar verticalmente
  },
  '& .MuiDataGrid-columnHeader': {
    display: 'flex',
    justifyContent: 'center', // Centrar horizontalmente
    alignItems: 'center',     // Centrar verticalmente
  },
}));

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'canal', headerName: 'Canal', flex: 1 },
  { field: 'fecha', headerName: 'Fecha', flex: 1 },
  { field: 'hora', headerName: 'Hora', flex: 1 },
  {
    field: 'actions',
    headerName: 'Acciones',
    flex: 1,
    renderCell: (params) => <ActionButton {...params} />,
  },
];

const allRows = Object.values(conversations).map((conversation, index) => ({
  id: index + 1,
  canal: conversation.canal,
  fecha: conversation.fecha,
  hora: conversation.hora,
}));

const ActionButton = ({ row }) => {
  const navigate = useNavigate();
  
  const handleViewConversation = () => {
    navigate(`/conversation/${row.id}`);
  };

  return (
    <IconButton color="primary" onClick={handleViewConversation}>
      <VisibilityIcon style={{color:"black"}} />
    </IconButton>
  );
};

const SimpleTable = () => {
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState(allRows);

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilter(value);

    const filteredRows = allRows.filter((row) =>
      row.id.toString().includes(value) ||
      row.canal.toLowerCase().includes(value) ||
      row.fecha.toLowerCase().includes(value) ||
      row.hora.toLowerCase().includes(value)
    );

    setRows(filteredRows);
  };

  return (
    <>
    <style  jsx global> 
      {`
       .css-ptiqhd-MuiSvgIcon-root {
    width: 0px;
    height: 0px   } 
       .css-t89xny-MuiDataGrid-columnHeaderTitle  {
        font-weight: bold !important;
        width:100%;
        position:absolute
       }
      `}
    </style>
    <Box
      sx={{
       maxHeight:"400px",
        width: '100%',
        background: '',
        padding: 2,
        marginTop:"-25px",
      
      }}
    >
      <TextField
        label="Filtrar"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        style={{width:"400px"}}
      />
      <StyledDataGrid
        rows={rows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 20]}
        components={{ Toolbar: GridToolbar }}
        disableSelectionOnClick
        autoHeight ={false}
        getRowHeight={() => 'auto'}
      />
    </Box>
    </>
  );
};

export default SimpleTable;

import React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';


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
      width: "100%",
      height: "0px",
    },
    '& .css-s1v7zr-MuiDataGrid-virtualScrollerRenderZone': {
      '--DataGrid-rowBorderColor': "white !important",
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
    },
    '&.MuiDataGrid-row': {
      '--rowBorderColor': "white !important",
      '--DataGrid-rowBorderColor':  "white !important",
    },
    '& .Mui-selected': {
     // Quita el color de fondo de la fila seleccionada
      outline: 'none', // Elimina el contorno (borde) de la selección
    },
    // Elimina el efecto de "enfoque" (focus) en la fila seleccionada
    '& .MuiDataGrid-cell:focus': {
      outline: 'none', // Quitar el borde al hacer clic en una celda
    },
    // Ajustes adicionales para el color al seleccionar una fila
    '& .MuiDataGrid-row.Mui-selected:hover': {
      backgroundColor: '#E4CAFF', // Mantener el fondo de hover al seleccionar
    },
  }));
  

const ConversationTable = ({ rows, columns, pageSize, onStateChange, onDelete }) => {
  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      pageSize={pageSize}
      disableSelectionOnClick
      getRowHeight={() => 'auto'}
      components={{
        Toolbar: GridToolbar,
      }}
    />
  );
};

export default ConversationTable;

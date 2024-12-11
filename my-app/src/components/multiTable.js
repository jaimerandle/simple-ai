import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, } from '@mui/x-data-grid';
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
import { TextField, useMediaQuery, ButtonBase,Grid,Card,CardContent,Typography} from '@mui/material';
import { getConversations, updateConversationMetadata, deleteConversation } from '../services/bffService';
import StateSelector from './StateSelector';
import NoteDialog from '../conversations/NoteDialog';
import Loading from './Loading';
import ColumnSelector from './ColumnSelector';
import {Tooltip} from '@mui/material';



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
  "& .css-1di5fex-MuiTablePagination-root .MuiTablePagination-selectLabel":{
    marginTop: "20px",
    color:"grey",
    fontWeight:"bold"
  },
  "& .css-1di5fex-MuiTablePagination-root .MuiTablePagination-input":{
    marginTop:"8px",
    color:"grey",
    fontWeight:"bold"
  },
  "& .css-11oje6f-MuiTablePagination-displayedRows":{
    marginTop:"20px",
    color:"grey",
    fontWeight:"bold"
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

const SimpleTable = ({ customerDetails }) => {
  const [filter, setFilter] = useState('');
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');
  const [page, setPage] = useState(1); // Página actual
  const [pageSize, setPageSize] = useState(40);
  const [openNote, setOpenNote] = useState(false);
  const [selectedNote, setSelectedNote] = useState('');
  const [selectedResponsible, setSelectedResponsible] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  //intersection  Observer
  const [visibleCount,setVisibleCount] = useState(10);
  const loadMoreRef = useRef(null);




  const truncateNote = (note) => {
    return note.length > 50 ? `${note.substring(0, 30)}...` : note? note :"Sin notas";
  };

  console.log(selectedId, "selected")

  const handleOpenNoteDialog = (note, responsible, id) => {
    setOpenNote(true);
    setSelectedId(id);
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const currentConversation = storedConversations.find(conversation => conversation.id === id);
    
    if (currentConversation) {
      setSelectedNote(currentConversation.note || 'Sin notas');
      setSelectedResponsible(currentConversation.responsible || '');
    } else {
      setSelectedNote(note || 'Sin notas');
      setSelectedResponsible(responsible || '');
    }}

  const handleCloseNoteDialog = () => {
    setOpenNote(false);
  };

  const handleSaveNote = async (note, responsible) => {
    // Actualiza el sessionStorage
    const storedConversations = JSON.parse(sessionStorage.getItem('conversations')) || [];
    const updatedConversations = storedConversations.map(conversation => {
      if (conversation.id === selectedId) {
        return {
          ...conversation,
          note: note,
          responsible: responsible,
          state: conversation.state || "Sin Respuesta", // Si el state es null, setear a 'baja'
        };
      }
      return conversation;
    });
  
    sessionStorage.setItem('conversations', JSON.stringify(updatedConversations));
  
    // Actualiza también el estado local `rows` y `filteredRows` para que el Tooltip refleje el cambio
    setRows(updatedConversations);
    setFilteredRows(updatedConversations); // Si estás filtrando las filas
  
    // Actualiza la metadata en el backend
    const token = localStorage.getItem('authToken');
    const currentConversation = updatedConversations.find(conversation => conversation.id === selectedId);
  
    if (currentConversation) {
      try {
        const newMetadata = {
          ...currentConversation.metadata,
          note: note,
          responsible: responsible,
          state: currentConversation.state || "Sin Respuesta",
        };
  
        await updateConversationMetadata(selectedId, newMetadata, token);
      } catch (error) {
        console.error('Error al actualizar la metadata en el backend:', error.message);
      }
    }
  };
  
  
  // Definir las columnas fijas
  const allColumns = [
    { field: 'id', headerName: 'ID', flex: 1 },
    { field: 'referencia', headerName: 'Referencia', flex: 1 },
    { field: 'canal', headerName: 'Canal', flex: 1 },
    { 
      field: 'note', 
      headerName: 'Notas', 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.row.note}> {/* Mostrar todo el contenido de la nota al hacer hover */}
          <ButtonBase onClick={()=>handleOpenNoteDialog(params.row.note, params.row.responsible, params.row.id)}>{truncateNote(params.row.note)}</ButtonBase> {/* Truncar la nota a 50 caracteres */}
        </Tooltip>
      )
    },
    { field: 'fechaHora', headerName: 'Fecha y Hora', flex: 1, sortComparator: (a, b) => new Date(b) - new Date(a) },
    { field: 'state', headerName: 'Prioridad', flex: 1 ,
      renderCell: (params) => (
        <StateSelector id={params.row.id} initialState={params.row.state} onStateChange={handleStateChange} />
      )
    },
    { field: 'actions', headerName: 'Acciones', flex: 1,
      renderCell: (params) => <ActionButton row={params.row} onDelete={handleDeleteRow} />
    }
  ];

  // Procesar las customColumns que vienen en el objeto customerDetails
  const customColumns = customerDetails?.customColumns?.map(col => ({
    field: col.name,
    headerName: col.title,
    flex: 1,
    renderCell: (params) => params?.row?.metadata?.[col.name] || '', // Acceder al campo dentro de metadata
  })) || [];

  // Combinar columnas fijas con las columnas personalizadas
  const combinedColumns = [...allColumns, ...customColumns];
  
  // Las columnas seleccionables son todas menos las fijas 'id' y 'actions'
  const selectableColumns = combinedColumns.filter(
    (col) => col.field !== 'id' && col.field !== 'actions'
  );

  
  const [selectedColumns, setSelectedColumns] = useState(() => {
    const storedColumns = localStorage.getItem('selectedColumns');
    return storedColumns ? JSON.parse(storedColumns) : selectableColumns.map(col => col.field);
  });
  const [open, setOpen] = useState(false);

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
          
          const canal = conversation.channel_type === 3 ? 'Mercado Libre' : conversation.channel_type === 4 ? 'WhatsApp' : conversation.channel_type === 1 ? 'WhatsApp' : conversation.channel_type === 7 ? 'WhatsApp' : conversation.channel_type === 6? "Demo" : 'Instagram';
          const referencia = canal === 'WhatsApp' ? conversation.channel_source.substr(0, 15) : conversation.channel_source.substr(0, 15);
       
          return {
            id: conversation.id,
            referencia: referencia,
            canal: canal,
            fechaHora: date,
            formattedFechaHora: isMobile ? formattedDateTime : formattedDateTime,
            state: conversation.metadata?.state || "Sin Respuesta",
            note: conversation.metadata?.note || 'Sin notas',
            responsible: conversation.metadata?.responsible || "",
            extract: conversation.extract,
            metadata: conversation.metadata, // Asegúrate de incluir el campo metadata en los datos
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
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Incrementa los elementos visibles cuando el último es observado
          setVisibleCount((prev) => Math.min(prev + 10, filteredRows.length));
        }
      },
      { threshold: 1.0 } // Se activa cuando el 100% del elemento está visible
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [filteredRows]);


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

    const filtered = rows.filter((row) =>
      row.id.toString().includes(value) ||
      row.canal.toLowerCase().includes(value) ||
      row.formattedFechaHora.toLowerCase().includes(value) ||
      row.referencia.toLowerCase().includes(value) ||
      row.state.toLowerCase().includes(value) ||
      row.note.toLowerCase().includes(value) ||
      row.responsible.toLowerCase().includes(value) || 
      row.extract.toLowerCase().includes(value) || 
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

    sessionStorage.setItem('conversations', JSON.stringify(updatedRows));
  };

  const handleStateChange = (id, newState) => {
    const updatedRows = rows.map(row =>
      row.id === id ? { ...row, state: newState } : row
    );
    setRows(updatedRows);
    setFilteredRows(updatedRows);

    sessionStorage.setItem('conversations', JSON.stringify(updatedRows));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSaveColumns = (newSelectedColumns) => {
    setSelectedColumns(newSelectedColumns);
    localStorage.setItem('selectedColumns', JSON.stringify(newSelectedColumns));
    setOpen(false);
  };
  const displayedColumns = [
    ...combinedColumns.filter(
      (col) => col.field === 'id' || (selectedColumns.includes(col.field) && col.field !== 'actions')
    ),
    combinedColumns.find(col => col.field === 'actions') // Siempre agrega la columna 'actions' al final
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
     
          height:isMobile?"65vh":"70vh",
          width: '100%',
          background: '',
          padding: isMobile ? 1 : 2,
          marginTop: isMobile?"30px":"10px",
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
            <Button style={{display:isMobile?'none':''}} onClick={handleOpen}>Seleccionar Columnas</Button>
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
          <> 
            {
              !isMobile?(
                <StyledDataGrid
                rows={filteredRows.map(row => ({ ...row, fechaHora: row.formattedFechaHora }))}
                columns={displayedColumns}
                getRowClassName={(params) =>
                  params.indexRelativeToCurrentPage % 2 === 0 ? 'Mui-even' : 'Mui-odd'
                }
                pageSize={pageSize}
                disableSelectionOnClick
                autoHeight={false}
                getRowHeight={() => 'auto'}
                onPageChange={(newPage) => setPage(newPage + 1)}
                rowsPerPageOptions={[40]}
                  pagination
                components={{
                Toolbar: GridToolbar}}
                initialState={{
                  sorting: {
                    sortModel: [{ field: 'fechaHora', sort: 'desc' }],
                  },
                }}
                sx={{
                  flexGrow: 1, // Para que ocupe el espacio restante en el contenedor
                  height: '100%',
                }}
                renderCell
              />
              )
              :
              (<Box sx={{height:"85%",overflowY:"auto",backgroundColor:"white"}}>
                 {filteredRows.slice(0,visibleCount).map((item,index) => (
                
                  <Grid item xs={12} sm={12} md={12} key={item.id}  sx={{padding:"10px"}}>
                    <Card>
                      <CardContent sx={{display:"flex"}}>
                        <Box sx={{flex:"2"}}>
                          <Typography variant="h6" component="div">
                            ID {item.id}
                          </Typography>
                          <Box sx={{
                            display:"flex",
                            gap:'9%'
                          }}>
                            <Box>
                                <Typography variant='body2'>Referencia</Typography>
                                <Typography variant='body2'>Canal</Typography>
                                <Typography variant='body2'>Fecha</Typography>
                                <Typography variant='body2'>Hora</Typography>
                            </Box>
                            <Box>
                              <Typography variant="body2" color="grey">
                                {item.referencia}
                              </Typography>
                              <Typography variant="body2" color="grey">
                                {item.canal}
                              </Typography>
                              <Typography variant="body2" color="grey">
                                {item.formattedFechaHora.substring(0,16)}
                              </Typography>
                              <Typography variant="body2" color="grey">
                              {item.formattedFechaHora.substring(17,)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{flex:"1",display:"flex",flexDirection:"column",alignItems:"center"}}>
                        <StateSelector id={item.id} initialState={item.state} onStateChange={handleStateChange} />
                          <Typography variant='body2' color="grey" sx={{margin:"10px"}} >Acciones</Typography>
                          <Box sx={{display:"flex",gap:"10px"}}>
                            <ActionButton  row={item} onDelete={handleDeleteRow}/>
                          </Box>  
                        </Box>

                      </CardContent>
                    </Card>
                 
                  </Grid>
                  ))}
                {visibleCount < filteredRows.length && (
                        <div
                          ref={loadMoreRef}
                          style={{
                            height: "20px",
                            textAlign: "center",
                            color: "gray",
                            margin: "10px 0",
                          }}
                        >
                          Cargando más...
                        </div>
                      )}
              </Box>
              )
            }
        </>
        )}
      </Box>
      {openNote?(
        <NoteDialog
        open={openNote}
        handleClose={handleCloseNoteDialog}
        handleSave={handleSaveNote}
        initialNote={selectedNote}
        initialResponsible={selectedResponsible}
        id={selectedId}
      />
      ):(<></>)}
      {open? (
      <ColumnSelector
        availableColumns={selectableColumns}
        selectedColumns={selectedColumns}
        onSave={handleSaveColumns}
        onClose={handleClose}
        open={open}
      />):(<></>)}
    </>
  );
};


export default SimpleTable;

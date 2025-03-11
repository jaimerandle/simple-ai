import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { uploadFile, getUserFiles, deleteFiles } from '../services/bffService'; // Importa las funciones API
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import FileUploadInfo from './infoGestor';

const FileUpload = ({ isMobile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileDetails, setSelectedFileDetails] = useState(null); // Para almacenar el archivo seleccionado para detalles
  const [openFileModal, setOpenFileModal] = useState(false); // Para abrir el modal de detalles del archivo

  // Obtener client_id desde localStorage
  const cachedUserInfo = localStorage.getItem('userInfo');
  const clientId = cachedUserInfo ? JSON.parse(cachedUserInfo).client_id : null;
  const token = localStorage.getItem('authToken');

  // Convertir archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(file);
    });
  };

  // Manejar el cambio de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && clientId) {
      setSelectedFile(file);
      setLoading(true);

      try {
        // Convertir el archivo a base64
        const base64 = await convertToBase64(file);

        // Crear el objeto con la información del archivo
        const fileData = {
          name: file.name,
          type: file.type.split('/').pop(),
          clientId: clientId, // Usar el client_id de localStorage
          base64: base64,
        };

        // Subir el archivo a través de la API
        await uploadFile(fileData, token);

        setLoading(false); 
        loadUploadedFiles(); 
        console.log('Archivo cargado y guardado');
      } catch (error) {
        console.error('Error al convertir el archivo a base64:', error);
        setLoading(false); 
      }
    } else {
      console.error('No se pudo obtener el clientId o no se seleccionó un archivo');
    }
  };

  // Cargar los archivos almacenados del usuario
  const loadUploadedFiles = async () => {
    try {
      const files = await getUserFiles(clientId, token);
      setUploadedFiles(files.list);
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    }
  };

  // Eliminar archivo
  const handleDeleteFile = async (file) => {
    try {
      await deleteFiles(clientId, token, file);
      loadUploadedFiles();
    } catch (error) {
      console.error('Error al eliminar archivo:', error);
    }
  };

  // Abrir el modal con los detalles del archivo
  const handleFileClick = (file) => {
    const fileUrl = `https://simple-ai-client-data.s3.amazonaws.com/${clientId}/public/${file}`;
    setSelectedFileDetails({
      name: file,
      url: fileUrl,
    });
    setOpenFileModal(true);
  };

  // Cerrar el modal de detalles
  const handleCloseFileModal = () => {
    setOpenFileModal(false);
    setSelectedFileDetails(null);
  };

  // Función para copiar la URL al portapapeles
  const copyToClipboard = () => {
    if (selectedFileDetails && selectedFileDetails) {
      navigator.clipboard.writeText(selectedFileDetails);
      alert('URL copiada al portapapeles');
    }
  };

  useEffect(() => {
    if (clientId) {
      loadUploadedFiles(); // Cargar archivos al montar el componente
    }
  }, [clientId]);  // Dependiendo del client_id

  return (
    <div>
      <Button
        sx={{
          display: 'flex',
          width: isMobile ? '50%' : '100%',
          border: '1px solid grey',
          height: '50px',
          backgroundColor: 'white',
          color: 'grey',
          '&:hover': {
            backgroundColor: 'rgb(67, 10, 98)',
            color: 'white',
          },
        }}
        onClick={() => setIsModalOpen(true)}
      >
        Seleccionar archivo
      </Button>

      {/* Modal para la gestión de archivos */}
      {isModalOpen && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <button onClick={() => setIsModalOpen(false)} style={closeButtonStyles}>
              X
            </button>
            <FileUploadInfo/>
            <h5>Archivos cargados:</h5>
            {uploadedFiles.length > 0 ? (
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>
                    <strong>
                      <Button
                        sx={{ textDecoration: 'underline', padding: '0', margin: '0 5px' }}
                        onClick={() => handleFileClick(file)}
                      >
                        {isMobile ? file.length > 20 ? file.substr(0, 19).replace(/\.[^.]+$/, '') + '...' : file.replace(/\.[^.]+$/, '') : file.length > 70 ? file.substr(0, 69).replace(/\.[^.]+$/, '') + '...' : file.replace(/\.[^.]+$/, '')}
                      </Button>
                    </strong>
                    <DeleteIcon onClick={() => handleDeleteFile(file)} style={deleteButtonStyles}/>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay archivos cargados.</p>
            )}

            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            <Button
              sx={{
                width: '100%',
                marginTop: '10px',
                height: '50px',
                backgroundColor: 'white',
                color: 'grey',
                '&:hover': {
                  backgroundColor: 'rgb(67, 10, 98)',
                  color: 'white',
                },
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              Seleccionar archivo
            </Button>
          </div>
        </div>
      )}

      {/* Modal de detalles del archivo */}
      {openFileModal && selectedFileDetails && (
        <Dialog open={openFileModal} onClose={handleCloseFileModal}>
          <DialogTitle>Detalles del Archivo</DialogTitle>
          <DialogContent>
            <Typography variant="h6">Nombre del Archivo:</Typography>
            <Typography variant="body1">{selectedFileDetails.name.replace(/\.[^.]+$/, '')}</Typography>
            <Typography variant="h6" sx={{ marginTop: '16px' }}>URL del Archivo:</Typography>
            <Typography variant="body1">
              <a href={selectedFileDetails.url} target="_blank" rel="noopener noreferrer">
                {selectedFileDetails.url}
              </a>
            <ContentCopyIcon
              onClick={copyToClipboard}
              sx={{ marginLeft: '10px', color: 'rgb(67, 10, 98)', cursor:"pointer" }}
            />
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFileModal} color="primary">Cerrar</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

// Estilos del modal
const modalStyles = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: '1000',
};

const modalContentStyles = {
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '5px',
  width: '70%',
  textAlign: 'center',
  position: 'relative',
  maxHeight: '400px',
  overflowY: 'auto',
};

const closeButtonStyles = {
  position: 'absolute',
  top: '10px',
  right: '10px',
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
};

const deleteButtonStyles = {
  marginLeft: '10px',
  color: 'red',
  cursor: 'pointer',
  padding: '3px'
};

export default FileUpload;

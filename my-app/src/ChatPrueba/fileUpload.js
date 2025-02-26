import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';

const FileUpload = ({ isMobile }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal
  const [uploadedFiles, setUploadedFiles] = useState([]); // Para almacenar los archivos cargados

  // Convertir archivo a base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);  // El resultado será el archivo en base64
      reader.onerror = (error) => reject(error);
    });
  };

  // Manejar el cambio de archivo
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Guardamos el archivo seleccionado en el estado
      setLoading(true); // Iniciar el loading

      try {
        // Convertir el archivo a base64
        const base64 = await convertToBase64(file);

        // Crear el objeto con la información del archivo
        const fileData = {
          name: file.name,
          type: file.type,
          base64: base64,
        };

        // Guardar los datos en sessionStorage
        sessionStorage.setItem(file.name, JSON.stringify(fileData));

        // Actualizamos el estado con los datos del archivo
        setFileData(fileData);
        setLoading(false); // Detener el loading
        loadUploadedFiles(); // Cargar los archivos después de subir uno nuevo

        console.log('Archivo cargado y guardado en sessionStorage');
      } catch (error) {
        console.error('Error al convertir el archivo a base64:', error);
        setLoading(false); // Detener el loading en caso de error
      }
    }
  };

  // Cargar los archivos almacenados en sessionStorage
  const loadUploadedFiles = () => {
    const files = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      const file = sessionStorage.getItem(key);
      if (file) {
        try {
          const fileObj = JSON.parse(file);

          // Asegurarse de que el objeto tenga la estructura correcta
          if (fileObj.name && fileObj.type && fileObj.base64) {
            files.push(fileObj); // Solo agregamos los archivos válidos
          }
        } catch (error) {
          console.error('Error al cargar archivo desde sessionStorage:', error);
        }
      }
    }
    setUploadedFiles(files); // Actualizamos el estado con los archivos cargados
  };

  // Eliminar archivo de sessionStorage
  const handleDeleteFile = (fileName) => {
    sessionStorage.removeItem(fileName);
    loadUploadedFiles();
  };

  useEffect(() => {
    loadUploadedFiles(); // Cargar archivos al montar el componente
  }, [loadUploadedFiles , handleDeleteFile]);

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
        onClick={() => setIsModalOpen(true)} // Abrir el modal
      >
        Seleccionar archivo
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div style={modalStyles}>
          <div style={modalContentStyles}>
            <button onClick={() => setIsModalOpen(false)} style={closeButtonStyles}>
              X
            </button>
            <h2>Gestión de Archivos</h2>
            <p>En esta sección podrás cargar, visualizar y eliminar archivos. Los formatos permitidos son .png, .pdf, .img y .csv. Además, podrás hacer referencia a estos archivos desde el prompt, indicando cuál deseas usar. Ejemplo: "El archivo remeraVerde.png debe enviarse cuando se solicite una remera verde."</p>

            <h3>Archivos cargados:</h3>
            {uploadedFiles.length > 0 ? (
              <ul>
                {uploadedFiles.map((file, index) => (
                    <>
                  <li key={index}>
                    <strong>{file.name.length > 20? file.name.substr(0, 19) + "..." : file.name }</strong> ({file.type})
                    <button onClick={() => handleDeleteFile(file.name)} style={deleteButtonStyles}>Eliminar</button>
                  </li>
                    <br></br>
                    </>
                ))}
              </ul>
            ) : (
              <p>No hay archivos cargados.</p>
            )}

            <input
              type="file"
              id="file-input"
              style={{ display: 'none' }}  // Ocultamos el input de archivo
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
              onClick={() => document.getElementById('file-input').click()} // Abre el explorador de archivos dentro del modal
            >
              Seleccionar archivo
            </Button>
          </div>
        </div>
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
    width: "70%",
    textAlign: 'center',
    position: 'relative',
    maxHeight: '400px',  // Limita la altura del modal
    overflowY: 'auto',   // Agrega el scroll si es necesario
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
  backgroundColor: 'red',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  borderRadius:"10px",
  border:"1px solid grey",
  padding:"5px"
};

export default FileUpload;

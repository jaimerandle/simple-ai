import React from 'react';
import { Tooltip, IconButton, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const FileUploadInfo = () => {
  return (
    <div style={headerStyles}>
      <Typography style={{color:"purple"}} variant="h5">Gestión de Archivos</Typography>

      {/* Tooltip con el icono de información */}
      <Tooltip
        title={
            <React.Fragment>
              <p><strong>Gestión de Archivos</strong></p>
            <p>Desde esta sección podrás <strong>subir</strong> y <strong>eliminar</strong> archivos que utilizarás para interactuar con tu asistente.</p>
            <p>Estos archivos son esenciales para indicarle al asistente qué contenido debe enviar a tus clientes en función de sus consultas.</p>
            <p>La url la encontraras clickeando en el archivo que quieras utilizar</p>
            <p><strong>Ejemplo:</strong> Si un cliente pregunta por el proyecto "simple", envíale este archivo PDF:</p>
            <p>"https://simple-ai-client-data.s3.amazonaws.com/1/public/simple-ai.pdf"</p>
            <p>De esta manera, el asistente sabrá cuál archivo enviar según el caso específico que mencionaste.</p>
          </React.Fragment>
        }
        placement="bottom"
      >
        <IconButton>
          <InfoIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

const headerStyles = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '16px',
  justifyContent:"center"
};

export default FileUploadInfo;

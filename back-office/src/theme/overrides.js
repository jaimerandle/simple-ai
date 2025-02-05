// src/theme/overrides.ts
const overrides = {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          backgroundColor: '#ff79c6',
          color: '#282a36',
          '&:hover': {
            backgroundColor: '#bd93f9',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#44475a', // Fondo oscuro para tarjetas
          color: '#f8f8f2',
        },
      },
    },
  };
  
  export default overrides;
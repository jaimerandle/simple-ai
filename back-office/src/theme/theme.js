// src/theme/theme.ts
import { createTheme } from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const theme = createTheme({
  palette,
  typography,
  components: overrides,
});

export default theme;
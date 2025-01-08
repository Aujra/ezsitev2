import { createTheme } from '@mui/material/styles';
import { poppins } from './fonts';

export const lightTheme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  // ...existing theme configuration...
});

export const darkTheme = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
  },
  // ...existing theme configuration...
});

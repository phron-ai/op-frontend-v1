import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e3342f', // Red color for primary actions
    },
    secondary: {
      main: '#4a5568', // Gray color for secondary actions
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme; 
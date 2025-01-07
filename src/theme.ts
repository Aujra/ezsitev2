import { createTheme, Theme } from '@mui/material/styles';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0F766E',
      light: '#14B8A6',
      dark: '#0D9488',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Changed from '#0f172a' to pure black for maximum contrast
      secondary: '#1a1a1a', // Changed from '#334155' to darker gray
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #0EA5E9 0%, #6366f1 100%)', // Sky blue to indigo
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)', // Darker variation
          },
          boxShadow: '0 4px 6px -1px rgba(14, 165, 233, 0.2), 0 2px 4px -2px rgba(99, 102, 241, 0.2)',
        },
        text: {
          color: '#000000', // Match light theme text color
        },
        outlined: {
          color: '#000000', // Match light theme text color
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit'
        }
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          color: '#000000'
        }
      }
    }
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#14B8A6',
      light: '#2DD4BF',
      dark: '#0D9488',
    },
    secondary: {
      main: '#818cf8',
      light: '#a5b4fc',
      dark: '#6366f1',
    },
    background: {
      default: '#0F172A',
      paper: '#1E293B',
    },
    text: {
      primary: '#ffffff', // Changed from '#f8fafc' to pure white for better contrast
      secondary: '#e2e8f0', // Changed from '#cbd5e1' to lighter gray
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
        contained: {
          background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', // Indigo to purple
          color: '#ffffff',
          '&:hover': {
            background: 'linear-gradient(135deg, #4338CA 0%, #6D28D9 100%)', // Darker variation
          },
          boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -2px rgba(124, 58, 237, 0.2)',
        },
        text: {
          color: '#ffffff', // Match dark theme text color
        },
        outlined: {
          color: '#ffffff', // Match dark theme text color
        },
      },
    },
  },
});

export const themes: { [key: string]: Theme } = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (themeName: string): Theme => {
  return themes[themeName] || lightTheme;
};

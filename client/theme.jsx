import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#ff7180',
      main: '#ff4057',
      dark: '#d92f45',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#4a5266',
      main: '#252b3a',
      dark: '#171c29',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f7f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#252b3a',
      secondary: '#687083',
    },
    success: {
      main: '#2e9d6f',
    },
    warning: {
      main: '#e48a2f',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: { fontWeight: 800 },
    h5: { fontWeight: 800 },
    h6: { fontWeight: 700 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          boxShadow: 'none',
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #eceef3',
          boxShadow: '0 10px 30px rgba(37, 43, 58, 0.06)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})

export default theme

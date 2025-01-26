import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TablesPage from './pages/TablesPage';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material';

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>

    <QueryClientProvider client={queryClient}>
      <CssBaseline />
      <TablesPage />
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

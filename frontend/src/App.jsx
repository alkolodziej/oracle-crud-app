import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TablesPage from "./pages/TablesPage";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material";
import { ConfirmProvider } from "material-ui-confirm";

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <QueryClientProvider client={queryClient}>
        <ConfirmProvider>
          <CssBaseline />
          <TablesPage />
        </ConfirmProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;

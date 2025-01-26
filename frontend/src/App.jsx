import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataList from './components/DataList';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Pracownicy</h1>
        <DataList />
      </div>
    </QueryClientProvider>
  );
}

export default App;

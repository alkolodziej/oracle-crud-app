import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useFetchTableData = (tableName) => {
  return useQuery({
    queryKey: ['tableData', tableName],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tables/${tableName}`);
      return data;
    },
    enabled: !!tableName, // Pobieranie uruchamia się tylko, gdy istnieje tableName
  });
};

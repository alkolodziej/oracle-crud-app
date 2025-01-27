import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

export const useFetchTableData = (tableName) => {
  return useQuery({
    queryKey: ['tableData', tableName],
    queryFn: async () => {
      const { data } = await apiClient.get(`/tables/${tableName}`);
      // return data;
      const returnData = {
        columns: data?.columns,
        // rows: column name : value, now data.data = array [1,2,3,...]
        rows: data?.data?.map((row) => {
          return data.columns.reduce((acc, column, index) => {
            acc[column.name?.toLowerCase()] = row[index];
            return acc;
          }, {});
        }),
        
      };
      return returnData;
    },
    enabled: !!tableName, // Pobieranie uruchamia się tylko, gdy istnieje tableName
  });
};

import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';
export const useFetchTables = () => {
  return useQuery({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await apiClient.get('/tables');
      return data?.tables;
    }
  });
};